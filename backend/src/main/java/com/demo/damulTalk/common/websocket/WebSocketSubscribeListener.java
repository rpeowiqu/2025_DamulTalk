package com.demo.damulTalk.common.websocket;

import com.demo.damulTalk.user.domain.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import java.security.Principal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketSubscribeListener {

    private final RedisTemplate<String, String> redisTemplate;

    private final Pattern chatRoomPattern = Pattern.compile("^/sub/chats/(\\d+)$");

    @EventListener
    public void handleSessionSubscribeEvent(SessionSubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

        String destination = accessor.getDestination();
        String subscriptionId = accessor.getSubscriptionId();

        if (destination == null || subscriptionId == null) {
            log.warn("[SubscribeListener] destination 또는 subscriptionId가 없습니다.");
            return;
        }

        if (!chatRoomPattern.matcher(destination).matches()) {
            return;
        }

        Principal principal = accessor.getUser();

        if (principal == null || !(principal instanceof CustomUserDetails details)) {
            log.warn("[SubscribeListener] 사용자 인증 정보가 없습니다.");
            return;
        }

        Matcher matcher = chatRoomPattern.matcher(destination);
        if (matcher.matches()) {
            String roomId = matcher.group(1);
            int userId = details.getUserId();

            String roomKey = "chat:room:" + roomId + ":user:" + userId;
            redisTemplate.opsForValue().set(roomKey, "true");

            String subscriptionMapKey = "subscription:" + userId + ":" + subscriptionId;
            redisTemplate.opsForValue().set(subscriptionMapKey, destination);

            log.info("[SubscribeListener] 채팅방 입장 저장 - roomId: {}, userId: {}, subscriptionId: {}", roomId, userId, subscriptionId);
        }
    }

    @EventListener
    public void handleSessionUnsubscribeEvent(SessionUnsubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal principal = accessor.getUser();

        if (principal == null || !(principal instanceof CustomUserDetails details)) {
            log.warn("[UnsubscribeListener] 사용자 인증 정보가 없습니다.");
            return;
        }

        int userId = details.getUserId();
        String subscriptionId = accessor.getSubscriptionId();

        if (subscriptionId == null) {
            log.warn("[UnsubscribeListener] subscriptionId가 없습니다.");
            return;
        }

        String subscriptionMapKey = "subscription:" + userId + ":" + subscriptionId;
        String destination = redisTemplate.opsForValue().get(subscriptionMapKey);

        if (destination != null) {
            Matcher matcher = chatRoomPattern.matcher(destination);
            if (matcher.matches()) {
                String roomId = matcher.group(1);
                String roomKey = "chat:room:" + roomId + ":user:" + userId;
                redisTemplate.delete(roomKey);
                log.info("[UnsubscribeListener] 채팅방 퇴장 처리 - roomId: {}, userId: {}", roomId, userId);
            }
            redisTemplate.delete(subscriptionMapKey);
        }
    }

}
