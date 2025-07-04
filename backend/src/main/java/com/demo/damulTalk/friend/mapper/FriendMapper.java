package com.demo.damulTalk.friend.mapper;

import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.user.dto.UserStatusDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FriendMapper {

    List<UserStatusDto> selectFriends(Integer userId);

    int deleteFriendById(@Param("userId") Integer userId, @Param("friendId") Integer friendId);

    List<Integer> selectFriendIds(Integer userId);

    int deleteFriendRequestById(@Param("userId") Integer userId, @Param("friendId") Integer friendId);

    List<FriendDto> selectFriendRequestsById(Integer userId);

    int selectFriendRelationShipCount(@Param("userId") Integer userId, @Param("targetId") Integer targetId);

    int updateFriend(@Param("targetId") Integer targetId, @Param("userId") Integer userId);

    FriendDto selectFriendInfoById(Integer userId);

}
