package com.demo.damulTalk.config;

import com.demo.damulTalk.chat.dto.ChatMessageResponse;
import com.demo.damulTalk.common.CommonWrapperDto;
import com.demo.damulTalk.common.NotificationType;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChatSubscriber implements MessageListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String payload = new String(message.getBody(), StandardCharsets.UTF_8);
            ChatMessageResponse chatMessage = objectMapper.readValue(payload, ChatMessageResponse.class);

            String topic = "/sub/chats/" + chatMessage.getRoomId();
            messagingTemplate.convertAndSend(topic, CommonWrapperDto.<ChatMessageResponse>builder()
                    .type(NotificationType.CHAT_MESSAGE)
                    .data(chatMessage));
        } catch (Exception e) {
            log.error("[ChatSubscriber] 메시지 수신 실패", e);
        }
    }

}
