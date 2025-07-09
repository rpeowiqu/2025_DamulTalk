package com.demo.damulTalk.chat.domain;

import com.demo.damulTalk.chat.dto.RoomType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoom {

    private Integer roomId;

    private RoomType roomType;

    private String roomName;

    private Integer roomSize;

    private LocalDateTime createdAt;

    private Boolean isNameChanged;

}
