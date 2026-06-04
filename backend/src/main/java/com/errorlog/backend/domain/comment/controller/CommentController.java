package com.errorlog.backend.domain.comment.controller;

import com.errorlog.backend.domain.comment.dto.CommentCreateRequest;
import com.errorlog.backend.domain.comment.dto.CommentResponse;
import com.errorlog.backend.domain.comment.dto.CommentUpdateRequest;
import com.errorlog.backend.domain.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // 작성 (본문 JSON으로 받음)
    @PostMapping
    public ResponseEntity<Long> create(
            @RequestBody CommentCreateRequest request,
            @RequestParam Long userId) {     // 임시
        Long id = commentService.create(userId, request.postId(), request.parentId(), request.content());
        return ResponseEntity.ok(id);
    }

    // 게시글의 댓글 목록
    @GetMapping
    public ResponseEntity<List<CommentResponse>> list(@RequestParam Long postId) {
        return ResponseEntity.ok(commentService.getComments(postId));
    }

    // 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<Void> update(
            @PathVariable Long commentId,
            @RequestBody CommentUpdateRequest request,
            @RequestParam Long userId) {
        commentService.update(userId, commentId, request.content());
        return ResponseEntity.ok().build();
    }

    // 삭제 (소프트)
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long commentId,
            @RequestParam Long userId) {
        commentService.delete(userId, commentId);
        return ResponseEntity.ok().build();
    }
}