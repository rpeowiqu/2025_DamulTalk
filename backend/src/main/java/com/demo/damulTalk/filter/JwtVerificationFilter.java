package com.demo.damulTalk.filter;

import com.demo.damulTalk.auth.service.JwtService;
import com.demo.damulTalk.user.domain.CustomUserDetails;
import com.demo.damulTalk.user.domain.User;
import com.demo.damulTalk.user.service.CustomUserDetailsService;
import com.demo.damulTalk.util.CookieUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtVerificationFilter extends OncePerRequestFilter {

    private static final String ACCESS_TOKEN = "access_token";
    private static final String REFRESH_TOKEN = "refresh_token";

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final CookieUtil cookieUtil;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    private final List<String> excludedUrls = Arrays.asList(
//            "/api/v1/**",
            "/api/v1/auth/signup",
            "/api/v1/auth/login",
            "/api/v1/auth/refresh",
            "/api/v1/duplicates/usernames",
            "/api/v1/duplicates/nicknames",
            "/api/v1/auth/test-login"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("[JwtVerificationFilter] filter chain 시작");

        String authorizationHeader = request.getHeader("Authorization");
        String accessToken = null;
        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            accessToken = authorizationHeader.substring(7);
        }

        if (accessToken != null) {
            try {
                processAccessToken(accessToken, response);
                filterChain.doFilter(request, response);
                return;
            } catch(ExpiredJwtException e) {
                log.info("[JwtVerificationFilter] Access Token 만료, Refresh Token으로 갱신 시도");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        log.info("[JwtVerificationFilter] JWT 검증 완료");
        filterChain.doFilter(request, response);
    }

    private void processAccessToken(String accessToken, HttpServletResponse response) {
        String username = jwtService.getUsernameFromToken(accessToken);
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtService.isValid(accessToken, userDetails)) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
    }

    private void handleExpiredToken(HttpServletResponse response, String refreshToken) {
        if(refreshToken != null) {
            CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(
                    jwtService.extractUsername(refreshToken));

            Map<String, String> tokens = jwtService.rotateTokens(refreshToken, userDetails.getUser());
            if(tokens != null) {
                cookieUtil.addCookie(response, REFRESH_TOKEN, tokens.get("refresh_token"), (int) (jwtService.getRefreshTokenExpire() / 1000));

                response.setHeader("Authorization",  tokens.get("accessToken"));

                processAccessToken(tokens.get("access_token"), response);
                return;
            }
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        boolean shouldNotFilter = excludedUrls.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, path));
        log.info("[JwtVerificationFilter] JWT 필터 제외 여부 확인 - URI: {}, 제외: {}", path, shouldNotFilter);
        return shouldNotFilter;
    }

}
