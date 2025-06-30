package com.demo.damulTalk.user.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {

    private String nickname;

    private String profileImageUrl;

    private String statusMessage;

    private int friendCount;

    private LocalDateTime joinedAt;

    private FriendshipStatus isFriend;

}
