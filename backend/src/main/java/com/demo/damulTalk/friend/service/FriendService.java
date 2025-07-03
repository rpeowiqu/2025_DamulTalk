package com.demo.damulTalk.friend.service;

import com.demo.damulTalk.common.scroll.ScrollResponse;
import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.user.dto.UserStatusDto;

import java.util.List;

public interface FriendService {

    List<UserStatusDto> getFriendList(Integer userId);

    void sendFollowRequest(Integer targetId);

    void deleteFriend(Integer friendId);

    void deleteFriendRequest(Integer friendId);

    List<FriendDto> getFriendRequests();

    FriendDto addFriend(Integer targetId);

}
