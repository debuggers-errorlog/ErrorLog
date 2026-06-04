package com.errorlog.backend.domain.comment.dto;

import com.errorlog.backend.domain.comment.entity.Comment;
import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        Long postId,
        Long userId,
        Long parentId,
        String content,
        String status,
        LocalDateTime createdAt
) {
    public static CommentResponse from(Comment c) {
        return new CommentResponse(
                c.getId(),
                c.getPost().getId(),
                c.getUser().getId(),
                c.getParent() == null ? null : c.getParent().getId(),
                c.getContent(),
                c.getStatus().name(),
                c.getCreatedAt()
        );
    }
}