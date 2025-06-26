package com.demo.damulTalk.user.service;

import com.demo.damulTalk.user.dto.UserStatusDto;

import java.util.List;

public interface UserService {

    List<UserStatusDto> getFriendList();

}
