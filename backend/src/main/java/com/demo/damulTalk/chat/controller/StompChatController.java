package com.demo.damulTalk.chat.controller;

import com.demo.damulTalk.chat.dto.ChatMessageRequest;
import com.demo.damulTalk.chat.dto.MessageReadRequest;
import com.demo.damulTalk.chat.dto.StompMessageReadRequest;
import com.demo.damulTalk.chat.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class StompChatController {

    private final ChatMessageService chatMessageService;

    @MessageMapping("/chats/messages")
    public void sendMessage(@Payload ChatMessageRequest message) {
        log.info("[StompChatController] sending message: {}", message);

        chatMessageService.sendMessage(message);
    }

    @MessageMapping("/chats/read")
    public void readMessage(@Payload StompMessageReadRequest message) {
        log.info("[StompChatController] reading message: {}", message);

        chatMessageService.updateReadStatus(message.getRoomId(), message.getUserId(), message.getLastReadAt());
    }

}
