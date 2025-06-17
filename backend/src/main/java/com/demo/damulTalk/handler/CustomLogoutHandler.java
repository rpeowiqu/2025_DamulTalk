package com.demo.damulTalk.handler;

import com.demo.damulTalk.auth.service.JwtService;
import com.demo.damulTalk.util.CookieUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomLogoutHandler implements LogoutHandler {

    private static final String ACCESS_TOKEN = "access_token";
    private static final String REFRESH_TOKEN = "refresh_token";

    private final JwtService jwtService;
    private final CookieUtil cookieUtil;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        log.info("[CustomLogoutHandler] 로그아웃 시작");

        try {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if(REFRESH_TOKEN.equals(cookie.getName())) {
                        String refreshToken = cookie.getValue();
                        String username = jwtService.extractUsername(refreshToken);

                        jwtService.invalidateRefreshToken(username);
                        log.info("[CustomLogoutHandler] Redis에서 리프레시토큰 삭제 완료");
                        break;
                    }
                }
            } else {
                log.warn("[CustomLogoutHandler] 쿠키를 찾을 수 없습니다.");
            }

            cookieUtil.deleteCookie(response, REFRESH_TOKEN);
            SecurityContextHolder.clearContext();

            response.setStatus(HttpServletResponse.SC_OK);
            log.info("[CustomLogoutHandler] 로그아웃 처리 완료");
        } catch(Exception e) {
            log.error("[CustomLogoutHandler] 로그아웃 처리 중 오류 발생: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

}
