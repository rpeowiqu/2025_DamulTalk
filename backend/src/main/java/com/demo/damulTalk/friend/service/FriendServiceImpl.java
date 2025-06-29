package com.demo.damulTalk.friend.service;

import com.demo.damulTalk.common.scroll.CursorPageMetaDto;
import com.demo.damulTalk.common.scroll.ScrollResponse;
import com.demo.damulTalk.exception.BusinessException;
import com.demo.damulTalk.exception.ErrorCode;
import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.friend.mapper.FriendMapper;
import com.demo.damulTalk.user.mapper.UserMapper;
import com.demo.damulTalk.util.UserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FriendServiceImpl implements FriendService {

    private final UserMapper userMapper;
    private final FriendMapper friendMapper;
    private final UserUtil userUtil;
    private final SimpMessagingTemplate messagingTemplate;
    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public void sendFollowRequest(Integer targetId) {
        log.info("[FriendService] 팔로우 요청 시작 - 타겟 id: {}", targetId);

        int userId = userUtil.getCurrentUserId();

        int follow = userMapper.insertFollowRequest(userId, targetId);
        if(follow < 1)
            throw new BusinessException(
                    ErrorCode.INVALID_USER,
                    "해당 유저는 존재하지 않습니다."
            );

        FriendDto response = userMapper.selectFollowInfoById(userId);

        String redisKey = "user:online:" + targetId;
        boolean isOnline = redisTemplate.hasKey(redisKey);

        if(isOnline) {
            String destination = "/sub/follow" + targetId;
            messagingTemplate.convertAndSend(destination, response);
            log.info("[FriendService] 실시간 알림 전송: {}", destination);
        } else {
            log.info("[FriendService] 타겟 유저 오프라인");
        }
    }

    @Override
    public ScrollResponse<List<FriendDto>, String> getSearchResult(String nickname, String cursor, int size) {
        log.info("[FriendService] 친구 검색 시작 - nickname: {}, cursor: {}, size: {}", nickname, cursor, size);

        int userId = userUtil.getCurrentUserId();
        List<FriendDto> results = friendMapper.selectFriendsByNickname(userId, nickname, cursor, size);

        boolean hasNext = results.size() > size;
        String nextCursor = null;

        if (hasNext) {
            FriendDto lastItem = results.remove(size); // size + 1 번째 항목 제거 후 커서 지정
            nextCursor = lastItem.getNickname();       // 다음 요청 시 커서로 사용
        }

        CursorPageMetaDto<String> meta = CursorPageMetaDto.<String>builder()
                .nextCursor(nextCursor)
                .hasNextCursor(hasNext)
                .build();

        return ScrollResponse.<List<FriendDto>, String>builder()
                .data(results)
                .meta(meta)
                .build();
    }

    @Override
    public void deleteFriend(Integer friendId) {
        log.info("[FriendService] 친구 삭제 시작 - friendId: {}", friendId);

        int userId = userUtil.getCurrentUserId();

        int delete = friendMapper.deleteFriendById(userId, friendId);
        if(delete < 1) {
            throw new BusinessException(
                    ErrorCode.INVALID_USER,
                    "해당 친구는 존재하지 않습니다."
            );
        }
    }

    @Override
    public void deleteFriendRequest(Integer friendId) {
        log.info("[FriendService] 친구 요청 거절 시작 - friendId: {}", friendId);

        int userId = userUtil.getCurrentUserId();

        int delete = friendMapper.deleteFriendRequestById(userId, friendId);
        if(delete < 1) {
            throw new BusinessException(
                    ErrorCode.INVALID_USER,
                    "해당 요청은 존재하지 않습니다."
            );
        }
    }

}
