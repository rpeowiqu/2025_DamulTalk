package com.demo.damulTalk.chat.controller;

import com.demo.damulTalk.chat.dto.ChatMessageRequest;
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

}
