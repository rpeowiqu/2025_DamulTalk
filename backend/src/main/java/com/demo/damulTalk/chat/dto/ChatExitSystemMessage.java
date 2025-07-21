package com.demo.damulTalk.chat.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatExitSystemMessage extends ChatSystemMessage {

    private Integer userId;

    public static ChatExitSystemMessage of(ChatSystemMessage base, Integer userId) {
        ChatExitSystemMessage msg = new ChatExitSystemMessage();
        msg.setMessageId(base.getMessageId());
        msg.setSenderId(base.getSenderId());
        msg.setMessageType(base.getMessageType());
        msg.setContent(base.getContent());
        msg.setSendTime(base.getSendTime());
        msg.setUserId(userId);
        return msg;
    }

}
