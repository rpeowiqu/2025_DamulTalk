package com.demo.damulTalk.auth.service;


import com.demo.damulTalk.member.domain.Member;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

public interface JwtService {

    String extractUsername(String token);

    boolean isValid(String token, UserDetails user);

    boolean isValidRefreshToken(String token, Member user);

    String generateAccessToken(Member user);

    String generateRefreshToken(Member user);

    String generateTemporaryToken(String email);

    long getAccessTokenExpire();

    long getRefreshTokenExpire();

    long getTemporaryTokenExpire();

    Map<String, String> rotateTokens(String oldRefreshToken, Member user);

    void invalidateRefreshToken(String email);

    int getUserIdFromToken(String token);

    String getUsernameFromToken(String token);

    Member getUserInfoFromToken(String token);

}
