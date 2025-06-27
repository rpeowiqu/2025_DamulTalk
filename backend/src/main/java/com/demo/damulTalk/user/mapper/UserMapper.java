package com.demo.damulTalk.user.mapper;

import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.user.domain.User;
import com.demo.damulTalk.user.dto.UserStatusDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {

    User findByUsername(String username);

    User findByNickname(String nickname);

    int insertUser(User user);

    List<UserStatusDto> selectFriends(int userId);

    int insertFollowRequest(int userId, int targetId);

    FriendDto selectFollowInfoById(int userId);

}
