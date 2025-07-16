package com.demo.damulTalk.chat.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomInfo {

    private Integer roomId;

    private String roomName;

    private Integer roomSize;

    private List<String> profileImageUrls;

    private String lastMessage;

    private LocalDateTime lastMessageTime;

    private Integer unReadMessageCount;

}
