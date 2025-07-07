package com.demo.damulTalk.common.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomChannelInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            UsernamePasswordAuthenticationToken authentication =
                    (UsernamePasswordAuthenticationToken) accessor.getSessionAttributes().get("user");

            if (authentication != null) {
                accessor.setUser(authentication);
                log.info("[CustomChannelInterceptor] 세션에서 사용자 정보 설정 완료 - 사용자: {}", authentication.getName());
            } else {
                log.warn("[CustomChannelInterceptor] 세션에서 사용자 정보 없음 - 인증 실패로 간주");
            }
        }

        return message;
    }

}
