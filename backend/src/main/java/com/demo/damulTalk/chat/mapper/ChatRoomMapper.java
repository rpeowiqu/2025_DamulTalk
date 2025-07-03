package com.demo.damulTalk.chat.mapper;

import com.demo.damulTalk.chat.domain.ChatRoom;
import com.demo.damulTalk.user.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface ChatRoomMapper {

    List<ChatRoom> selectChatRoomsByUserId(Integer userId);

    List<User> selectParticipants(@Param("roomId") Integer roomId, @Param("userId") Integer userId);

    LocalDateTime selectLastReadTime(@Param("userId") Integer userId, @Param("roomId") Integer roomId);

    Integer selectRoomIdByExactUserIds(@Param("userIds") List<Integer> userIds, @Param("size") Integer size);

    int insertChatRoom(ChatRoom chatRoom);

    int insertParticipants(@Param("roomId") Integer roomId, @Param("userIds") List<Integer> userIds);

}
