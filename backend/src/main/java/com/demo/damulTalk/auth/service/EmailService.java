package com.demo.damulTalk.auth.service;

import com.demo.damulTalk.auth.dto.EmailCodeDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface EmailService {

    void sendPasswordResetCode(HttpServletResponse response, String email);

    void verificationResetCode(HttpServletRequest request, String code);

}
