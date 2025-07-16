package com.demo.damulTalk.chat.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomCreated {

    private Integer roomId;

    private boolean isExisted;

}
