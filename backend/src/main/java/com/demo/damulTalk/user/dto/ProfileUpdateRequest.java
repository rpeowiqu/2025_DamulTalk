package com.demo.damulTalk.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateRequest {

    private String nickname;

    private String statusMessage;

    private Boolean isDefaultProfile;

    private Boolean isDefaultBackground;

}
