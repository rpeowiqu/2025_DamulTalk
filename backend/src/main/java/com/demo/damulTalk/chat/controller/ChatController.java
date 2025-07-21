package com.demo.damulTalk.chat.controller;

import com.demo.damulTalk.chat.dto.*;
import com.demo.damulTalk.chat.service.ChatMessageService;
import com.demo.damulTalk.chat.service.ChatRoomService;
import com.demo.damulTalk.common.CommonIdDto;
import com.demo.damulTalk.common.scroll.ScrollResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;

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

        ChatRoomCreated room = chatRoomService.createChatRoom(chatRoomCreate);
        if(room.isExisted())
            return ResponseEntity.ok(CommonIdDto.builder()
                    .id(room.getRoomId())
                    .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(CommonIdDto.builder()
                .id(room.getRoomId())
                .build());
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<?> getChatRoomInfo(@PathVariable("roomId") Integer roomId) {
        log.info("[ChatController] 채팅방 정보 조회 시작 - roomId: {}", roomId);

        SimpleRoomInfo info = chatRoomService.getChatRoomInfo(roomId);
        return ResponseEntity.ok(info);
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<?> getChatMessages(
            @PathVariable("roomId") Integer roomId,
            @RequestParam(required = false) LocalDateTime cursor,
            @RequestParam(defaultValue = "50") Integer size) {
        log.info("[ChatController] 채팅 메시지 조회 시작 - roomId: {}", roomId);

        ScrollResponse<List<ChatMessageResponse>, String> response = chatMessageService.getChatMessages(roomId,
                cursor, size);
        if(response.getData().isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        //
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<?> deleteChatRoom(@PathVariable("roomId") Integer roomId) {
        log.info("[ChatController] 채팅방 나가기 시작 - roomId: {}", roomId);

        chatRoomService.deleteChatRoom(roomId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{roomId}/read")
    public ResponseEntity<?> updateReadStatus(@PathVariable("roomId") Integer roomId, @RequestBody MessageReadRequest read) {
        log.info("[ChatController] 읽음 처리 시작 - roomId: {}", roomId);

        chatMessageService.updateReadStatus(roomId, read.getLastReadAt());
        return ResponseEntity.ok().build();
    }

}
