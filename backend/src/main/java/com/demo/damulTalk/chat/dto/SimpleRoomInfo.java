package com.demo.damulTalk.chat.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimpleRoomInfo {

    String roomName;

    Integer roomSize;

    List<RoomMemberInfo> roomMembers;

}
