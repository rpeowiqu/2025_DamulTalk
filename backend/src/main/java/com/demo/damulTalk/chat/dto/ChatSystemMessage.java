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

    String messageId;

    Integer senderId;

    String content;

    MessageType messageType;

    LocalDateTime sendTime;

}
