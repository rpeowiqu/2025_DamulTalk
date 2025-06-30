package com.demo.damulTalk.user.service;

import com.demo.damulTalk.user.dto.UserInfo;
import com.demo.damulTalk.user.mapper.UserMapper;
import com.demo.damulTalk.util.UserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserUtil userUtil;

    @Override
    public UserInfo getUserInfo(Integer id) {
        log.info("[UserService] 유저 정보 조회 시작");

        if(id == null)
            id = userUtil.getCurrentUserId();

        int userId = userUtil.getCurrentUserId();

        UserInfo info = userMapper.selectUserInfo(userId, id);
        if(id == userId)
            info.setIsFriend(null);

        return info;
    }

}
