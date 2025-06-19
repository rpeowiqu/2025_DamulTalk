package com.demo.damulTalk.user.service;

import com.demo.damulTalk.auth.dto.ValidValue;
import com.demo.damulTalk.user.dto.SignupRequest;

public interface UserService {

    void signup(SignupRequest request);

    void checkDuplicatesUsername(ValidValue value);

    void checkDuplicatesNickname(ValidValue value);

}
