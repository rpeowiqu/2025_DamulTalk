package com.demo.damulTalk.chat.batch;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChatMessageFlushConditionEvaluator {

    private final RedisTemplate<String, String> redisTemplate;
    private static final int FLUSH_MESSAGE_THRESHOLD = 100;
    private static final long FLUSH_INTERVAL_MILLIS = 30000;
    private static final String FLUSH_TIMESTAMP_SUFFIX = ":flush:timestamp";

    public boolean shouldFlush(String key) {
        Long size = redisTemplate.opsForList().size(key);
        if (size == null || size == 0) return false;

        if (size >= FLUSH_MESSAGE_THRESHOLD) return true;

        String timestampKey = key + FLUSH_TIMESTAMP_SUFFIX;
        String lastFlushStr = redisTemplate.opsForValue().get(timestampKey);
        long lastFlush = lastFlushStr != null ? Long.parseLong(lastFlushStr) : 0L;
        long now = System.currentTimeMillis();

        return (now - lastFlush >= FLUSH_INTERVAL_MILLIS);
    }

    public void updateLastFlushTimestamp(String key) {
        String timestampKey = key + FLUSH_TIMESTAMP_SUFFIX;
        redisTemplate.opsForValue().set(timestampKey, String.valueOf(System.currentTimeMillis()));
    }
}
