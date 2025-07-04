package com.demo.damulTalk.chat.dto;

import com.demo.damulTalk.chat.MessageType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageResponse {

    private String messageId;

    private Integer senderId;

    private String profileImageUrl;

    private String nickname;

    private MessageType messageType;

    private String content;

    private String fileUrl;

    private LocalDateTime sendTime;

    private Integer unReadCount;

}
