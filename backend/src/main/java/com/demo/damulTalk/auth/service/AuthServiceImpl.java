package com.demo.damulTalk.auth.service;

import com.demo.damulTalk.auth.dto.LoginRequestDto;
import com.demo.damulTalk.auth.dto.LoginResponseDto;
import com.demo.damulTalk.auth.dto.ValidValue;
import com.demo.damulTalk.common.CommonWrapperDto;
import com.demo.damulTalk.common.NotificationType;
import com.demo.damulTalk.exception.BusinessException;
import com.demo.damulTalk.exception.ErrorCode;
import com.demo.damulTalk.friend.mapper.FriendMapper;
import com.demo.damulTalk.user.domain.CustomUserDetails;
import com.demo.damulTalk.user.domain.User;
import com.demo.damulTalk.user.dto.ConnectionDto;
import com.demo.damulTalk.user.dto.SignupRequest;
import com.demo.damulTalk.user.mapper.UserMapper;
import com.demo.damulTalk.user.service.CustomUserDetailsService;
import com.demo.damulTalk.util.CookieUtil;
import com.demo.damulTalk.util.UserUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final FriendMapper friendMapper;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final CookieUtil cookieUtil;
    private final CustomUserDetailsService userDetailsService;

    private final RedisTemplate<String, String> redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserUtil userUtil;
    private final ObjectMapper objectMapper;

    @Override
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

    @Override
    public LoginResponseDto login(LoginRequestDto loginRequest, HttpServletResponse response) {
        log.info("[AuthService] 로그인 시작 - username: {}", loginRequest.getUsername());

        User user = userMapper.findByUsername(loginRequest.getUsername());
        log.info("[AuthService] loginPassword: {}", passwordEncoder.encode(loginRequest.getPassword()));
        log.info("[AuthService] savedPassword: {}", user.getPassword());
        if(user == null) {
            log.info("[AuthService] 존재하지 않는 유저입니다.");
            throw new BusinessException(
                    ErrorCode.INVALID_USER,
                    "ID 혹은 패스워드가 일치하지 않습니다."
            );
        }

        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            log.info("[AuthService] 비밀번호가 틀립니다.");
            throw new BusinessException(
                    ErrorCode.INCORRECT_PASSWORD,
                    "ID 혹은 패스워드가 일치하지 않습니다."
            );
        }

        jwtService.invalidateRefreshToken(user.getUsername());

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        cookieUtil.addCookie(response, "refresh_token", refreshToken, (int) (jwtService.getRefreshTokenExpire() / 1000));
        response.setHeader("Authorization", accessToken);
        return new LoginResponseDto(user.getUserId(), user.getNickname(), user.getProfileImageUrl());
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = extractAccessToken(request);
        String username = jwtService.extractUsername(accessToken);
        int userId = jwtService.getUserIdFromToken(accessToken);
        log.info("[AuthService] 로그아웃 - username: {}", username);

        jwtService.invalidateRefreshToken(username);
        cookieUtil.deleteCookie(response, "refresh_token");

        String redisKey = "user:online:" + userId;
        redisTemplate.delete(redisKey);

        List<Integer> friendIds = friendMapper.selectFriendIds(userId);

        ConnectionDto connectionDto = ConnectionDto.builder()
                .userId(userId)
                .online(false)
                .build();

        friendIds.stream()
                .filter(friendId -> redisTemplate.hasKey("user:online:" + friendId))
                .forEach(friendId -> {
                    try {
                        redisTemplate.convertAndSend("notifications", objectMapper.writeValueAsString(CommonWrapperDto.<ConnectionDto>builder()
                                .userId(friendId)
                                .type(NotificationType.ONLINE_STATUS)
                                .data(connectionDto)
                                .build()));
                    } catch (JsonProcessingException e) {
                        log.error("[WebSocketEventListener] 직렬화 실패");
                    }
                });
    }

    @Override
    public boolean checkDuplicatesUsername(ValidValue value) {
        log.info("[AuthService] username 중복확인 시작");

        User user = userMapper.findByUsername(value.getValue());
        return user != null;
    }

    @Override
    public boolean checkDuplicatesNickname(ValidValue value) {
        log.info("[AuthService] nickname 중복확인 시작");

        User user = userMapper.findByNickname(value.getValue());
        return user != null;
    }

    @Override
    public void changePassword(HttpServletRequest request, String password) {
        log.info("[AuthService] 비밀번호 변경 시작");

        String token = cookieUtil.getCookie(request, "temporary_token").getValue();
        String email = jwtService.extractUsername(token);
        userMapper.updatePassword(email, passwordEncoder.encode(password));
    }

    @Override
    public LoginResponseDto getUserInfo() {
        log.info("[AuthService] 로그인 한 유저 정보 조회 시작");
        int userId = userUtil.getCurrentUserId();

        LoginResponseDto response = userMapper.selectMyInfo(userId);
        return response;
    }

    @Override
    public void refreshTokenRotate(HttpServletRequest request, HttpServletResponse response) {
        log.info("[AuthService] RTR 시작");

        Cookie refreshTokenCookie = cookieUtil.getCookie(request, "refresh_token");
        if(refreshTokenCookie != null) {
            String refreshToken = refreshTokenCookie.getValue();
            CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(
                    jwtService.extractUsername(refreshToken));

            jwtService.isValidRefreshToken(refreshToken, userDetails.getUser());

            Map<String, String> tokens = jwtService.rotateTokens(refreshToken, userDetails.getUser());
            if (tokens != null) {
                cookieUtil.addCookie(response, "refresh_token", tokens.get("refresh_token"), (int) (jwtService.getRefreshTokenExpire() / 1000));
                response.setHeader("Authorization", tokens.get("access_token"));
                processAccessToken(tokens.get("access_token"), response);
                return;
            }
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
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

    @Override
    public void issueTestTokens(String username, HttpServletResponse response) {
        User user = userMapper.findByUsername(username);
        if (user == null)
            throw new BusinessException(ErrorCode.INVALID_USER, "테스트 유저가 존재하지 않습니다.");

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        response.setHeader("Authorization", "Bearer " + accessToken);
        cookieUtil.addCookie(response, "refresh_token", refreshToken, (int)(jwtService.getRefreshTokenExpire() / 1000));
    }

}