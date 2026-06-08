package com.errorlog.backend.domain.comment.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.errorlog.backend.domain.comment.dto.CommentCreateRequest;
import com.errorlog.backend.domain.comment.dto.CommentResponse;
import com.errorlog.backend.domain.comment.dto.CommentUpdateRequest;
import com.errorlog.backend.domain.comment.service.CommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<Long> create(
            @AuthenticationPrincipal Long userId,
            @RequestBody CommentCreateRequest request) {
        Long id = commentService.create(userId, request.postId(), request.parentId(), request.content());
        return ResponseEntity.ok(id);
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> list(@RequestParam Long postId) {
        return ResponseEntity.ok(commentService.getComments(postId));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Void> update(
            @PathVariable Long commentId,
            @AuthenticationPrincipal Long userId,
            @RequestBody CommentUpdateRequest request) {
        commentService.update(userId, commentId, request.content());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long commentId,
            @AuthenticationPrincipal Long userId) {
        commentService.delete(userId, commentId);
        return ResponseEntity.ok().build();
    }
}
