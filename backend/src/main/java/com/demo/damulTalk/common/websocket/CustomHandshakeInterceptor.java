package com.demo.damulTalk.common.websocket;

import com.demo.damulTalk.auth.service.JwtService;
import com.demo.damulTalk.user.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Arrays;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {

        String token = UriComponentsBuilder.fromUri(request.getURI())
                .build()
                .getQueryParams()
                .getFirst("token");

        if (token == null || token.isBlank()) {
            log.warn("[Handshake] token 파라미터 없음");
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false; // 게스트 허용 안 하면 false, 허용하려면 true 로 바꾸세요.
        }

        try {
            String username = jwtService.getUsernameFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtService.isValid(token, userDetails)) {
                var auth = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                attributes.put("user", auth); // ChannelInterceptor에서 꺼냄
                log.info("[Handshake] 인증 성공 - {}", username);
                return true; // ✅ 성공 시 통과
            } else {
                log.warn("[Handshake] 토큰 유효성 실패");
            }
        } catch (Exception e) {
            log.error("[Handshake] 예외: {}", e.getMessage(), e);
        }

        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return false; // ✅ 실패 시에만 거절
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        log.info("[JwtHandshakeInterceptor] afterHandshake 실행 완료");
    }

}