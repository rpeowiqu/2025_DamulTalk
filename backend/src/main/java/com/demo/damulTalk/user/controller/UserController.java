package com.demo.damulTalk.user.controller;

import com.demo.damulTalk.common.scroll.ScrollResponse;
import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.user.dto.ProfileUpdateRequest;
import com.demo.damulTalk.user.dto.UserInfo;
import com.demo.damulTalk.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    @GetMapping("/search")
    public ResponseEntity<?> searchFriends(
            @RequestParam String nickname,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.info("[FriendController] 친구 검색 시작 - nickname: {}", nickname);

        ScrollResponse<List<FriendDto>, String> friends = userService.getSearchResult(nickname, cursor, size);
        if(friends.getData().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(friends);
    }

    @PutMapping("/profiles/{userId}")
    public ResponseEntity<?> updateUserInfo(
            @PathVariable Integer userId,
            @RequestPart("profileUpdateRequest") ProfileUpdateRequest profileUpdateRequest,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "backgroundImage", required = false) MultipartFile backgroundImage) {
        log.info("[UserController] 유저 프로필 수정 시작 - userId: {}", userId);

        UserInfo info = userService.updateUserInfo(userId, profileUpdateRequest, profileImage, backgroundImage);

        return ResponseEntity.ok(info);
    }

}
