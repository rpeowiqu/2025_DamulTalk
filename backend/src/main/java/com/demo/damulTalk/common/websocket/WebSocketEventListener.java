package com.demo.damulTalk.common.websocket;

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

import java.security.Principal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;
    private final FriendMapper friendMapper;
    private final RedisTemplate<String, String> redisTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = accessor.getUser();

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

            for(Integer friendId : friendIds){
                String friendRedisKey = "user:online:" + friendId;
                if(Boolean.parseBoolean(redisTemplate.opsForValue().get(friendRedisKey))){
                    messagingTemplate.convertAndSend("/sub/friends/" + friendId, connectionDto);
                }
            }
        }
    }

}
