package com.demo.damulTalk.chat.service;

import com.demo.damulTalk.chat.MessageType;
import com.demo.damulTalk.chat.domain.ChatMessage;
import com.demo.damulTalk.chat.domain.ChatRoom;
import com.demo.damulTalk.chat.domain.ChatRoomMember;
import com.demo.damulTalk.chat.dto.*;
import com.demo.damulTalk.chat.mapper.ChatRoomMapper;
import com.demo.damulTalk.chat.repository.ChatMessageRepository;
import com.demo.damulTalk.common.CommonWrapperDto;
import com.demo.damulTalk.common.NotificationType;
import com.demo.damulTalk.exception.BusinessException;
import com.demo.damulTalk.exception.ErrorCode;
import com.demo.damulTalk.user.domain.User;
import com.demo.damulTalk.user.mapper.UserMapper;
import com.demo.damulTalk.util.UserUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomMapper chatRoomMapper;
    private final ChatMessageRepository chatMessageRepository;
    private final RedisTemplate<String, String> redisTemplate;

    private final UserUtil userUtil;
    private final UserMapper userMapper;
    private final ObjectMapper objectMapper;
    private final ChatMessageFlushService chatMessageFlushService;

    @Override
    public List<ChatRoomInfo> getChatRooms() {
        log.info("[ChatRoomService] 채팅 목록 조회 시작");
        int userId = userUtil.getCurrentUserId();

        List<ChatRoom> rooms = chatRoomMapper.selectChatRoomsByUserId(userId);

        List<ChatRoomInfo> chatRoomInfos = rooms.stream().map(room -> {
            String roomName = chatRoomMapper.selectRoomName(room.getRoomId(), userId);

            ChatRoomInfo info = ChatRoomInfo.builder()
                    .roomId(room.getRoomId())
                    .roomName(roomName)
                    .roomSize(room.getRoomSize())
                    .build();

            List<User> profiles = chatRoomMapper.selectParticipants(room.getRoomId(), userId);
            List<String> profileImageUrls = profiles.stream()
                    .sorted(Comparator.comparing(User::getNickname))
                    .limit(5)
                    .map(User::getProfileImageUrl)
                    .collect(Collectors.toList());
            info.setProfileImageUrls(profileImageUrls);

            List<ChatMessage> redisMessages = getAllMessagesFromRedis(room.getRoomId());
            List<ChatMessage> filteredRedisMessages = redisMessages.stream()
                    .filter(msg -> msg.getSenderId() != 0)
                    .filter(msg -> msg.getMessageType() != MessageType.DATE && msg.getMessageType() != MessageType.EXIT)
                    .collect(Collectors.toList());

            List<MessageType> excludedTypes = List.of(MessageType.DATE, MessageType.EXIT);
            ChatMessage dbMsg = chatMessageRepository
                    .findTopByRoomIdAndSenderIdNotAndMessageTypeNotInOrderBySendTimeDesc(
                            room.getRoomId(), 0, excludedTypes);

            ChatMessage lastMsg = null;

            if (!filteredRedisMessages.isEmpty()) {
                filteredRedisMessages.sort(Comparator.comparing(ChatMessage::getSendTime).reversed());
                lastMsg = filteredRedisMessages.get(0);
            }

            if (dbMsg != null) {
                if (lastMsg == null || dbMsg.getSendTime().isAfter(lastMsg.getSendTime())) {
                    lastMsg = dbMsg;
                }
            }

            if (lastMsg != null) {
                info.setLastMessage(lastMsg.getContent());
                info.setLastMessageTime(lastMsg.getSendTime());
            }

            LocalDateTime lastReadTime = chatRoomMapper.selectLastReadTime(userId, room.getRoomId());
            int unread = chatMessageRepository.countByRoomIdAndSendTimeAfter(room.getRoomId(), lastReadTime);
            info.setUnReadMessageCount(unread);

            return info;
        }).collect(Collectors.toList());

        chatRoomInfos.sort(Comparator.comparing(ChatRoomInfo::getLastMessageTime,
                Comparator.nullsLast(Comparator.reverseOrder())));

        return chatRoomInfos;
    }

    @Override
    public ChatRoomCreated createChatRoom(ChatRoomCreate chatRoomCreate) {
        log.info("[ChatRoomService] 채팅방 생성 시작");

        int userId = userUtil.getCurrentUserId();
        List<Integer> userIds = new ArrayList<>(chatRoomCreate.getUserIds());

        if (!userIds.contains(userId)) {
            userIds.add(userId);
        }

        Integer existingRoomId = chatRoomMapper.selectRoomIdByExactUserIds(userIds, userIds.size());
        if (existingRoomId != null) {
            log.info("[ChatRoomService] 기존 채팅방 존재");
            return ChatRoomCreated.builder()
                    .roomId(existingRoomId)
                    .isExisted(true)
                    .build();
        }

        List<User> users = chatRoomMapper.selectUsersByIds(userIds);

        boolean isPrivate = userIds.size() == 2;
        boolean isNameChanged = Boolean.TRUE.equals(chatRoomCreate.getIsNameChanged());

        ChatRoom newRoom = ChatRoom.builder()
                .roomType(isPrivate ? RoomType.PRIVATE : RoomType.GROUP)
                .roomSize(userIds.size())
                .isNameChanged(isNameChanged)
                .build();

        chatRoomMapper.insertChatRoom(newRoom);
        int newRoomId = newRoom.getRoomId();

        List<ChatRoomMember> participants = new ArrayList<>();

        for (User user : users) {
            String nameForThisUser;

            if (isNameChanged) {
                nameForThisUser = chatRoomCreate.getRoomName();
            } else if (isPrivate) {
                nameForThisUser = users.stream()
                        .filter(u -> !u.getUserId().equals(user.getUserId()))
                        .map(User::getNickname)
                        .findFirst()
                        .orElse("1:1 채팅");
            } else {
                nameForThisUser = users.stream()
                        .map(User::getNickname)
                        .sorted()
                        .collect(Collectors.joining(", "));
            }

            participants.add(ChatRoomMember.builder()
                    .roomId(newRoomId)
                    .userId(user.getUserId())
                    .roomName(nameForThisUser)
                    .build());
        }

        chatRoomMapper.insertParticipantsWithNames(participants);

        log.info("[ChatRoomService] 채팅방 생성 완료: {}", newRoomId);
        return ChatRoomCreated.builder()
                .roomId(newRoomId)
                .isExisted(false)
                .build();
    }


    @Override
    public SimpleRoomInfo getChatRoomInfo(Integer roomId) {
        log.info("[ChatRoomService] 채팅방 정보 조회 시작 - roomId: {}", roomId);
        int userId = userUtil.getCurrentUserId();

        SimpleRoomInfo info = chatRoomMapper.selectRoomInfo(roomId, userId);
        if(info == null){
            throw new BusinessException(
                    ErrorCode.CHAT_ROOM_NOTFOUND,
                    "해당 채팅방이 존재하지 않습니다."
            );
        }

        List<RoomMemberInfo> members = chatRoomMapper.selectRoomMembers(roomId);

        info.setRoomMembers(members);

        return info;
    }

    @Override
    public void deleteChatRoom(Integer roomId) {
        log.info("[ChatRoomService] 채팅방 나가기 시작 - roomId: {}", roomId);

        int userId = userUtil.getCurrentUserId();
        User currentUser = userMapper.selectUserByUserId(userId);

        ChatRoom room = chatRoomMapper.selectRoomById(roomId, userId);
        if(room == null){
            throw new BusinessException(
                    ErrorCode.CHAT_ROOM_NOTFOUND,
                    "채팅방이 존재하지 않습니다."
            );
        }

        List<RoomMemberInfo> participants = chatRoomMapper.selectRoomMembers(roomId);
        if(participants.stream().noneMatch(u -> u.getUserId() == userId)){
            throw new BusinessException(
                    ErrorCode.UNAUTHORIZED,
                    "채팅방에 참여중인 사용자가 아닙니다."
            );
        }

        chatRoomMapper.deleteParticipant(roomId, userId);

        if(room.getRoomType() == RoomType.GROUP && !room.getIsNameChanged()) {
            List<RoomMemberInfo> remainedMembers = participants.stream()
                    .filter(user -> user.getUserId() != userId)
                    .toList();

            if (!remainedMembers.isEmpty()) {
                String updatedName = remainedMembers.stream()
                        .map(RoomMemberInfo::getNickname)
                        .sorted()
                        .collect(Collectors.joining(", "));
                for (RoomMemberInfo member : remainedMembers) {
                    chatRoomMapper.updateRoomName(roomId, member.getUserId(), updatedName);
                }
            }
        }

        try {
            String redisKey = "chat:room:" + roomId + ":messages";

            ChatMessage message = ChatMessage.builder()
                    .messageId(UUID.randomUUID().toString())
                    .roomId(roomId)
                    .senderId(0)
                    .messageType(MessageType.EXIT)
                    .content(currentUser.getNickname() + "님이 나갔습니다.")
                    .sendTime(LocalDateTime.now())
                    .build();

            redisTemplate.opsForList().rightPush(redisKey, objectMapper.writeValueAsString(message));
            chatMessageFlushService.tryFlush(redisKey);

            redisTemplate.convertAndSend("chats", objectMapper.writeValueAsString(CommonWrapperDto.<ChatSystemMessage>builder()
                    .roomId(roomId)
                    .type(NotificationType.CHAT_SYSTEM_MESSAGE)
                    .data(ChatSystemMessage.builder()
                            .messageId(message.getMessageId())
                            .senderId(0)
                            .messageType(message.getMessageType())
                            .content(message.getContent())
                            .sendTime(message.getSendTime())
                            .build())
                    .build()));
        } catch (Exception e) {
            log.error("[ChatMessageService] 메시지 전송 실패", e);
            throw new RuntimeException("메시지 전송 실패");
        }
    }

    private List<ChatMessage> getAllMessagesFromRedis(int roomId) {
        String redisKey = "chat:room:" + roomId + ":messages";
        Long size = redisTemplate.opsForList().size(redisKey);
        if (size == null || size == 0) return Collections.emptyList();

        List<String> jsonMessages = redisTemplate.opsForList().range(redisKey, 0, size - 1);
        if (jsonMessages == null) return Collections.emptyList();

        List<ChatMessage> messages = new ArrayList<>();
        for (String json : jsonMessages) {
            try {
                ChatMessage msg = objectMapper.readValue(json, ChatMessage.class);
                messages.add(msg);
            } catch (Exception e) {
                log.warn("[getAllMessagesFromRedis] 메시지 역직렬화 실패: {}", json, e);
            }
        }
        return messages;
    }

}
