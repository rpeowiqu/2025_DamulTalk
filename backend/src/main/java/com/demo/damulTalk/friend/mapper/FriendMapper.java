package com.demo.damulTalk.friend.mapper;

import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.user.dto.UserStatusDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FriendMapper {

    List<UserStatusDto> selectFriends(Integer userId);

    int deleteFriendById(Integer userId, Integer friendId);

    List<Integer> selectFriendIds(Integer userId);

    int deleteFriendRequestById(Integer userId, Integer friendId);

    List<FriendDto> selectFriendRequestsById(Integer userId);

    int selectFriendRelationShipCount(int userId, Integer targetId);

    int updateFriend(Integer targetId, Integer userId);

    FriendDto selectFriendInfoById(Integer userId);

}
