package com.demo.damulTalk.chat.domain;

import com.demo.damulTalk.chat.MessageType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    private String messageId;

    private Integer roomId;

    private Integer senderId;

    private String profileImageUrl;

    private String nickname;

    private MessageType messageType;

    private String content;

    private String fileUrl;

    private LocalDateTime sendTime;

    private Integer unReadCount;

}
