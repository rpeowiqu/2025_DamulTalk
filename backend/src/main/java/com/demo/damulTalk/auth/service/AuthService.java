package com.demo.damulTalk.auth.service;

import com.demo.damulTalk.auth.dto.LoginRequestDto;
import com.demo.damulTalk.auth.dto.LoginResponseDto;
import com.demo.damulTalk.auth.dto.ValidValue;
import com.demo.damulTalk.user.dto.SignupRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    void signup(SignupRequest request);

    LoginResponseDto login(LoginRequestDto loginRequest, HttpServletResponse response);

    void logout(HttpServletRequest request, HttpServletResponse response);

    void checkDuplicatesUsername(ValidValue value);

    void checkDuplicatesNickname(ValidValue value);

    void changePassword(HttpServletRequest request, String password);

}
