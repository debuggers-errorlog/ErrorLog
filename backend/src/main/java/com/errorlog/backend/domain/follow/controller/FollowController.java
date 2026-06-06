package com.errorlog.backend.domain.follow.controller;

import com.errorlog.backend.domain.follow.dto.FollowResponse;
import com.errorlog.backend.domain.follow.dto.FollowStatusResponse;
import com.errorlog.backend.domain.follow.dto.FollowingUserResponse;
import com.errorlog.backend.domain.follow.repository.FollowRepository;
import com.errorlog.backend.domain.follow.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;
    private final FollowRepository followRepository;

    // 팔로우 토글
    @PostMapping("/{followingId}")
    public ResponseEntity<FollowResponse> toggle(
            @PathVariable Long followingId,
            @RequestParam Long followerId
    ) {
        boolean nowFollowing = followService.toggleFollow(followerId, followingId);
        long followerCount = followRepository.countByFollowing_Id(followingId);
        return ResponseEntity.ok(new FollowResponse(nowFollowing, followerCount));
    }

    // 팔로우 상태 + 숫자 조회
    @GetMapping("/{targetId}/status")
    public ResponseEntity<FollowStatusResponse> status(
            @PathVariable Long targetId,
            @RequestParam Long viewerId
    ) {
        return ResponseEntity.ok(followService.getStatus(viewerId, targetId));
    }

    // 내가 팔로우하는 목록
    @GetMapping("/following")
    public ResponseEntity<List<FollowingUserResponse>> getMyFollowing(
            @AuthenticationPrincipal Long userId
    ) {
        List<FollowingUserResponse> result = followRepository.findByFollower_Id(userId)
                .stream()
                .map(FollowingUserResponse::from)
                .toList();
        return ResponseEntity.ok(result);
    }
}