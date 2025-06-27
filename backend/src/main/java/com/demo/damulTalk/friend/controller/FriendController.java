package com.demo.damulTalk.friend.controller;

import com.demo.damulTalk.common.CommonIdDto;
import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.friend.service.FriendService;
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

    @PostMapping("/requests")
    public ResponseEntity<?> sendFollowRequest(@RequestBody CommonIdDto common) {
        log.info("[FriendController] 팔로우 요청 시작");

        friendService.sendFollowRequest(common.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchFriends(
            @RequestParam String nickname,
            @RequestParam int cursor,
            @RequestParam int size
    ) {
        log.info("[FriendController] 친구 검색 시작 - nickname: {}", nickname);

        List<FriendDto> friends = friendService.getSearchResult(nickname, cursor, size);
        if(friends.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(friends);
    }

}
