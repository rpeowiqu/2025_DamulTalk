package com.demo.damulTalk.chat.dto;

import com.demo.damulTalk.chat.MessageType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatSystemMessage {

    private String messageId;

    private Integer senderId;

    private String content;

    private MessageType messageType;

    private LocalDateTime sendTime;

}
