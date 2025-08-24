package com.demo.damulTalk.friend.service;

import com.demo.damulTalk.common.CommonWrapperDto;
import com.demo.damulTalk.common.NotificationType;
import com.demo.damulTalk.exception.BusinessException;
import com.demo.damulTalk.exception.ErrorCode;
import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.friend.dto.FriendIdDto;
import com.demo.damulTalk.friend.mapper.FriendMapper;
import com.demo.damulTalk.user.dto.UserStatusDto;
import com.demo.damulTalk.user.mapper.UserMapper;
import com.demo.damulTalk.util.UserUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FriendServiceImpl implements FriendService {

    private final UserMapper userMapper;
    private final FriendMapper friendMapper;
    private final UserUtil userUtil;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public List<UserStatusDto> getFriendList(Integer userId) {
        log.info("[UserService] 친구목록 조회 시작");

        List<UserStatusDto> list = friendMapper.selectFriends(userId);

        list.forEach(u -> {
            String redisKey = "user:online:" + u.getUserId();
            boolean online = redisTemplate.hasKey(redisKey);
            u.setOnline(online);
        });

        return list;
    }

    @Override
    public void sendFollowRequest(Integer targetId) {
        log.info("[FriendService] 팔로우 요청 시작 - 타겟 id: {}", targetId);

        int userId = userUtil.getCurrentUserId();

        int cnt = friendMapper.selectFriendRelationShipCount(userId, targetId);
        if(cnt > 0) {
            throw new BusinessException(
                    ErrorCode.EXISTING_FRIEND,
                    "이미 존재하는 친구관계입니다."
            );
        }
        
        int follow = userMapper.insertFollowRequest(userId, targetId);
        if(follow < 1)
            throw new BusinessException(
                    ErrorCode.INVALID_USER,
                    "해당 유저는 존재하지 않습니다."
            );

        FriendDto response = userMapper.selectFollowInfoById(userId);

        String redisKey = "user:online:" + targetId;
        boolean isOnline = redisTemplate.hasKey(redisKey);

        try {
            if (isOnline) {
                redisTemplate.convertAndSend("notifications", objectMapper.writeValueAsString(CommonWrapperDto.<FriendDto>builder()
                        .userId(targetId)
                        .type(NotificationType.FRIEND_REQUEST)
                        .data(response)
                        .build()));
            } else {
                log.info("[FriendService] 타겟 유저 오프라인");
            }
        } catch (Exception e) {
            log.error("[FriendService] 친구요청 전송 실패", e);
            throw new RuntimeException("친구요청 전송 실패");
        }
    }

    @Override
    public void deleteFriend(Integer friendId) {
        log.info("[FriendService] 친구 삭제 시작 - friendId: {}", friendId);

        int userId = userUtil.getCurrentUserId();
        String status = friendMapper.selectFriendStatus(userId, friendId);

        int delete = friendMapper.deleteFriendById(userId, friendId);
        if(delete < 1) {
            throw new BusinessException(
                    ErrorCode.INVALID_USER,
                    "해당 친구는 존재하지 않습니다."
            );
        }

        try {
            CommonWrapperDto<FriendIdDto> dto = CommonWrapperDto.<FriendIdDto>builder()
                    .userId(friendId)
                    .type(status.equals("PENDING") ? NotificationType.FRIEND_REQUEST_CANCEL : NotificationType.FRIEND_DELETE)
                    .data(FriendIdDto.builder()
                            .userId(userId)
                            .build())
                    .build();
            redisTemplate.convertAndSend("notifications", objectMapper.writeValueAsString(dto));
        } catch (Exception e) {
            log.error("[FriendService] 친구삭제 전송 실패", e);
            throw new RuntimeException("친구삭제 전송 실패");
        }
    }

    @Override
    public List<FriendDto> getFriendRequests() {
        log.info("[FriendService] 친구 요청 목록 조회 시작");

        int userId = userUtil.getCurrentUserId();

        List<FriendDto> requests = friendMapper.selectFriendRequestsById(userId);
        return requests;
    }

    @Override
    public UserStatusDto addFriend(Integer targetId) {
        log.info("[FriendService] 친구 추가 시작 - targetId: {}", targetId);

        int userId = userUtil.getCurrentUserId();

        int insert = friendMapper.updateFriend(targetId, userId);
        if(insert < 1) {
            throw new BusinessException(
                    ErrorCode.INVALID_REQUEST,
                    "해당 요청이 존재하지 않습니다."
            );
        }

        UserStatusDto me = friendMapper.selectFriendInfoById(userId);
        UserStatusDto friend = friendMapper.selectFriendInfoById(targetId);
        String redisKey = "user:online:" + userId;
        boolean online = redisTemplate.hasKey(redisKey);
        me.setOnline(online);
        redisKey = "user:online:" + targetId;
        online = redisTemplate.hasKey(redisKey);
        friend.setOnline(online);
        try {
            redisTemplate.convertAndSend("notifications", objectMapper.writeValueAsString(CommonWrapperDto.<UserStatusDto>builder()
                    .userId(targetId)
                    .type(NotificationType.FRIEND_ACCEPT)
                    .data(me)
                    .build()));
        } catch (Exception e) {
            log.error("[FriendService] 친구수락 전송 실패", e);
            throw new RuntimeException("친구수락 전송 실패");
        }

        return friend;
    }

}
