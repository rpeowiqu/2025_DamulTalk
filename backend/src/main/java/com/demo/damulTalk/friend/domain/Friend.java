package com.demo.damulTalk.friend.domain;

import com.demo.damulTalk.user.dto.FriendshipStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Friend {

    private Integer friendId;

    private Integer firstUserId;

    private Integer secondUserId;

    private String status;

    private LocalDateTime requestedAt;

    private LocalDateTime acceptedAt;

}
