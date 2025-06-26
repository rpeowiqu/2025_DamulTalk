package com.demo.damulTalk.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatusDto {

    private int userId;

    private String nickname;

    private String profileImageUsl;

    private boolean online;

}
