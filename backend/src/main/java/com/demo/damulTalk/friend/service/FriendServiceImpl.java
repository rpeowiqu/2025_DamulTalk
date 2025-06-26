package com.demo.damulTalk.friend.service;

import com.demo.damulTalk.exception.BusinessException;
import com.demo.damulTalk.exception.ErrorCode;
import com.demo.damulTalk.user.mapper.UserMapper;
import com.demo.damulTalk.util.UserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FriendServiceImpl implements FriendService {

    private final UserMapper userMapper;
    private final UserUtil userUtil;
    private final SimpMessagingTemplate messagingTemplate;
    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public void sendFollowRequest(int targetId) {
        log.info("[FriendService] 팔로우 요청 시작 - 타겟 id: {}", targetId);

        int userId = userUtil.getCurrentUserId();

        int follow = userMapper.insertFollowRequest(userId, targetId);
        if(follow < 1)
            throw new BusinessException(
                    ErrorCode.INVALID_USER,
                    "해당 유저는 존재하지 않습니다."
            );

        String profileImageUrl = userMapper.selectProfileImageUrl(userId);

        FollowRequest followRequest = new FollowRequest(userId, profileImageUrl);

        String redisKey = "user:online:" + targetId;
        boolean isOnline = redisTemplate.hasKey(redisKey);

        if(isOnline) {
            String destination = "/sub/follow" + targetId;
            messagingTemplate.convertAndSend(destination, followRequest);
            log.info("[FriendService] 실시간 알림 전송: {}", destination);
        } else {
            log.info("[FriendService] 타겟 유저 오프라인");
        }
    }

}
