package com.demo.damulTalk.chat.controller;

import com.demo.damulTalk.chat.dto.ChatRoomCreate;
import com.demo.damulTalk.chat.dto.ChatRoomInfo;
import com.demo.damulTalk.chat.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatRoomService chatRoomService;

    @GetMapping
    public ResponseEntity<?> getChatRooms() {
        log.info("[ChatController] 채팅방 목록 조회 시작");

        List<ChatRoomInfo> response = chatRoomService.getChatRooms();
        if(response.isEmpty()){
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> addChatRoom(@RequestBody ChatRoomCreate chatRoomCreate) {
        log.info("[ChatController] 채팅방 생성 시작");

        Integer roomId = chatRoomService.createChatRoom(chatRoomCreate);
        return ResponseEntity.ok(roomId);
    }

}
