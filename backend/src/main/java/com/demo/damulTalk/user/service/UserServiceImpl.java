package com.demo.damulTalk.user.service;

import com.demo.damulTalk.common.scroll.CursorPageMetaDto;
import com.demo.damulTalk.common.scroll.ScrollResponse;
import com.demo.damulTalk.user.dto.UserStatusDto;
import com.demo.damulTalk.user.mapper.UserMapper;
import com.demo.damulTalk.util.UserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserUtil userUtil;

    public ScrollResponse<UserStatusDto, String> getFriendList(String cursor, int size) {
        log.info("[UserService] 친구목록 조회 시작 - cursor: {}, size: {}", cursor, size);

        boolean isOnline = true;
        String nicknameCursor = "";

        if (cursor != null && cursor.contains(":")) {
            String[] parts = cursor.split(":", 2);
            isOnline = "online".equals(parts[0]);
            nicknameCursor = parts[1];
        }

        int userId = userUtil.getCurrentUserId();

        List<UserStatusDto> list = userMapper.selectFriends(userId, nicknameCursor, size + 1);
        boolean hasNext = list.size() > size;

        if(hasNext) {
            UserStatusDto last = list.remove(list.size() - 1);
            String nextCursor = (last.isOnline() ? "online" : "offline") + ":" + last.getNickname();
            return new ScrollResponse<>(list, new CursorPageMetaDto<>(nextCursor, true));
        } else
            return new ScrollResponse<>(list, new CursorPageMetaDto<>(null, false));
    }

}
