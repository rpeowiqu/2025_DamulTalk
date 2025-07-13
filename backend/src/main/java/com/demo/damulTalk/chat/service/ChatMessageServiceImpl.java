package com.demo.damulTalk.chat.service;

import com.demo.damulTalk.chat.MessageType;
import com.demo.damulTalk.chat.domain.ChatMessage;
import com.demo.damulTalk.chat.dto.*;
import com.demo.damulTalk.chat.mapper.ChatRoomMapper;
import com.demo.damulTalk.chat.repository.ChatMessageRepository;
import com.demo.damulTalk.common.CommonWrapperDto;
import com.demo.damulTalk.common.NotificationType;
import com.demo.damulTalk.common.scroll.CursorPageMetaDto;
import com.demo.damulTalk.common.scroll.ScrollResponse;
import com.demo.damulTalk.user.domain.User;
import com.demo.damulTalk.user.mapper.UserMapper;
import com.demo.damulTalk.util.UserUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
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
    private final UserMapper userMapper;

    @Override
    public ScrollResponse<List<ChatMessageResponse>, String> getChatMessages(Integer roomId, LocalDateTime cursor, Integer size) {
        log.info("[ChatMessageService] 채팅 내역 조회 시작 - roomId: {}, cursor: {}, size: {}", roomId, cursor, size);

        int userId = userUtil.getCurrentUserId();
        if(cursor == null) {
            cursor = chatRoomMapper.selectLastReadTime(roomId, userId);
        }

        List<ChatMessage> newerMessages = chatMessageRepository.findByRoomIdAndSendTimeAfterOrderBySendTimeAsc(roomId, cursor);

        Pageable pageable = PageRequest.of(0, size + 1);
        List<ChatMessage> olderMessages = chatMessageRepository.findByRoomIdAndSendTimeBeforeOrderBySendTimeAsc(roomId, cursor, pageable);

        boolean hasNext = false;
        if (olderMessages.size() > size) {
            hasNext = true;
            olderMessages = olderMessages.subList(0, size);
        }

        List<ChatMessage> messages = new ArrayList<>();
        messages.addAll(olderMessages);
        messages.addAll(newerMessages);

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
    public void updateReadStatus(Integer roomId, OffsetDateTime lastReadAt) {
        log.info("[ChatMessageService] 채팅방 읽음 처리 시작 - roomId: {}, lastReadAt: {}", roomId, lastReadAt);

        int userId = userUtil.getCurrentUserId();
        LocalDateTime now = lastReadAt.atZoneSameInstant(ZoneId.of("Asia/Seoul")).toLocalDateTime();

        try {
            chatRoomMapper.updateReadStatus(userId, roomId, now);
            redisTemplate.convertAndSend("chats", objectMapper.writeValueAsString(CommonWrapperDto.<MessageReadResponse>builder()
                    .roomId(roomId)
                    .type(NotificationType.READ_TIME)
                    .data(MessageReadResponse.builder()
                            .userId(userId)
                            .lastReadAt(now)
                            .build())
                    .build()));
        } catch (Exception e) {
            log.error("[ChatMessageService] 메시지 전송 실패", e);
            throw new RuntimeException("메시지 전송 실패");
        }
    }

    @Override
    public void sendMessage(ChatMessageRequest messageRequest) {
        log.info("[ChatMessageService] 메시지 발송 요청: {}", messageRequest);

        User currentUser = userMapper.selectUserByUserId(messageRequest.getSenderId());

        ChatMessage message = ChatMessage.builder()
                .messageId(UUID.randomUUID().toString())
                .roomId(messageRequest.getRoomId())
                .senderId(currentUser.getUserId())
                .nickname(currentUser.getNickname())
                .profileImageUrl(currentUser.getProfileImageUrl())
                .messageType(MessageType.TEXT)
                .content(messageRequest.getContent())
                .sendTime(LocalDateTime.now())
                .unReadCount(0)
                .build();

        try {
            String redisKey = "chat:room:" + message.getRoomId() + ":messages";

            ChatMessage lastMessage = findLastMessage(message.getRoomId());
            if(lastMessage != null) {
                LocalDate lastDate = lastMessage.getSendTime().toLocalDate();
                LocalDate nowDate = message.getSendTime().toLocalDate();

                if(!lastDate.equals(nowDate)) {
                    ChatMessage systemMessage = ChatMessage.builder()
                            .messageId(UUID.randomUUID().toString())
                            .roomId(messageRequest.getRoomId())
                            .senderId(0)
                            .messageType(MessageType.DATE)
                            .content(nowDate.toString())
                            .sendTime(LocalDateTime.now())
                            .build();

                    redisTemplate.opsForList().rightPush(redisKey, objectMapper.writeValueAsString(systemMessage));
                    chatMessageFlushService.tryFlush(redisKey);
                    redisTemplate.convertAndSend("chats", objectMapper.writeValueAsString(CommonWrapperDto.<ChatSystemMessage>builder()
                            .roomId(messageRequest.getRoomId())
                            .type(NotificationType.CHAT_SYSTEM_MESSAGE)
                            .data(ChatSystemMessage.builder()
                                    .messageId(systemMessage.getMessageId())
                                    .senderId(systemMessage.getSenderId())
                                    .messageType(systemMessage.getMessageType())
                                    .content(systemMessage.getContent())
                                    .sendTime(systemMessage.getSendTime())
                                    .build())
                            .build()));
                }
            }

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

            redisTemplate.convertAndSend("chats", objectMapper.writeValueAsString(CommonWrapperDto.<ChatMessageResponse>builder()
                    .roomId(messageRequest.getRoomId())
                    .type(NotificationType.CHAT_MESSAGE)
                    .data(responseMessage)
                    .build()));

            List<User> participants = chatRoomMapper.selectParticipants(message.getRoomId(), currentUser.getUserId());
            for (User participant : participants) {
                if (participant.getUserId() == currentUser.getUserId()) continue;

                String presenceKey = "chat:room:" + message.getRoomId() + ":user:" + participant.getUserId();
                Boolean isPresent = redisTemplate.hasKey(presenceKey);

                if (!isPresent) {
                    ChatNotification notification = ChatNotification.builder()
                            .messageId(message.getMessageId())
                            .roomId(message.getRoomId())
                            .profileImageUrl(message.getProfileImageUrl())
                            .nickname(message.getNickname())
                            .messageType(message.getMessageType())
                            .content(message.getContent())
                            .sendTime(message.getSendTime())
                            .build();

                    redisTemplate.convertAndSend("notifications", objectMapper.writeValueAsString(CommonWrapperDto.<ChatNotification>builder()
                            .userId(participant.getUserId())
                            .type(NotificationType.CHAT_NOTI)
                            .data(notification)
                            .build()));
                }
            }

        } catch (Exception e) {
            log.error("[ChatMessageService] 메시지 전송 실패", e);
            throw new RuntimeException("메시지 전송 실패");
        }
    }

    private ChatMessage findLastMessage(int roomId) {
        String redisKey = "chat:room:" + roomId + ":messages";
        Long size = redisTemplate.opsForList().size(redisKey);

        if (size != null && size > 0) {
            String json = redisTemplate.opsForList().index(redisKey, size - 1);
            if (json != null) {
                try {
                    return objectMapper.readValue(json, ChatMessage.class);
                } catch (Exception e) {
                    log.warn("[ChatMessageService] Redis 메시지 역직렬화 실패", e);
                }
            }
        }

        return chatMessageRepository.findTopByRoomIdOrderBySendTimeDesc(roomId);
    }


}
