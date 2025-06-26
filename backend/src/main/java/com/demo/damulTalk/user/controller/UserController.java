package com.demo.damulTalk.user.controller;

import com.demo.damulTalk.user.dto.UserStatusDto;
import com.demo.damulTalk.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> getFriends(
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "20") int size
    ) {
        List<UserStatusDto> response = userService.getFriendList();
        if(response.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(response);
    }

}
