package com.errorlog.backend.domain.admin.dto;

import com.errorlog.backend.domain.board.domain.enums.PostStatus;
import com.errorlog.backend.domain.board.domain.enums.PostVisibility;
import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PostListResponseDto {
    private final Long id;
    private final String title;
    private final String authorNickname;   // 조인으로 채움
    private final PostVisibility visibility;
    private final PostStatus status;
    private final Integer viewCount;
    private final LocalDateTime createdAt;

    @QueryProjection
    public PostListResponseDto(Long id, String title, String authorNickname,
                               PostVisibility visibility, PostStatus status,
                               Integer viewCount, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.authorNickname = authorNickname;
        this.visibility = visibility;
        this.status = status;
        this.viewCount = viewCount;
        this.createdAt = createdAt;
    }
}