package com.demo.damulTalk.handler;

import com.demo.damulTalk.auth.service.JwtService;
import com.demo.damulTalk.member.domain.Member;
import com.demo.damulTalk.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final CookieUtil cookieUtil;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        log.info("[LoginSuccessHandler] 로그인 성공 핸들러 실행");
        Member member = (Member) authentication.getPrincipal();

        String accessToken = jwtService.generateAccessToken(member);
        String refreshToken = jwtService.generateRefreshToken(member);
        log.info("[LoginSuccessHandler] 토큰 생성 완료");

        response.setHeader("Authorization", "Bearer " + accessToken);
        cookieUtil.addCookie(response, "refresh_token", refreshToken, (int) (jwtService.getRefreshTokenExpire() / 1000));
        log.info("[LoginSuccessHandler] 토큰 설정 완료");

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
    }

}
