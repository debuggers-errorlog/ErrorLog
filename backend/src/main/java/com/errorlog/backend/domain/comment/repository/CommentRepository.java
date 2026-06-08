package com.errorlog.backend.domain.comment.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.errorlog.backend.domain.comment.entity.Comment;
import com.errorlog.backend.domain.comment.entity.CommentStatus;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost_IdAndStatusOrderByCreatedAtAsc(Long postId, CommentStatus status);

    long countByPost_IdAndStatus(Long postId, CommentStatus status);

    @Query("SELECT c.post.id, COUNT(c) FROM Comment c WHERE c.post.id IN :postIds AND c.status = :status GROUP BY c.post.id")
    List<Object[]> countGroupedByPostId(
            @Param("postIds") Collection<Long> postIds,
            @Param("status") CommentStatus status);
}
