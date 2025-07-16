package com.demo.damulTalk.user.service;

import com.demo.damulTalk.common.scroll.ScrollResponse;
import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.user.dto.UserInfo;

import java.util.List;

public interface UserService {

    UserInfo getUserInfo(Integer id);

    ScrollResponse<List<FriendDto>, String> getSearchResult(String nickname, String cursor, int size);

}
