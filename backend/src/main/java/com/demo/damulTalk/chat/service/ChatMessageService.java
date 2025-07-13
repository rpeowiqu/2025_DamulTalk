package com.demo.damulTalk.chat.service;

import com.demo.damulTalk.chat.dto.ChatMessageRequest;
import com.demo.damulTalk.chat.dto.ChatMessageResponse;
import com.demo.damulTalk.common.scroll.ScrollResponse;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

public interface ChatMessageService {

    ScrollResponse<List<ChatMessageResponse>, String> getChatMessages(Integer roomId, LocalDateTime cursor, Integer size);

    void updateReadStatus(Integer roomId, OffsetDateTime lastReadAt);

    void sendMessage(ChatMessageRequest message);

}
