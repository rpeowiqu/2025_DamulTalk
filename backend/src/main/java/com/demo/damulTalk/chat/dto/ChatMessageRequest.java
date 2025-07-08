package com.demo.damulTalk.chat.dto;

import com.demo.damulTalk.chat.MessageType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageRequest {

    private Integer roomId;

    private MessageType messageType;

    private String content;

    private String clientId;

}
