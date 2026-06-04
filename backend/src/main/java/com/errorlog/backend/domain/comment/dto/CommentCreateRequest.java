package com.errorlog.backend.domain.comment.dto;

public record CommentCreateRequest(
        Long postId,
        Long parentId,   // null이면 일반 댓글
        String content
) {}