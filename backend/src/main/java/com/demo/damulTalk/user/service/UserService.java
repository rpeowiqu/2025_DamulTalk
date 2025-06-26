package com.demo.damulTalk.user.service;

import com.demo.damulTalk.common.scroll.ScrollResponse;
import com.demo.damulTalk.user.dto.UserStatusDto;

public interface UserService {

    ScrollResponse<UserStatusDto, String> getFriendList(String cursor, int size);

}
