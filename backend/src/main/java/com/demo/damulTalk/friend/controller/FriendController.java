package com.demo.damulTalk.friend.controller;

import com.demo.damulTalk.common.CommonIdDto;
import com.demo.damulTalk.friend.service.FriendService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
@Slf4j
public class FriendController {

    private final FriendService friendService;

    @PostMapping("/requests")
    public ResponseEntity<?> sendFollowRequest(@RequestBody CommonIdDto common) {
        log.info("[FriendController] 팔로우 요청 시작");

        friendService.sendFollowRequest(common.getUserId());
        return ResponseEntity.ok().build();
    }

}
