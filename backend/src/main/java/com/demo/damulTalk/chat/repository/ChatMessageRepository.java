package com.demo.damulTalk.chat.repository;

import com.demo.damulTalk.chat.domain.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    ChatMessage findTopByRoomIdOrderBySendTimeDesc(Integer roomId);

    int countByRoomIdAndSendTimeAfter(Integer roomId, LocalDateTime sendTime);

    List<ChatMessage> findByRoomIdAndSendTimeBeforeOrderBySendTimeDesc(Integer roomId, LocalDateTime sendTime, Pageable pageable);

    List<ChatMessage> findByRoomIdOrderBySendTimeDesc(Integer roomId, Pageable pageable);

    List<ChatMessage> findByRoomIdAndSendTimeAfterOrderBySendTimeAsc(Integer roomId, LocalDateTime sendTime);

}
