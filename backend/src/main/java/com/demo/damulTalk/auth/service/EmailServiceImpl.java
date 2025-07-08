package com.demo.damulTalk.auth.service;

import com.demo.damulTalk.auth.dto.EmailCodeDto;
import com.demo.damulTalk.exception.BusinessException;
import com.demo.damulTalk.exception.ErrorCode;
import com.demo.damulTalk.user.mapper.UserMapper;
import com.demo.damulTalk.util.CookieUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;
    private final UserMapper userMapper;
    private final RedisTemplate<String, String> redisTemplate;
    private final JwtService jwtService;
    private final CookieUtil cookieUtil;

    @Value("${logo.image.url}")
    private String logoUrl;

    @Override
    public void sendPasswordResetCode(HttpServletResponse response, String email) {
        log.info("[EmailService] 인증코드 발송 시작: {}", email);

        if (userMapper.findByUsername(email) == null) {
            log.error("[EmailService] 존재하지 않는 이메일: {}", email);
            throw new BusinessException(ErrorCode.INVALID_USER, "가입되지 않은 이메일입니다.");
        }

        String code = generateCode();
        String key = "password:reset:code:" + email;
        redisTemplate.opsForValue().set(key, code, Duration.ofMinutes(5));

        String htmlContent = """
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="%s" alt="DamulTalk Logo" style="max-width: 180px;">
            </div>
            <div style="background-color: #f4f6f9; padding: 30px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); text-align: center;">
                <h2 style="color: #3b3f5c; margin-bottom: 16px;">이메일 인증 요청</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    안녕하세요!<br>
                    다물톡(DamulTalk) 사용을 위한 이메일 인증 코드입니다.<br>
                    아래 코드를 입력하여 인증을 완료해주세요.
                </p>
                <div style="margin: 30px auto; width: fit-content; background-color: #ffffff; padding: 18px 24px; border-radius: 8px; border: 1px solid #ddd;">
                    <span style="font-size: 26px; font-weight: bold; color: #007bff;">%s</span>
                </div>
                <p style="color: #888; font-size: 14px;">
                    인증 코드는 발송 시점부터 <strong>5분간</strong> 유효합니다.
                </p>
            </div>
            <p style="margin-top: 40px; font-size: 12px; color: #aaa; text-align: center;">
                본 메일은 발신 전용입니다. 문의 사항은 고객센터로 연락해 주세요.
            </p>
        </div>
        """.formatted(logoUrl, code);

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("다믈톡(DamulTalk) 비밀번호 인증 코드");
            helper.setText(htmlContent, true);
            javaMailSender.send(message);

            String temporaryToken = jwtService.generateTemporaryToken(email);
            cookieUtil.addCookie(
                    response,
                    "temporary_token",
                    temporaryToken,
                    (int) jwtService.getTemporaryTokenExpire()
            );

            log.info("[EmailService] 인증코드 이메일 발송 완료: {}", email);
        } catch (MessagingException e) {
            log.error("[EmailService] 이메일 발송 실패: {}", e.getMessage(), e);
            throw new BusinessException(ErrorCode.EMAIL_SEND_FAIL, "인증 이메일 전송에 실패했습니다.");
        }
    }

    @Override
    public void verificationResetCode(HttpServletRequest request, String code) {
        log.info("[EmailService] 인증코드 검증 시작");

        Cookie tokenCookie = cookieUtil.getCookie(request, "temporary_token");
        if (tokenCookie == null) {
            throw new BusinessException(ErrorCode.INVALID_TEMPORARY_TOKEN, "임시 토큰이 존재하지 않습니다.");
        }

        String email = jwtService.extractUsername(tokenCookie.getValue());
        String redisKey = "password:reset:code:" + email;
        String storedCode = redisTemplate.opsForValue().get(redisKey);

        if (!code.equals(storedCode)) {
            throw new BusinessException(ErrorCode.INVALID_CODE, "올바른 인증코드가 아닙니다.");
        }

        redisTemplate.delete(redisKey);
        log.info("[EmailService] 인증코드 검증 성공 - 이메일: {}", email);
    }


    private String generateCode() {
        SecureRandom random = new SecureRandom();
        int code = random.nextInt(900_000) + 100_000; // 100000 ~ 999999
        return String.valueOf(code);
    }

}
