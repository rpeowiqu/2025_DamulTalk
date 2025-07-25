package com.demo.damulTalk.chat.mapper;

import com.demo.damulTalk.chat.domain.ChatRoom;
import com.demo.damulTalk.chat.domain.ChatRoomMember;
import com.demo.damulTalk.chat.dto.RoomMemberInfo;
import com.demo.damulTalk.chat.dto.SimpleRoomInfo;
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

    SimpleRoomInfo selectRoomInfo(@Param("roomId") Integer roomId, @Param("userId") Integer userId);

    List<RoomMemberInfo> selectRoomMembers(@Param("roomId") Integer roomId);

    List<User> selectUsersByIds(@Param("userIds") List<Integer> userIds);

    ChatRoom selectRoomById(@Param("roomId") Integer roomId, @Param("userId") Integer userId);

    int deleteParticipant(@Param("roomId") Integer roomId, @Param("userId") Integer userId);

    int updateRoomName(@Param("roomId") Integer roomId, @Param("userId") Integer userId, @Param("roomName") String roomName);

    int updateReadStatus(@Param("userId") Integer userId, @Param("roomId") Integer roomId, @Param("lastReadAt") LocalDateTime lastReadAt);

    int insertParticipantsWithNames(List<ChatRoomMember> participants);

    String selectRoomName(@Param("roomId") Integer roomId, @Param("userId") Integer userId);

    int updateRoomSize(@Param("roomId") Integer roomId, @Param("roomSize") Integer roomSize);

}
