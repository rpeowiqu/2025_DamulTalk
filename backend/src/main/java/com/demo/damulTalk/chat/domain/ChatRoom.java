package com.demo.damulTalk.chat.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {

    private Integer roomId;

    private RoomType roomType;

    private String roomName;

    private Integer roomSize;

    private LocalDateTime createdAt;

    enum RoomType {
        PRIVATE, GROUP;
    }

}
