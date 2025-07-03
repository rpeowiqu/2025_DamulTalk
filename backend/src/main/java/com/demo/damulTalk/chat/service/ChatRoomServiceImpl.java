package com.demo.damulTalk.chat.service;

import com.demo.damulTalk.chat.domain.ChatMessage;
import com.demo.damulTalk.chat.domain.ChatRoom;
import com.demo.damulTalk.chat.dto.ChatRoomInfo;
import com.demo.damulTalk.chat.mapper.ChatRoomMapper;
import com.demo.damulTalk.chat.repository.ChatMessageRepository;
import com.demo.damulTalk.user.domain.User;
import com.demo.damulTalk.util.UserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

}
