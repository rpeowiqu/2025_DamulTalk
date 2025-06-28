package com.demo.damulTalk.user.service;

import com.demo.damulTalk.friend.mapper.FriendMapper;
import com.demo.damulTalk.user.dto.UserInfo;
import com.demo.damulTalk.user.dto.UserStatusDto;
import com.demo.damulTalk.user.mapper.UserMapper;
import com.demo.damulTalk.util.UserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserUtil userUtil;
    private final RedisTemplate<String, String> redisTemplate;
    private final FriendMapper friendMapper;

    @Override
    public List<UserStatusDto> getFriendList() {
        log.info("[UserService] 친구목록 조회 시작");

        int userId = userUtil.getCurrentUserId();

        // 친구 목록 불러오기 (nickname 가나다순 정렬 등은 쿼리에서 처리)
        List<UserStatusDto> list = friendMapper.selectFriends(userId);

        // Redis에서 온라인 상태 확인
        list.forEach(u -> {
            String redisKey = "user:online:" + u.getUserId();
            boolean online = Boolean.TRUE.equals(redisTemplate.hasKey(redisKey));
            u.setOnline(online);
        });

        return list;
    }

    @Override
    public UserInfo getUserInfo(Integer id) {
        log.info("[UserService] 유저 정보 조회 시작");

        if(id == null)
            id = userUtil.getCurrentUserId();

        UserInfo info = userMapper.selectUserInfo(id);

        return info;
    }

}
