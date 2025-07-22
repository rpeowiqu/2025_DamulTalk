package com.demo.damulTalk.user.service;

import com.demo.damulTalk.common.scroll.CursorPageMetaDto;
import com.demo.damulTalk.common.scroll.ScrollResponse;
import com.demo.damulTalk.friend.domain.Friend;
import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.friend.mapper.FriendMapper;
import com.demo.damulTalk.user.dto.FriendshipStatus;
import com.demo.damulTalk.user.dto.ProfileUpdateRequest;
import com.demo.damulTalk.user.dto.UserInfo;
import com.demo.damulTalk.user.mapper.UserMapper;
import com.demo.damulTalk.util.UserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserUtil userUtil;
    private final FriendMapper friendMapper;
    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Override
    public UserInfo getUserInfo(Integer id) {
        log.info("[UserService] 유저 정보 조회 시작");

        if(id == null)
            id = userUtil.getCurrentUserId();

        int userId = userUtil.getCurrentUserId();

        UserInfo info = userMapper.selectUserInfo(userId, id);
        if(id == userId)
            info.setIsFriend(FriendshipStatus.ME);
        else {
            Friend relationship = friendMapper.selectFriendRelationShipById(userId, id);

            if(relationship != null) {
                if (relationship.getStatus().equals("PENDING") && relationship.getFirstUserId().equals(userId))
                    info.setIsFriend(FriendshipStatus.PENDING_REQUEST);
                else if (relationship.getStatus().equals("PENDING") && relationship.getFirstUserId().equals(id))
                    info.setIsFriend(FriendshipStatus.PENDING_RESPONSE);
                else if (relationship.getStatus().equals("ACCEPTED"))
                    info.setIsFriend(FriendshipStatus.ACCEPTED);
            } else {
                info.setIsFriend(FriendshipStatus.NONE);
            }
        }

        return info;
    }

    @Override
    public ScrollResponse<List<FriendDto>, String> getSearchResult(String nickname, String cursor, int size) {
        log.info("[UserService] 친구 검색 시작 - nickname: {}, cursor: {}, size: {}", nickname, cursor, size);

        int userId = userUtil.getCurrentUserId();
        List<FriendDto> results = userMapper.selectUsersByNickname(userId, nickname, cursor, size + 1);

        boolean hasNext = results.size() > size;
        String nextCursor = null;

        if (hasNext) {
            FriendDto lastItem = results.remove(size); // size + 1 번째 항목 제거 후 커서 지정
            nextCursor = lastItem.getNickname();       // 다음 요청 시 커서로 사용
        }

        CursorPageMetaDto<String> meta = CursorPageMetaDto.<String>builder()
                .nextCursor(nextCursor)
                .hasNext(hasNext)
                .build();
        log.info("[UserService] 검색 결과 조회 성공");

        return ScrollResponse.<List<FriendDto>, String>builder()
                .data(results)
                .meta(meta)
                .build();
    }

    public UserInfo updateUserInfo(Integer userId, ProfileUpdateRequest request, MultipartFile profileImage, MultipartFile backgroundImage) {
        log.info("[UserService] 유저 프로필 업데이트 시작 - userId: {}", userId);
        UserInfo userInfo = userMapper.selectUserInfo(userId, userId);
        userInfo.setIsFriend(FriendshipStatus.ME);

        if (profileImage != null) {
            String profileImageFileName = profileImage.getOriginalFilename();
            String profileImageKey = "profile/" + userId + "profileImage/" + UUID.randomUUID() + "_" + profileImageFileName;

            try {
                PutObjectRequest profileRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(profileImageKey)
                        .contentType(profileImage.getContentType())
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(profileRequest, RequestBody.fromInputStream(profileImage.getInputStream(), profileImage.getSize()));
                String profileImageUrl = "https://" + bucketName + ".s3.amazonaws.com/" + profileImageKey;
                userInfo.setProfileImageUrl(profileImageUrl);
            } catch (Exception e) {
                log.error("[FileService] 프로파일이미지 업로드 실패", e);
                throw new RuntimeException("프로파일이미지 업로드 실패");
            }
        } else {
            if(request.getIsDefaultProfile())
                userInfo.setProfileImageUrl(null);
        }

        if (backgroundImage != null) {
            String backgroundImageFileName = backgroundImage.getOriginalFilename();
            String backgroundImageKey = "profile/" + userId + "backgroundImage/" + UUID.randomUUID() + "_" + backgroundImageFileName;

            try {
                PutObjectRequest profileRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(backgroundImageKey)
                        .contentType(backgroundImage.getContentType())
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(profileRequest, RequestBody.fromInputStream(backgroundImage.getInputStream(), backgroundImage.getSize()));
                String backgroundImageUrl = "https://" + bucketName + ".s3.amazonaws.com/" + backgroundImageKey;
                userInfo.setProfileImageUrl(backgroundImageUrl);
            } catch (Exception e) {
                log.error("[FileService] 프로파일이미지 업로드 실패", e);
                throw new RuntimeException("프로파일이미지 업로드 실패");
            }
        } else {
            if(request.getIsDefaultBackground())
                userInfo.setBackgroundImageUrl(null);
        }

        userInfo.setNickname(request.getNickname());
        userInfo.setStatusMessage(request.getStatusMessage());

        userMapper.updateProfile(userInfo, userId);
        return userInfo;
    }
}
