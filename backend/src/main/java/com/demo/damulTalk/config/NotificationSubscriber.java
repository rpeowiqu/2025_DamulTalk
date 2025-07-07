package com.demo.damulTalk.config;

import com.demo.damulTalk.common.CommonWrapperDto;
import com.demo.damulTalk.user.dto.ConnectionDto;
import com.fasterxml.jackson.core.JsonProcessingException;
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
public class NotificationSubscriber implements MessageListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String payload = new String(message.getBody(), StandardCharsets.UTF_8);
            CommonWrapperDto commonWrapperDto = objectMapper.readValue(payload, CommonWrapperDto.class);

            String topic = "/sub/notifications/" + commonWrapperDto.getUserId();
            messagingTemplate.convertAndSend(topic, commonWrapperDto);
        } catch(JsonProcessingException e) {
            log.error("[NotificationSubscriber] JSON 역직렬화 실패: {}", e.getMessage());
        }
    }

}
