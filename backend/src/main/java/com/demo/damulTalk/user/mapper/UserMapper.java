package com.demo.damulTalk.user.mapper;

import com.demo.damulTalk.auth.dto.LoginResponseDto;
import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.user.domain.User;
import com.demo.damulTalk.user.dto.UserInfo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {

    User findByUsername(String username);

    User findByNickname(String nickname);

    int insertUser(User user);

    int insertFollowRequest(Integer userId, Integer targetId);

    FriendDto selectFollowInfoById(Integer userId);

    UserInfo selectUserInfo(Integer userId, Integer targetId);

    int updatePassword(String username, String password);

    LoginResponseDto selectMyInfo(Integer userId);

    List<FriendDto> selectUsersByNickname(Integer userId, String nickname, String cursor, Integer size);

}
