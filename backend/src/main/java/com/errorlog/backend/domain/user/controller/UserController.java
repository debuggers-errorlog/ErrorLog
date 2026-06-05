package com.errorlog.backend.domain.user.controller;

import com.errorlog.backend.domain.board.domain.dto.PostSummaryResponse;
import com.errorlog.backend.domain.user.dto.UpdateProfileRequest;
import com.errorlog.backend.domain.user.dto.UserProfileResponse;
import com.errorlog.backend.domain.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 내 정보 조회
    // GET /api/users/me
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @AuthenticationPrincipal Long userId
    ) {
        return ResponseEntity.ok(userService.getMyProfile(userId));
    }

    // 내 정보 수정
    // PATCH /api/users/me
    @PatchMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(userService.updateMyProfile(userId, request));
    }

    // 내 게시글 조회
    // GET /api/users/me/posts
    @GetMapping("/me/posts")
    public ResponseEntity<Page<PostSummaryResponse>> getMyPosts(
            @AuthenticationPrincipal Long userId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(userService.getMyPosts(userId, pageable));
    }
}
