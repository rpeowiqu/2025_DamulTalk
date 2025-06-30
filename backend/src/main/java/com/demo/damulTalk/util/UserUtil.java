package com.demo.damulTalk.util;

import com.demo.damulTalk.exception.BusinessException;
import com.demo.damulTalk.exception.ErrorCode;
import com.demo.damulTalk.user.domain.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UserUtil {

    public int getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null)
            throw new BusinessException(
                    ErrorCode.INVALID_USER,
                    "유효하지 않은 유저입니다."
            );

        Object principal = authentication.getPrincipal();
        System.out.println("principal : " + principal);

        if(principal instanceof CustomUserDetails userDetails) {
            return userDetails.getUserId();
        }

        return -1;
    }

}
