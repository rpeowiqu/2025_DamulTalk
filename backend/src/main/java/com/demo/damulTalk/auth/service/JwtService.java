package com.demo.damulTalk.auth.service;


import com.demo.damulTalk.user.domain.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

public interface JwtService {

    String extractUsername(String token);

    boolean isValid(String token, UserDetails user);

    boolean isValidRefreshToken(String token, User user);

    String generateAccessToken(User user);

    String generateRefreshToken(User user);

    String generateTemporaryToken(String email);

    long getAccessTokenExpire();

    long getRefreshTokenExpire();

    long getTemporaryTokenExpire();

    Map<String, String> rotateTokens(String oldRefreshToken, User user);

    void invalidateRefreshToken(String email);

    int getUserIdFromToken(String token);

    String getUsernameFromToken(String token);

    User getUserInfoFromToken(String token);

}
