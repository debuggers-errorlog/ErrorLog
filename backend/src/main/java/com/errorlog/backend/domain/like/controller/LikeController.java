package com.errorlog.backend.domain.like.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.errorlog.backend.domain.like.dto.LikeResponse;
import com.errorlog.backend.domain.like.repository.LikeRepository;
import com.errorlog.backend.domain.like.service.LikeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;
    private final LikeRepository likeRepository;

    @PostMapping("/{postId}")
    public ResponseEntity<LikeResponse> toggle(
            @PathVariable Long postId,
            @AuthenticationPrincipal Long userId) {
        boolean liked = likeService.toggleLike(userId, postId);
        long count = likeRepository.countByPost_Id(postId);
        return ResponseEntity.ok(new LikeResponse(liked, count));
    }

    @GetMapping("/{postId}/status")
    public ResponseEntity<LikeResponse> status(
            @PathVariable Long postId,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(likeService.getStatus(userId, postId));
    }
}
