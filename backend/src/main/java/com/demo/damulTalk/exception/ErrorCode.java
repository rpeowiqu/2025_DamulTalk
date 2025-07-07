package com.demo.damulTalk.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    REFRESH_TOKEN_NOT_FOUND(HttpStatus.BAD_REQUEST, "리프레시 토큰을 찾을 수 없습니다."),
    UNAUTHORIZED(HttpStatus.FORBIDDEN, "권한이 없습니다."),

    INVALID_USER(HttpStatus.BAD_REQUEST, "유효하지 않은 유저입니다."),
    EXISTING_USER(HttpStatus.OK, "이미 존재하는 유저입니다."),
    INCORRECT_PASSWORD(HttpStatus.UNAUTHORIZED, "패스워드가 일치하지 않습니다."),
    EXISTING_NICKNAME(HttpStatus.OK, "이미 존재하는 닉네임입니다."),
    OUTLENGTH_NICKNAME(HttpStatus.BAD_REQUEST, "길이 제한에 맞지 않는 닉네임입니다."),

    EMAIL_SEND_FAIL(HttpStatus.BAD_REQUEST, "이메일 인증코드 발송에 실패하였습니다."),
    INVALID_CODE(HttpStatus.BAD_REQUEST, "올바른 코드가 아닙니다."),

    EXISTING_FRIEND(HttpStatus.BAD_REQUEST, "이미 존재하는 관계입니다."),
    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "유효하지 않은 요청입니다."),

    CHAT_ROOM_NOTFOUND(HttpStatus.BAD_REQUEST, "존재하지 않는 채팅방입니다."),;

    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

}
