package com.demo.damulTalk.chat.service;

import com.demo.damulTalk.chat.dto.ChatRoomCreate;
import com.demo.damulTalk.chat.dto.ChatRoomCreated;
import com.demo.damulTalk.chat.dto.ChatRoomInfo;
import com.demo.damulTalk.chat.dto.SimpleRoomInfo;

import java.util.List;

public interface ChatRoomService {

    List<ChatRoomInfo> getChatRooms();

    ChatRoomCreated createChatRoom(ChatRoomCreate chatRoomCreate);

    SimpleRoomInfo getChatRoomInfo(Integer roomId);

    void deleteChatRoom(Integer roomId);

}
