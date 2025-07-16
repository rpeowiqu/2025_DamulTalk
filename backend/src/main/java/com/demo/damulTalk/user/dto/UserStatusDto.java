package com.demo.damulTalk.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatusDto {

    private int userId;

    private String nickname;

    private String profileImageUrl;

    private boolean online;

}
