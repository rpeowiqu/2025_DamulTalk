package com.demo.damulTalk.chat.service;

import com.demo.damulTalk.chat.domain.ChatMessage;
import com.demo.damulTalk.chat.domain.ChatRoom;
import com.demo.damulTalk.chat.dto.*;
import com.demo.damulTalk.chat.mapper.ChatRoomMapper;
import com.demo.damulTalk.chat.repository.ChatMessageRepository;
import com.demo.damulTalk.exception.BusinessException;
import com.demo.damulTalk.exception.ErrorCode;
import com.demo.damulTalk.user.domain.User;
import com.demo.damulTalk.util.UserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomMapper chatRoomMapper;
    private final ChatMessageRepository chatMessageRepository;

    private final UserUtil userUtil;

    @Override
    public List<ChatRoomInfo> getChatRooms() {
        log.info("[ChatRoomService] 채팅 목록 조회 시작");
        int userId = userUtil.getCurrentUserId();

        List<ChatRoom> rooms = chatRoomMapper.selectChatRoomsByUserId(userId);

        return rooms.stream().map(room -> {
            ChatRoomInfo info = ChatRoomInfo.builder()
                    .roomId(room.getRoomId())
                    .roomName(room.getRoomName())
                    .roomSize(room.getRoomSize())
                    .build();

            List<User> profiles = chatRoomMapper.selectParticipants(room.getRoomId(), userId);
            List<String> profileImageUrls = profiles.stream()
                    .sorted(Comparator.comparing(User::getNickname))
                    .limit(5)
                    .map(User::getProfileImageUrl)
                    .collect(Collectors.toList());
            info.setProfileImageUrls(profileImageUrls);

            ChatMessage lastMsg = chatMessageRepository.findTopByRoomIdOrderBySendTimeDesc(room.getRoomId());
            if(lastMsg != null){
                info.setLastMessage(lastMsg.getContent());
                info.setLastMessageTime(lastMsg.getSendTime());
            }

            LocalDateTime lastReadTime = chatRoomMapper.selectLastReadTime(userId, room.getRoomId());
            int unread = chatMessageRepository.countByRoomIdAndSendTimeAfter(room.getRoomId(), lastReadTime);
            info.setUnReadMessageCount(unread);

            return info;
        }).collect(Collectors.toList());
    }

    @Override
    public Integer createChatRoom(ChatRoomCreate chatRoomCreate) {
        log.info("[ChatRoomService] 채팅방 생성 시작");

        int userId = userUtil.getCurrentUserId();
        List<Integer> userIds = new ArrayList<>(chatRoomCreate.getUserIds());

        if(!userIds.contains(userId)){
            userIds.add(userId);
        }

        Integer existingRoomId = chatRoomMapper.selectRoomIdByExactUserIds(userIds, userIds.size());
        if(existingRoomId != null){
            log.info("[ChatRoomService] 기존 채팅방 존재");
            return existingRoomId;
        }

        String roomName = chatRoomCreate.getRoomName();
        if(roomName == null || roomName.isBlank()) {
            List<User> users = chatRoomMapper.selectParticipantsByIds(userIds);

            if(userIds.size() == 2) {
                roomName = users.stream()
                        .filter(user -> user.getUserId() != userId)
                        .map(User::getNickname)
                        .findFirst()
                        .orElse("1:1 채팅"); // 예외 처리용
            } else {
                roomName = users.stream()
                        .map(User::getNickname)
                        .sorted()
                        .collect(Collectors.joining(", "));
            }
        }


        ChatRoom newRoom = ChatRoom.builder()
                .roomName(roomName)
                .roomType(userIds.size() == 2 ? RoomType.PRIVATE : RoomType.GROUP)
                .roomSize(userIds.size())
                .build();

        chatRoomMapper.insertChatRoom(newRoom);

        int newRoomId = newRoom.getRoomId();

        chatRoomMapper.insertParticipants(newRoomId, userIds);

        log.info("[ChatRoomService] 채팅방 생성 완료: {}", newRoomId);
        return newRoomId;
    }

    @Override
    public SimpleRoomInfo getChatRoomInfo(Integer roomId) {
        log.info("[ChatRoomService] 채팅방 정보 조회 시작 - roomId: {}", roomId);

        SimpleRoomInfo info = chatRoomMapper.selectRoomInfo(roomId);
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

}
