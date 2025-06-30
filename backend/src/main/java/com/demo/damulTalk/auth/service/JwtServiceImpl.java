package com.demo.damulTalk.auth.service;

import com.demo.damulTalk.exception.BusinessException;
import com.demo.damulTalk.exception.ErrorCode;
import com.demo.damulTalk.user.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-token-expiration}")
    private Long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration;

    @Value("${jwt.temporary-token-expiration}")
    private Long temporaryTokenExpiration;

    private final RedisTemplate<String, String> redisTemplate;
    private static final String REFRESH_TOKEN_PREFIX = "RT:";

    @Override
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public boolean isValid(String token, UserDetails user) {
        String username = extractUsername(token);
        if(!username.equals(user.getUsername())) {
            throw new BusinessException(
                    ErrorCode.INVALID_USER,
                    "토큰의 사용자 정보가 일치하지 않습니다."
            );
        }

        if(isTokenExpired(token)) {
            throw new BusinessException(
                    ErrorCode.EXPIRED_TOKEN,
                    "만료된 토큰입니다."
            );
        }

        return true;
    }

    @Override
    public boolean isValidRefreshToken(String token, User user) {
        String username = extractUsername(token);
        if(!username.equals(user.getUsername())) {
            throw new BusinessException(
                    ErrorCode.INVALID_USER,
                    "토큰의 사용자 정보가 일치하지 않습니다."
            );
        }

        if(isTokenExpired(token)) {
            throw new BusinessException(
                    ErrorCode.EXPIRED_TOKEN,
                    "만료된 토큰입니다."
            );
        }

        String storedToken = redisTemplate.opsForValue().get(REFRESH_TOKEN_PREFIX + username);
        if(storedToken == null) {
            throw new BusinessException(
                    ErrorCode.REFRESH_TOKEN_NOT_FOUND,
                    "저장된 리프레시 토큰을 찾을 수 없습니다."
            );
        }

        if(!token.equals(storedToken)) {
            throw new BusinessException(
                    ErrorCode.INVALID_TOKEN,
                    "유효하지 않은 토큰입니다."
            );
        }

        return true;
    }

    private boolean isTokenExpired(String token) { // 토큰 만료 여부 확인
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) { // 토큰의 만료 시간 추출
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) { // 토큰에서 특정 클레임 추출
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    private Claims extractAllClaims(String token) { // 토큰에서 모든 클레임 추출
        return Jwts
                .parser()
                .verifyWith(getSigninKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    @Override
    public String generateAccessToken(User user) {
        String accessToken = generateToken(user, accessTokenExpiration);
        return accessToken;
    }

    @Override
    public String generateRefreshToken(User user) {
        String refreshToken = generateToken(user, refreshTokenExpiration);
        saveRefreshToken(user.getUsername(), refreshToken);
        return refreshToken;
    }

    @Override
    public String generateTemporaryToken(String email) {
        String temporaryToken = generateTempToken(email, temporaryTokenExpiration);
        return temporaryToken;
    }

    private String generateTempToken(String email, long expireTime) { // 임시 토큰 생성 로직
        return Jwts
                .builder()
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expireTime))
                .signWith(getSigninKey())
                .compact();
    }

    private String generateToken(User user, long expireTime) { // JWT 토큰 생성 (사용자 정보와 만료 시간 포함)
        return Jwts
                .builder()
                .subject(user.getUsername())
                .claim("userId", user.getUserId()) // 토큰에 id 저장
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expireTime))
                .signWith(getSigninKey())
                .compact();
    }

    private void saveRefreshToken(String email, String refreshToken) { // 리프레시 토큰을 Redis에 저장
        redisTemplate.opsForValue().set(
                REFRESH_TOKEN_PREFIX + email,
                refreshToken,
                refreshTokenExpiration,
                TimeUnit.MILLISECONDS
        );
    }

    private SecretKey getSigninKey() { // JWT 서명에 사용할 키 생성
        byte[] keyBytes = Decoders.BASE64URL.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public long getAccessTokenExpire() {
        return accessTokenExpiration;
    }

    @Override
    public long getRefreshTokenExpire() {
        return refreshTokenExpiration;
    }

    @Override
    public long getTemporaryTokenExpire() {
        return temporaryTokenExpiration;
    }

    @Override
    public Map<String, String> rotateTokens(String oldRefreshToken, User user) {
        if(!isValidRefreshToken(oldRefreshToken, user)) {
            throw new BusinessException(
                    ErrorCode.INVALID_TOKEN,
                    "유효하지 않은 토큰입니다."
            );
        }

        invalidateRefreshToken(oldRefreshToken);

        String newAccessToken = generateAccessToken(user);
        String newRefreshToken = generateRefreshToken(user);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("access_token", newAccessToken);
        tokens.put("refresh_token", newRefreshToken);

        return tokens;
    }

    @Override
    public void invalidateRefreshToken(String email) {
        redisTemplate.delete(REFRESH_TOKEN_PREFIX + email);
    }

    @Override
    public int getUserIdFromToken(String token) {
        int memberId = extractAllClaims(token).get("userId", Integer.class);
        return memberId;
    }

    @Override
    public String getUsernameFromToken(String token) {
        String username = extractAllClaims(token).getSubject();
        return username;
    }

    @Override
    public User getUserInfoFromToken(String token) {
        Claims claims = extractAllClaims(token);
        return User.builder()
                .userId(claims.get("memberId", Integer.class))
                .username(claims.get("username", String.class))
                .build();
    }
}
