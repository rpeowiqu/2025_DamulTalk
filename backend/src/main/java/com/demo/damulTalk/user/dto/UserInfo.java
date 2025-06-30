package com.demo.damulTalk.user.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfo {

    private String nickname;

    private String statusMessage;

    private int friendNum;

    private LocalDateTime joinedAt;

    private Boolean isFriend;

}
