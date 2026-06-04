package com.errorlog.backend.domain.admin.dto;

import com.errorlog.backend.domain.post.entity.Post;
import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PostListResponseDto {
    private final Long id;
    private final String title;
    private final String authorNickname;   // 조인으로 채움
    private final Post.Visibility visibility;
    private final Post.Status status;
    private final Integer viewCount;
    private final LocalDateTime createdAt;

    @QueryProjection
    public PostListResponseDto(Long id, String title, String authorNickname,
                               Post.Visibility visibility, Post.Status status,
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