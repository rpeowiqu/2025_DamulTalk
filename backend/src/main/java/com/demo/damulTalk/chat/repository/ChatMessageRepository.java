package com.demo.damulTalk.chat.repository;

import com.demo.damulTalk.chat.domain.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    ChatMessage findTopByRoomIdOrderBySendTimeDesc(Integer roomId);

    int countByRoomIdAndSendTimeAfter(Integer roomId, LocalDateTime sendTime);

}
