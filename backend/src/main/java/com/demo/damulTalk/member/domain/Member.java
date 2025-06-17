package com.demo.damulTalk.member.domain;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    private Integer memberId;
    private String username;
    private String password;
    private String nickname;
    private String profileImageUrl;
    private String statusMessage;
    private LocalDateTime joinedAt;

}
