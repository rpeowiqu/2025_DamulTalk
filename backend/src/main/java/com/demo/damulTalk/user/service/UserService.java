package com.demo.damulTalk.user.service;

import com.demo.damulTalk.common.scroll.ScrollResponse;
import com.demo.damulTalk.friend.dto.FriendDto;
import com.demo.damulTalk.user.dto.ProfileUpdateRequest;
import com.demo.damulTalk.user.dto.UserInfo;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {

    UserInfo getUserInfo(Integer id);

    ScrollResponse<List<FriendDto>, String> getSearchResult(String nickname, String cursor, int size);

    UserInfo updateUserInfo(Integer userId, ProfileUpdateRequest request, MultipartFile profileImage, MultipartFile backgroundImage);

}
