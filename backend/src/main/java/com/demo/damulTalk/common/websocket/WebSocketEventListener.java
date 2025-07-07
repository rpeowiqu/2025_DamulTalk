package com.demo.damulTalk.common.websocket;

import com.demo.damulTalk.common.CommonWrapperDto;
import com.demo.damulTalk.common.NotificationType;
import com.demo.damulTalk.friend.mapper.FriendMapper;
import com.demo.damulTalk.user.domain.CustomUserDetails;
import com.demo.damulTalk.user.dto.ConnectionDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final FriendMapper friendMapper;
    private final RedisTemplate<String, String> redisTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = accessor.getUser();

        if (user == null) {
            Object auth = accessor.getSessionAttributes().get("user");
            if (auth instanceof UsernamePasswordAuthenticationToken token) {
                user = token;
            }
        }

        if (user == null) {
            log.error("[WebSocketEventListener] 연결된 사용자 정보가 없습니다.");
            return;
        }

        if(user instanceof UsernamePasswordAuthenticationToken auth) {
            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
            int userId = userDetails.getUserId();
            log.info("[WebSocketEventListener] User connected: {}", userDetails.getUsername());

            String redisKey = "user:online:" + userId;
            redisTemplate.opsForValue().set(redisKey, "online");

            List<Integer> friendIds = friendMapper.selectFriendIds(userId);

            ConnectionDto connectionDto = ConnectionDto.builder()
                    .userId(userId)
                    .online(true)
                    .build();

            friendIds.stream()
                    .filter(friendId -> redisTemplate.hasKey("user:online:" + friendId))
                    .forEach(friendId -> redisTemplate.convertAndSend("notifications", CommonWrapperDto.<ConnectionDto>builder()
                                    .userId(friendId)
                                    .type(NotificationType.ONLINE_STATUS)
                                    .data(connectionDto)));
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = accessor.getUser();

        if (user == null) {
            Object auth = accessor.getSessionAttributes().get("user");
            if (auth instanceof UsernamePasswordAuthenticationToken token) {
                user = token;
            }
        }

        if (user == null) {
            log.warn("[WebSocketEventListener] 연결 종료된 사용자 정보가 없습니다.");
            return;
        }

        if (user instanceof UsernamePasswordAuthenticationToken auth) {
            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
            int userId = userDetails.getUserId();
            log.info("[WebSocketEventListener] User disconnected: {}", userDetails.getUsername());

            String redisKey = "user:online:" + userId;
            redisTemplate.delete(redisKey);

            List<Integer> friendIds = friendMapper.selectFriendIds(userId);
            ConnectionDto connectionDto = ConnectionDto.builder()
                    .userId(userId)
                    .online(false)
                    .build();

            friendIds.stream()
                    .filter(friendId -> redisTemplate.hasKey("user:online:" + friendId))
                    .forEach(friendId -> redisTemplate.convertAndSend("notifications", CommonWrapperDto.<ConnectionDto>builder()
                            .type(NotificationType.ONLINE_STATUS)
                            .data(connectionDto)));
        }
    }

}
