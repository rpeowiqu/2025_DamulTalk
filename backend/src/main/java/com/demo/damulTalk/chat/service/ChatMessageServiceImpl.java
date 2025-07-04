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
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final RestClient.Builder builder;
    private final ChatRoomMapper chatRoomMapper;
    private final UserUtil userUtil;

    @Override
    public ScrollResponse<List<ChatMessageResponse>, String> getChatMessages(Integer roomId, LocalDateTime cursor, Integer size) {
        log.info("[ChatMessageService] 채팅 내역 조회 시작 - roomId: {}, cursor: {}, size: {}", roomId, cursor, size);

        Pageable pageable = PageRequest.of(0, size + 1);
        List<ChatMessage> messages = (cursor != null) ?
                chatMessageRepository.findByRoomIdAndSendTimeBeforeOrderBySendTimeDesc(roomId, cursor, pageable) :
                chatMessageRepository.findByRoomIdOrderBySendTimeDesc(roomId, pageable);

        boolean hasNext = messages.size() > size;
        if(hasNext) {
            messages = messages.subList(0, size);
        }

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
