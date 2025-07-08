package com.demo.damulTalk.chat.service;

import com.demo.damulTalk.chat.MessageType;
import com.demo.damulTalk.chat.domain.ChatMessage;
import com.demo.damulTalk.chat.dto.ChatMessageRequest;
import com.demo.damulTalk.chat.dto.ChatMessageResponse;
import com.demo.damulTalk.chat.dto.ChatNotification;
import com.demo.damulTalk.chat.mapper.ChatRoomMapper;
import com.demo.damulTalk.chat.repository.ChatMessageRepository;
import com.demo.damulTalk.common.CommonWrapperDto;
import com.demo.damulTalk.common.NotificationType;
import com.demo.damulTalk.common.scroll.CursorPageMetaDto;
import com.demo.damulTalk.common.scroll.ScrollResponse;
import com.demo.damulTalk.user.domain.User;
import com.demo.damulTalk.util.UserUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMapper chatRoomMapper;
    private final UserUtil userUtil;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final ChatMessageFlushService chatMessageFlushService;

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

    @Override
    public void updateReadStatus(Integer roomId, LocalDateTime lastReadAt) {
        log.info("[ChatMessageService] 채팅방 읽음 처리 시작 - roomId: {}, lastReadAt: {}", roomId, lastReadAt);

        int userId = userUtil.getCurrentUserId();
        chatRoomMapper.updateReadStatus(userId, roomId, lastReadAt);
    }

    @Override
    public void sendMessage(ChatMessageRequest messageRequest) {
        log.info("[ChatMessageService] 메시지 발송 요청: {}", messageRequest);

        int userId = userUtil.getCurrentUserId();
        User currentUser = userUtil.getCurrentUser();

        ChatMessage message = ChatMessage.builder()
                .messageId(UUID.randomUUID().toString())
                .roomId(messageRequest.getRoomId())
                .senderId(userId)
                .nickname(currentUser.getNickname())
                .profileImageUrl(currentUser.getProfileImageUrl())
                .messageType(MessageType.TEXT)
                .content(messageRequest.getContent())
                .sendTime(LocalDateTime.now())
                .unReadCount(0)
                .build();

        try {
            String redisKey = "chat:room:" + message.getRoomId() + ":messages";
            redisTemplate.opsForList().rightPush(redisKey, objectMapper.writeValueAsString(message));
            chatMessageFlushService.tryFlush(redisKey);

            ChatMessageResponse responseMessage = ChatMessageResponse.builder()
                    .messageId(message.getMessageId())
                    .roomId(message.getRoomId())
                    .senderId(message.getSenderId())
                    .profileImageUrl(message.getProfileImageUrl())
                    .nickname(message.getNickname())
                    .messageType(message.getMessageType())
                    .content(message.getContent())
                    .sendTime(message.getSendTime())
                    .unReadCount(0)
                    .clientId(messageRequest.getClientId())
                    .build();

            redisTemplate.convertAndSend("chats", objectMapper.writeValueAsString(responseMessage));

            List<User> participants = chatRoomMapper.selectParticipants(message.getRoomId(), userId);
            for (User participant : participants) {
                if (participant.getUserId() == userId) continue;

                String presenceKey = "chat:room:" + message.getRoomId() + ":user:" + participant.getUserId();
                Boolean isPresent = redisTemplate.hasKey(presenceKey);

                if (Boolean.FALSE.equals(isPresent)) {
                    ChatNotification notification = ChatNotification.builder()
                            .messageId(message.getMessageId())
                            .roomId(message.getRoomId())
                            .profileImageUrl(message.getProfileImageUrl())
                            .nickname(message.getNickname())
                            .messageType(message.getMessageType())
                            .content(message.getContent())
                            .sendTime(message.getSendTime())
                            .build();

                    redisTemplate.convertAndSend("notifications", CommonWrapperDto.<ChatNotification>builder()
                            .userId(participant.getUserId())
                            .type(NotificationType.CHAT_MESSAGE)
                            .data(notification)
                            .build());
                }
            }

        } catch (Exception e) {
            log.error("[ChatMessageService] 메시지 전송 실패", e);
            throw new RuntimeException("메시지 전송 실패");
        }
    }


}
