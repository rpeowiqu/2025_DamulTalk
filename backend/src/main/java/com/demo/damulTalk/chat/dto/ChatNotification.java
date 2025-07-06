package com.demo.damulTalk.chat.dto;

import com.demo.damulTalk.chat.MessageType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatNotification {

    private String messageId;

    private Integer roomId;

    private String profileImageUrl;

    private String nickname;

    private MessageType messageType;

    private String content;

    private LocalDateTime sendTime;

}
