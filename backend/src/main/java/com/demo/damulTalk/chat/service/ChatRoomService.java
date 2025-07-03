package com.demo.damulTalk.chat.service;

import com.demo.damulTalk.chat.dto.ChatRoomCreate;
import com.demo.damulTalk.chat.dto.ChatRoomInfo;

import java.util.List;

public interface ChatRoomService {

    List<ChatRoomInfo> getChatRooms();

    Integer createChatRoom(ChatRoomCreate chatRoomCreate);

}
