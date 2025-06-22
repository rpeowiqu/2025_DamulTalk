package com.demo.damulTalk.auth.service;

import com.demo.damulTalk.auth.dto.LoginRequestDto;
import com.demo.damulTalk.auth.dto.ValidValue;
import com.demo.damulTalk.exception.BusinessException;
import com.demo.damulTalk.exception.ErrorCode;
import com.demo.damulTalk.user.domain.User;
import com.demo.damulTalk.user.dto.SignupRequest;
import com.demo.damulTalk.user.mapper.UserMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public void signup(SignupRequest request) {
        log.info("[AuthService] 회원가입 시작 - username: {}", request.getUsername());

        validateSignupForm(request);

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .joinedAt(LocalDateTime.now())
                .build();


        userMapper.insertUser(user);
    }

    public void login(LoginRequestDto loginRequest, HttpServletResponse response) {
        log.info("[AuthService] 로그인 시작 - username: {}", loginRequest.getUsername());

        User user = userMapper.findByUsername(loginRequest.getUsername());
        if(user == null) {
            log.info("[AuthService] 존재하지 않는 유저입니다.");
            throw new BusinessException(
                    ErrorCode.INVALID_USER,
                    "존재하지 않는 유저입니다."
            );
        }

        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            log.info("[AuthService] 비밀번호가 틀립니다.");
            throw new BusinessException(
                    ErrorCode.INCORRECT_PASSWORD,
                    "비밀번호가 틀립니다."
            );
        }

        jwtService.invalidateRefreshToken(user.getUsername());

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) (jwtService.getRefreshTokenExpire() / 1000));

        response.addCookie(cookie);
        response.setHeader("Authorization", "Bearer " + accessToken);
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = extractAccessToken(request);

        String username = jwtService.extractUsername(accessToken);
        log.info("[AuthService] 로그아웃 - username: {}", username);

        jwtService.invalidateRefreshToken(username);

        // 쿠키 삭제
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    public void checkDuplicatesUsername(ValidValue value) {
        log.info("[AuthService] username 중복확인 시작");

        User user = userMapper.findByUsername(value.getValue());
        if (user != null) {
            throw new BusinessException(
                    ErrorCode.EXISTING_USER,
                    "이미 존재하는 유저입니다."
            );
        }
    }

    public void checkDuplicatesNickname(ValidValue value) {
        log.info("[AuthService] nickname 중복확인 시작");

        User user = userMapper.findByNickname(value.getValue());
        if (user != null) {
            throw new BusinessException(
                    ErrorCode.EXISTING_USER,
                    "이미 존재하는 유저입니다."
            );
        }
    }

    private String extractAccessToken(HttpServletRequest request) {
        String accessToken = request.getHeader("Authorization");
        if (accessToken != null && accessToken.startsWith("Bearer ")) {
            return accessToken.substring(7);
        }
        throw new BusinessException(ErrorCode.INVALID_TOKEN, "AccessToken이 없습니다.");
    }

    private void validateSignupForm(SignupRequest request) {
        log.info("[AuthService] 회원가입 요청 validation 시작");

        User existingUserByUsername = userMapper.findByUsername(request.getUsername());
        if (existingUserByUsername != null) {
            log.info("[UserService] 이미 존재하는 username - {}", request.getUsername());
            throw new BusinessException(
                    ErrorCode.EXISTING_USER,
                    "이미 사용 중인 username입니다."
            );
        }

        if (request.getNickname().length() > 12) {
            log.info("[AuthService] 닉네임 길이 초과 - {}", request.getNickname());
            throw new BusinessException(
                    ErrorCode.OUTLENGTH_NICKNAME,
                    "닉네임은 12자 이하로 입력해주세요."
            );
        }

        User existingUserByNickname = userMapper.findByNickname(request.getNickname());
        if (existingUserByNickname != null) {
            log.info("[AuthService] 이미 존재하는 닉네임 - {}", request.getNickname());
            throw new BusinessException(
                    ErrorCode.EXISTING_NICKNAME,
                    "이미 사용 중인 닉네임입니다."
            );
        }

        log.info("[AuthService] 회원가입 validation 성공");
    }

}