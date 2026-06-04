package com.errorlog.backend.comment.dto;

public record CommentCreateRequest(
        Long postId,
        Long parentId,   // null이면 일반 댓글
        String content
) {}