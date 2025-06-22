package com.demo.damulTalk.config;

import com.demo.damulTalk.filter.JwtVerificationFilter;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final JwtVerificationFilter jwtVerificationFilter;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        log.info("[SecurityConfig] 보안 필터 체인 구성 시작");

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(
                            "/ws/**",
                            "/api/v1/auth/**"
                            ).permitAll()
                            .anyRequest().authenticated();
                    log.info("보안 필터 구성 완료");
                })
                .addFilterBefore(jwtVerificationFilter, UsernamePasswordAuthenticationFilter.class)
                .sessionManagement(session -> {
                    log.info("[SecurityConfig] 세션 관리 정책 설정: STATELESS");
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                })
                .exceptionHandling(e -> {
                    log.info("[SecurityConfig] 보안 처리 예외 구성");
                    e.accessDeniedHandler((request, response, accessDeniedException) -> {
                        log.warn("[SecurityConfig] 접근 거부 처리: {}",  accessDeniedException.getMessage());
                        response.setStatus(403);
                    })
                            .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));
                })
                .cors(corsCustomizer -> {
                    log.info("[SecurityConfig] CORS 설정 구성");
                    corsCustomizer.configurationSource(new CorsConfigurationSource() {
                        @Override
                        public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                            log.info("[SecurityConfig] CORS 설정 생성 - 요청 URI: {}", request.getRequestURI());

                            CorsConfiguration configuration = new CorsConfiguration();
                            configuration.setAllowedOriginPatterns(List.of(frontendUrl));
                            configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH"));
                            configuration.setAllowCredentials(true);
                            configuration.addAllowedHeader("*");
                            configuration.setExposedHeaders(Arrays.asList(
                                    "Authorization",
                                    "Set-Cookie",
                                    "Access-Control-Allow-Credentials",
                                    "Access-Control-Allow-Origin"
                            ));
                            configuration.setAllowedHeaders(Arrays.asList(
                                    "Authorization",
                                    "Content-Type",
                                    "Cookie",
                                    "Access-Control-Allow-Credentials",
                                    "Access-Control-Allow-Origin",
                                    "X-Requested-With",  // WebSocket 관련 헤더 추가
                                    "x-socket-transport"
                            ));
                            configuration.setMaxAge(3600L);

                            log.debug("CORS 허용 출처: {}", frontendUrl);
                            log.debug("CORS 허용 메서드: {}", configuration.getAllowedMethods());
                            log.debug("CORS 노출 헤더: {}", configuration.getExposedHeaders());

                            return configuration;
                        }
                    });

                    log.info("[SecurityConfig] CORS 설정 완료");
                });
        log.info("[SecurityConfig] 보안 필터 구성 완료");
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
