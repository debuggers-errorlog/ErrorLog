package com.errorlog.backend.comment.repository;

import com.errorlog.backend.comment.entity.Comment;
import com.errorlog.backend.comment.entity.CommentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // 삭제 안 된(ACTIVE) 댓글만, 오래된 순으로
    List<Comment> findByPost_IdAndStatusOrderByCreatedAtAsc(Long postId, CommentStatus status);
}