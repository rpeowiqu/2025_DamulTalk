package com.demo.damulTalk.chat.domain;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomMember {

    private Integer roomId;

    private Integer userId;

    private String roomName;

    private LocalDateTime lastReadAt;

    private LocalDateTime joinedAt;

}
