package com.demo.damulTalk.auth.controller;

import com.demo.damulTalk.auth.dto.*;
import com.demo.damulTalk.auth.service.AuthService;
import com.demo.damulTalk.auth.service.EmailService;
import com.demo.damulTalk.user.dto.SignupRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        log.info("[AuthController] signup 메서드 시작");
        authService.signup(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest, HttpServletResponse response) {
        log.info("[AuthController] 로그인 요청 - username: {}", loginRequest.getUsername());

        LoginResponseDto responseDto = authService.login(loginRequest, response);
        return ResponseEntity.ok().body(responseDto);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        log.info("[AuthController] 로그아웃 요청");
        authService.logout(request, response);
        return ResponseEntity.ok("로그아웃 성공");
    }

    @PostMapping("/duplicates/usernames")
    public ResponseEntity<?> checkDuplicatesUsername(@RequestBody ValidValue value) {
        log.info("[AuthController] 이메일 중복확인 시작");
        authService.checkDuplicatesUsername(value);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/duplicates/nicknames")
    public ResponseEntity<?> checkDuplicatesNickname(@RequestBody ValidValue value) {
        log.info("[AuthController] 닉네임 중복확인 시작");
        authService.checkDuplicatesNickname(value);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/password/reset-request")
    public ResponseEntity<?> resetPassword(@RequestBody EmailDto emailDto, HttpServletResponse response) {
        log.info("[AuthController] 비밀번호 변경 요청 시작");

        emailService.sendPasswordResetCode(response, emailDto.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/email-validation")
    public ResponseEntity<?> validateEmail(@RequestBody EmailCodeDto code, HttpServletRequest request) {
        log.info("[AuthController] 이메일 인증코드 검증 시작");

        emailService.verificationResetCode(request, code.getCode());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordDto passwordDto, HttpServletRequest request) {
        log.info("[AuthController] 비밀번호 변경 시작");

        authService.changePassword(request, passwordDto.getPassword());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/test-login")
    public ResponseEntity<Void> testLogin(@RequestParam String username, HttpServletResponse response) {
        authService.issueTestTokens(username, response);
        return ResponseEntity.ok().build();
    }

    @GetMapping("info")
    public ResponseEntity<?> getUserInfo() {
        log.info("[AuthController] 로그인 한 유저 정보 조회 시작");

        LoginResponseDto response = authService.getUserInfo();
        return ResponseEntity.ok().body(response);
    }

}
