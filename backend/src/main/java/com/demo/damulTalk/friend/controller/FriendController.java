package com.demo.damulTalk.friend.controller;

import com.demo.damulTalk.common.CommonIdDto;
import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.friend.service.FriendService;
import com.demo.damulTalk.user.dto.UserStatusDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
@Slf4j
public class FriendController {

    private final FriendService friendService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getFriends(@PathVariable Integer userId) {
        log.info("[UserController] 친구 목록 불러오기 시작");
        List<UserStatusDto> response = friendService.getFriendList(userId);
        if(response.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/requests")
    public ResponseEntity<?> sendFollowRequest(@RequestBody CommonIdDto common) {
        log.info("[FriendController] 팔로우 요청 시작");

        friendService.sendFollowRequest(common.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{targetId}")
    public ResponseEntity<?> deleteFriend(@PathVariable Integer targetId) {
        log.info("[FriendController] 친구 삭제 시작");

        friendService.deleteFriend(targetId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getFriendRequests() {
        log.info("[FriendController] 친구 요청 목록 조회 시작");

        List<FriendDto> response = friendService.getFriendRequests();
        if(response.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/requests")
    public ResponseEntity<?> acceptFriendRequest(@RequestBody CommonIdDto common) {
        log.info("[FriendController] 친구 요청 수락 시작 - targetId: {}", common.getId());

        UserStatusDto response = friendService.addFriend(common.getId());
        return ResponseEntity.ok(response);
    }

}
