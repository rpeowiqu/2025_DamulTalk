package com.demo.damulTalk.common.scroll;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CursorPageMetaDto<T> {

    private T nextCursor;

    private boolean hasNext;

}
