package com.demo.damulTalk.user.domain;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    private Integer memberId;
    private String username;
    private String password;
    private String nickname;
    private String profileImageUrl;
    private String statusMessage;
    private LocalDateTime joinedAt;

}
