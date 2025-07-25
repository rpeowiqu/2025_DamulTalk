package com.demo.damulTalk.friend.mapper;

import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.friend.domain.Friend;
import com.demo.damulTalk.user.dto.UserStatusDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FriendMapper {

    List<UserStatusDto> selectFriends(Integer userId);

    int deleteFriendById(@Param("userId") Integer userId, @Param("friendId") Integer friendId);

    List<Integer> selectFriendIds(Integer userId);

    List<FriendDto> selectFriendRequestsById(Integer userId);

    int selectFriendRelationShipCount(@Param("userId") Integer userId, @Param("targetId") Integer targetId);

    String selectFriendRelationShip(@Param("userId") Integer userId, @Param("friendId") Integer friendId);

    int updateFriend(@Param("targetId") Integer targetId, @Param("userId") Integer userId);

    UserStatusDto selectFriendInfoById(Integer userId);

    String selectFriendStatus(Integer userId, Integer friendId);

    Friend selectFriendRelationShipById(Integer userId, Integer friendId);

}
