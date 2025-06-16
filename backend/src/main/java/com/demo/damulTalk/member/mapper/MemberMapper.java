package com.demo.damulTalk.member.mapper;

import com.demo.damulTalk.member.domain.Member;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {

    Member findByUsername(String username);

}
