package com.errorlog.backend.domain.comment.service;

import com.errorlog.backend.domain.comment.dto.CommentResponse;
import com.errorlog.backend.domain.comment.entity.Comment;
import com.errorlog.backend.domain.comment.entity.CommentStatus;
import com.errorlog.backend.domain.comment.repository.CommentRepository;
import com.errorlog.backend.post.entity.Post;
import com.errorlog.backend.post.repository.PostRepository;
import com.errorlog.backend.domain.user.entity.User;
import com.errorlog.backend.domain.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Transactional
    public Long create(Long userId, Long postId, Long parentId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 없습니다."));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글이 없습니다."));
        Comment parent = (parentId == null) ? null
                : commentRepository.findById(parentId)
                .orElseThrow(() -> new EntityNotFoundException("부모 댓글이 없습니다."));

        Comment saved = commentRepository.save(new Comment(post, user, parent, content));
        return saved.getId();
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(Long postId) {
        return commentRepository
                .findByPost_IdAndStatusOrderByCreatedAtAsc(postId, CommentStatus.ACTIVE)
                .stream()
                .map(CommentResponse::from)
                .toList();
    }

    @Transactional
    public void update(Long userId, Long commentId, String content) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글이 없습니다."));
        validateOwner(comment, userId);
        comment.updateContent(content);   // 더티 체킹으로 자동 UPDATE
    }

    @Transactional
    public void delete(Long userId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글이 없습니다."));
        validateOwner(comment, userId);
        comment.softDelete();             // 진짜 삭제 대신 상태만 변경
    }

    private void validateOwner(Comment comment, Long userId) {
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("본인 댓글만 수정/삭제할 수 있습니다.");
        }
    }
}