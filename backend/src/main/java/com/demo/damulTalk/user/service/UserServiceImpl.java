package com.demo.damulTalk.user.service;

import com.demo.damulTalk.exception.BusinessException;
import com.demo.damulTalk.exception.ErrorCode;
import com.demo.damulTalk.user.domain.User;
import com.demo.damulTalk.user.dto.SignupRequest;
import com.demo.damulTalk.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public void signup(SignupRequest request) {
        log.info("[UserService] 회원가입 시작 - username: {}", request.getUsername());

        validateSignupForm(request);

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .joinedAt(LocalDateTime.now())
                .build();


        userMapper.insertUser(user);
    }

    private void validateSignupForm(SignupRequest request) {
        log.info("[UserService] 회원가입 요청 validation 시작");

        User existingUserByUsername = userMapper.findByUsername(request.getUsername());
        if (existingUserByUsername != null) {
            log.info("[UserService] 이미 존재하는 username - {}", request.getUsername());
            throw new BusinessException(
                    ErrorCode.EXISTING_USER,
                    "이미 사용 중인 username입니다."
            );
        }

        if (request.getNickname().length() > 12) {
            log.info("[UserService] 닉네임 길이 초과 - {}", request.getNickname());
            throw new BusinessException(
                    ErrorCode.OUTLENGTH_NICKNAME,
                    "닉네임은 12자 이하로 입력해주세요."
            );
        }

        User existingUserByNickname = userMapper.findByNickname(request.getNickname());
        if (existingUserByNickname != null) {
            log.info("[UserService] 이미 존재하는 닉네임 - {}", request.getNickname());
            throw new BusinessException(
                    ErrorCode.EXISTING_NICKNAME,
                    "이미 사용 중인 닉네임입니다."
            );
        }

        log.info("[UserService] 회원가입 validation 성공");
    }


}
