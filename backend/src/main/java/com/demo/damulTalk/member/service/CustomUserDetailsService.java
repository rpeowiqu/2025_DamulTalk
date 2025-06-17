package com.demo.damulTalk.member.service;

import com.demo.damulTalk.member.domain.Member;
import com.demo.damulTalk.member.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberMapper memberMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = memberMapper.findByUsername(username);
        if(member == null) {
            throw new UsernameNotFoundException(username);
        }

        return User.builder()
                .username(member.getUsername())
                .password(member.getPassword())
                .authorities(Collections.emptyList())
                .build();
    }

}
