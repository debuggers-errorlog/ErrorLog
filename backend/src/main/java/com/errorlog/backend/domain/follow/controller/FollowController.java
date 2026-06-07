package com.errorlog.backend.domain.follow.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.errorlog.backend.domain.follow.dto.FollowResponse;
import com.errorlog.backend.domain.follow.dto.FollowStatusResponse;
import com.errorlog.backend.domain.follow.dto.FollowingUserResponse;
import com.errorlog.backend.domain.follow.repository.FollowRepository;
import com.errorlog.backend.domain.follow.service.FollowService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;
    private final FollowRepository followRepository;

    @PostMapping("/{followingId}")
    public ResponseEntity<FollowResponse> toggle(
            @PathVariable Long followingId,
            @AuthenticationPrincipal Long followerId) {
        boolean nowFollowing = followService.toggleFollow(followerId, followingId);
        long followerCount = followRepository.countByFollowing_Id(followingId);
        return ResponseEntity.ok(new FollowResponse(nowFollowing, followerCount));
    }

    @GetMapping("/{targetId}/status")
    public ResponseEntity<FollowStatusResponse> status(
            @PathVariable Long targetId,
            @AuthenticationPrincipal Long viewerId) {
        return ResponseEntity.ok(followService.getStatus(viewerId, targetId));
    }

    @GetMapping("/following")
    public ResponseEntity<List<FollowingUserResponse>> getMyFollowing(
            @AuthenticationPrincipal Long userId) {
        List<FollowingUserResponse> result = followRepository.findByFollower_Id(userId)
                .stream()
                .map(FollowingUserResponse::from)
                .toList();
        return ResponseEntity.ok(result);
    }
}
