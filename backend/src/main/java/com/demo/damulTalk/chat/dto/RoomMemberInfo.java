package com.demo.damulTalk.chat.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomMemberInfo {

    private Integer userId;

    private String nickname;

    private String profileImageUrl;

    private LocalDateTime lastReadAt;

}
