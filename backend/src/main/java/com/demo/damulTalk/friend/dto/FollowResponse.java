package com.demo.damulTalk.friend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FollowResponse {

    private int userId;

    private String nickname;

    private String profileImageUrl;

}
