package com.demo.damulTalk.user.mapper;

import com.demo.damulTalk.auth.dto.LoginResponseDto;
import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.user.domain.User;
import com.demo.damulTalk.user.dto.UserInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

    User findByUsername(String username);

    User findByNickname(String nickname);

    int insertUser(User user);

    int insertFollowRequest(@Param("userId") Integer userId, @Param("targetId") Integer targetId);

    FriendDto selectFollowInfoById(Integer userId);

    UserInfo selectUserInfo(@Param("userId") Integer userId, @Param("targetId") Integer targetId);

    int updatePassword(@Param("username") String username, @Param("password") String password);

    LoginResponseDto selectMyInfo(Integer userId);

    List<FriendDto> selectUsersByNickname(@Param("userId") Integer userId, @Param("nickname") String nickname, @Param("cursor") String cursor, @Param("size") Integer size);

}
