package com.demo.damulTalk.friend.service;

import com.demo.damulTalk.common.scroll.ScrollResponse;
import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.user.dto.UserStatusDto;

import java.util.List;

public interface FriendService {

    List<UserStatusDto> getFriendList(Integer userId);

    void sendFollowRequest(Integer targetId);

    ScrollResponse<List<FriendDto>, String> getSearchResult(String nickname, String cursor, int size);

    void deleteFriend(Integer friendId);

    void deleteFriendRequest(Integer friendId);

    List<FriendDto> getFriendRequests();

}
