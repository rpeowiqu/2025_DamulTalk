package com.demo.damulTalk.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateNotification {

    private int userId;

    private String nickname;

    private String profileImageUrl;

}
