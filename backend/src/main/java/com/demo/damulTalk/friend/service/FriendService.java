package com.demo.damulTalk.friend.service;

import com.demo.damulTalk.friend.dto.FriendDto;

import java.util.List;

public interface FriendService {

    void sendFollowRequest(int targetId);

    List<FriendDto> getSearchResults(String nickname, int cursor, int size);

}
