package com.demo.damulTalk.chat.batch;

import com.demo.damulTalk.chat.service.ChatMessageFlushService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChatMessageBatchSaver {

    private final RedisTemplate<String, String> redisTemplate;
    private final ChatMessageFlushService flushService;

    @Scheduled(fixedRate = 60000)
    public void flushChatBuffers() {
        Set<String> keys = redisTemplate.keys("chat:room:*:messages");
        if (keys == null || keys.isEmpty()) return;

        for (String key : keys) {
            flushService.tryFlush(key);
        }
    }
}
