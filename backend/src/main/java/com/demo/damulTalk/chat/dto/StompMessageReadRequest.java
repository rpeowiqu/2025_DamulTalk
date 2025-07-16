package com.demo.damulTalk.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StompMessageReadRequest extends MessageReadRequest {

    private Integer roomId;

    private Integer userId;
}
