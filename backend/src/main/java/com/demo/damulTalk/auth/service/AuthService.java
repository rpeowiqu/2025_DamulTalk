package com.demo.damulTalk.auth.service;

import com.demo.damulTalk.auth.dto.LoginRequestDto;
import com.demo.damulTalk.auth.dto.LoginResponseDto;
import com.demo.damulTalk.auth.dto.ValidValue;
import com.demo.damulTalk.user.dto.SignupRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.RequestParam;

public interface AuthService {

    void signup(SignupRequest request);

    LoginResponseDto login(LoginRequestDto loginRequest, HttpServletResponse response);

    void logout(HttpServletRequest request, HttpServletResponse response);

    boolean checkDuplicatesUsername(ValidValue value);

    boolean checkDuplicatesNickname(ValidValue value, String token);

    void changePassword(HttpServletRequest request, String password);

    void issueTestTokens(@RequestParam String username, HttpServletResponse response);

    LoginResponseDto getUserInfo();

    void refreshTokenRotate(HttpServletRequest request, HttpServletResponse response);

}
