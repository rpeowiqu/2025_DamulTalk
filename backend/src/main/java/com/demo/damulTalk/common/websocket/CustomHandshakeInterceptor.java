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

        URI uri = request.getURI();
        String query = uri.getQuery();

        if (query != null && query.contains("token=")) {
            String token = Arrays.stream(query.split("&"))
                    .filter(param -> param.startsWith("token="))
                    .map(param -> param.substring("token=".length()))
                    .findFirst()
                    .orElse(null);

            if (token != null) {
                try {
                    String username = jwtService.getUsernameFromToken(token);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    if (jwtService.isValid(token, userDetails)) {
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                        attributes.put("user", authToken);  // 이걸 WebSocket 세션에 저장
                    }
                } catch (Exception e) {
                    log.error("[JwtHandshakeInterceptor] WebSocket 인증 실패: {}", e.getMessage());
                    response.setStatusCode(HttpStatus.UNAUTHORIZED);
                    return false;
                }
            }
        }

        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        log.info("[JwtHandshakeInterceptor] afterHandshake 실행 완료");
    }

}