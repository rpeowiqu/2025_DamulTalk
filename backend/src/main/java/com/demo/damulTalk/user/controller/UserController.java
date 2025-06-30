package com.demo.damulTalk.user.controller;

import com.demo.damulTalk.user.dto.UserInfo;
import com.demo.damulTalk.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping("/profiles/{userId}")
    public ResponseEntity<?> getUserInfo(@PathVariable Integer userId) {
        log.info("[UserController] 유저 정보 조회 시작 - userId: {}", userId);

        UserInfo info = userService.getUserInfo(userId);
        return ResponseEntity.ok(info);
    }

}
