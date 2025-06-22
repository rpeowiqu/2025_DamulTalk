package com.demo.damulTalk.auth.controller;

import com.demo.damulTalk.auth.dto.LoginRequestDto;
import com.demo.damulTalk.auth.dto.LoginResponseDto;
import com.demo.damulTalk.auth.dto.ValidValue;
import com.demo.damulTalk.auth.service.AuthService;
import com.demo.damulTalk.user.dto.SignupRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

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
        return ResponseEntity.ok().build();
    }

    @PostMapping("/duplicates/nicknames")
    public ResponseEntity<?> checkDuplicatesNickname(@RequestBody ValidValue value) {
        log.info("[AuthController] 닉네임 중복확인 시작");
        authService.checkDuplicatesNickname(value);
        return ResponseEntity.ok().build();
    }

}
