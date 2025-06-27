package com.demo.damulTalk.friend.service;

import com.demo.damulTalk.common.scroll.ScrollResponse;
import com.demo.damulTalk.friend.dto.FriendDto;

import java.util.List;

public interface FriendService {

    void sendFollowRequest(Integer targetId);

    ScrollResponse<List<FriendDto>, String> getSearchResult(String nickname, String cursor, int size);

    void deleteFriend(Integer friendId);

}
