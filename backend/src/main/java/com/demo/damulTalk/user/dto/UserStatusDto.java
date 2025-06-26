package com.demo.damulTalk.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserStatusDto {

    private int userId;

    private String nickname;

    private String profileImageUrl;

    private boolean online;

}
