package com.demo.damulTalk.common;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommonWrapperDto<T> {

    private Integer userId;

    private Integer roomId;

    private NotificationType type;

    private T data;

}
