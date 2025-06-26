package com.demo.damulTalk.common.scroll;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScrollResponse<T, Type> {

    private List<T> data;

    private CursorPageMetaDto<Type> meta;

}
