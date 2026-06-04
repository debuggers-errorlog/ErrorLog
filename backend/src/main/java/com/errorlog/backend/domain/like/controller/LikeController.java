package com.errorlog.backend.domain.like.controller;

import com.errorlog.backend.domain.like.dto.LikeResponse;
import com.errorlog.backend.domain.like.repository.LikeRepository;
import com.errorlog.backend.domain.like.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;
    private final LikeRepository likeRepository;

    // 좋아요 토글
    @PostMapping("/{postId}")
    public ResponseEntity<LikeResponse> toggle(
            @PathVariable Long postId,
            @RequestParam Long userId) {     // 임시 (인증 붙으면 교체)
        boolean liked = likeService.toggleLike(userId, postId);
        long count = likeRepository.countByPost_Id(postId);
        return ResponseEntity.ok(new LikeResponse(liked, count));
    }

    // 좋아요 상태 + 개수 조회
    @GetMapping("/{postId}/status")
    public ResponseEntity<LikeResponse> status(
            @PathVariable Long postId,
            @RequestParam Long userId) {
        return ResponseEntity.ok(likeService.getStatus(userId, postId));
    }
}