package com.demo.damulTalk.chat.mapper;

import com.demo.damulTalk.chat.domain.ChatRoom;
import com.demo.damulTalk.user.domain.User;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface ChatRoomMapper {

    List<ChatRoom> selectChatRoomsByUserId(Integer userId);

    List<User> selectParticipants(Integer roomId, Integer userId);

    LocalDateTime selectLastReadTime(Integer userId, Integer roomId);

}
