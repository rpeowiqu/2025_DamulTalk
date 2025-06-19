package com.demo.damulTalk.user.mapper;

import com.demo.damulTalk.user.domain.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {

    User findByUsername(String username);

    User findByNickname(String nickname);

    int insertUser(User user);

}
