package com.demo.damulTalk.chat.service;

import com.demo.damulTalk.chat.domain.ChatMessage;
import com.demo.damulTalk.chat.dto.ChatMessageResponse;
import com.demo.damulTalk.chat.mapper.ChatRoomMapper;
import com.demo.damulTalk.chat.repository.ChatMessageRepository;
import com.demo.damulTalk.common.scroll.CursorPageMetaDto;
import com.demo.damulTalk.common.scroll.ScrollResponse;
import com.demo.damulTalk.util.UserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMapper chatRoomMapper;
    private final UserUtil userUtil;

    @Override
    public ScrollResponse<List<ChatMessageResponse>, String> getChatMessages(Integer roomId, LocalDateTime cursor, Integer size) {
        log.info("[ChatMessageService] 채팅 내역 조회 시작 - roomId: {}, cursor: {}, size: {}", roomId, cursor, size);

        int userId = userUtil.getCurrentUserId();
        if(cursor == null) {
            cursor = chatRoomMapper.selectLastReadTime(roomId, userId);
        }

        List<ChatMessage> newerMessages = chatMessageRepository.findByRoomIdAndSendTimeAfterOrderBySendTimeAsc(roomId, cursor);

        Pageable pageable = PageRequest.of(0, size + 1);
        List<ChatMessage> olderMessages = chatMessageRepository.findByRoomIdAndSendTimeBeforeOrderBySendTimeDesc(roomId, cursor, pageable);

        boolean hasNext = false;
        if (olderMessages.size() > size) {
            hasNext = true;
            olderMessages = olderMessages.subList(0, size);
        }

        List<ChatMessage> messages = new ArrayList<>();

        Collections.reverse(newerMessages);
        messages.addAll(newerMessages);
        messages.addAll(olderMessages);

        List<ChatMessageResponse> response = messages.stream()
                .map(msg -> ChatMessageResponse.builder()
                        .messageId(msg.getMessageId())
                        .senderId(msg.getSenderId())
                        .profileImageUrl(msg.getProfileImageUrl())
                        .nickname(msg.getNickname())
                        .messageType(msg.getMessageType())
                        .content(msg.getContent())
                        .fileUrl(msg.getFileUrl())
                        .sendTime(msg.getSendTime())
                        .unReadCount(0)
                        .build()
                ).collect(Collectors.toList());

        String nextCursor = hasNext ? response.get(response.size() - 1).getMessageId() : null;

        CursorPageMetaDto<String> cursorPageMetaDto = CursorPageMetaDto.<String>builder()
                .nextCursor(nextCursor)
                .hasNextCursor(hasNext)
                .build();

        return ScrollResponse.<List<ChatMessageResponse>, String>builder()
                .data(response)
                .meta(cursorPageMetaDto)
                .build();
    }

    public void updateReadStatus(Integer roomId, LocalDateTime lastReadAt) {
        log.info("[ChatMessageService] 채팅방 읽음 처리 시작 - roomId: {}, lastReadAt: {}", roomId, lastReadAt);

        int userId = userUtil.getCurrentUserId();
        chatRoomMapper.updateReadStatus(userId, roomId, lastReadAt);
    }

}
