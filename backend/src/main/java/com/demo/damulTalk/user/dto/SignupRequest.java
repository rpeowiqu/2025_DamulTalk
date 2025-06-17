package com.demo.damulTalk.user.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
@Builder
public class SignupRequest {

    private String username;
    private String password;
    private String nickname;

}
