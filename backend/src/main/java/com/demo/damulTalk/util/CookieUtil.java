package com.demo.damulTalk.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class CookieUtil {

    @Value("${cookie.secure-flag:false}")
    private boolean secureCookie;

    public void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
        log.info("[CookieUtil] 쿠키 생성 시작 - 이름: {}, 만료시간: {}", name, maxAge);

        ResponseCookie cookie = ResponseCookie.from(name, value)
                .path("/")
                .sameSite("Lax")
                .httpOnly(true)
                .secure(secureCookie)
                .maxAge(maxAge)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        log.info("[CookieUtil] 쿠키 생성 완료");
    }

    public void deleteCookie(HttpServletResponse response, String name) {
        log.info("[CookieUtil] 쿠키 삭제 시작 - 이름: {}", name);

        ResponseCookie cookie = ResponseCookie.from(name, "")
                .path("/")
                .sameSite("Lax")
                .httpOnly(true)
                .secure(secureCookie)
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        log.info("[CookieUtil] 쿠키 삭제 완료 - 이름: {}", name);
    }

    public Cookie getCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();

        if(cookies != null && cookies.length > 0) {
            for (Cookie cookie : cookies) {
                if(cookie.getName().equals(name)) {
                    return cookie;
                }
            }
        }

        return null;
    }

}
