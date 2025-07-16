package com.demo.damulTalk.chat.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageReadResponse {

    private Integer userId;
    private LocalDateTime lastReadAt;

}
