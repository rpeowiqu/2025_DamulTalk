package com.demo.damulTalk.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomCreate {

    private String roomName;

    private List<Integer> userIds;

    private Boolean isNameChanged;

}
