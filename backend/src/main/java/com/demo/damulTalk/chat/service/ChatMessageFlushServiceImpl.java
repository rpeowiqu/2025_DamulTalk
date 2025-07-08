package com.demo.damulTalk.chat.service;

import com.demo.damulTalk.chat.batch.ChatMessageFlushConditionEvaluator;
import com.demo.damulTalk.chat.domain.ChatMessage;
import com.demo.damulTalk.chat.repository.ChatMessageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatMessageFlushServiceImpl implements ChatMessageFlushService {

    private final RedisTemplate<String, String> redisTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final ObjectMapper objectMapper;
    private final ChatMessageFlushConditionEvaluator evaluator;

    public void tryFlush(String key) {
        if (!evaluator.shouldFlush(key)) return;

        Long size = redisTemplate.opsForList().size(key);
        if (size == null || size == 0) return;

        List<ChatMessage> messages = new ArrayList<>();

        for (int i = 0; i < size; i++) {
            String json = redisTemplate.opsForList().leftPop(key);
            if (json != null) {
                try {
                    ChatMessage message = objectMapper.readValue(json, ChatMessage.class);
                    messages.add(message);
                } catch (Exception e) {
                    log.error("[FlushService] 메시지 역직렬화 실패", e);
                }
            }
        }

        if (!messages.isEmpty()) {
            chatMessageRepository.saveAll(messages);
            evaluator.updateLastFlushTimestamp(key);
            log.info("[FlushService] {}개 메시지 저장됨 - key: {}", messages.size(), key);
        }
    }
}
