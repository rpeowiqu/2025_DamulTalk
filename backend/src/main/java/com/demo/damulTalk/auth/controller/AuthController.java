package com.demo.damulTalk.auth.controller;

import com.demo.damulTalk.user.dto.SignupRequest;
import com.demo.damulTalk.user.service.UserService;
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

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        log.info("[AuthController] signup 메서드 시작");
        userService.signup(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/duplicates/username")
    public ResponseEntity<?> checkDuplicatesUsername(@RequestBody ValidValue value) {
        log.info("[AuthController] 이메일 중복확인 시작");
        userService.checkDuplicatesUsername(value);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/duplicates/nickname")
    public ResponseEntity<?> checkDuplicatesNickname(@RequestBody ValidValue value) {
        log.info("[AuthController] 닉네임 중복확인 시작");
        userService.checkDuplicatesNickname(value);
        return ResponseEntity.ok().build();
    }

}
