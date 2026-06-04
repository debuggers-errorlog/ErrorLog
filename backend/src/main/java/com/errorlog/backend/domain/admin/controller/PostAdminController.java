package com.errorlog.backend.domain.admin.controller;

import com.errorlog.backend.domain.admin.dto.PostListResponseDto;
import com.errorlog.backend.domain.admin.dto.PostSearchConditionDto;
import com.errorlog.backend.domain.admin.service.PostAdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/posts")
public class PostAdminController {

    private final PostAdminService postAdminService;

    public PostAdminController(PostAdminService postAdminService) {
        this.postAdminService = postAdminService;
    }

    @GetMapping
    public Page<PostListResponseDto> search(
            @ModelAttribute PostSearchConditionDto condition,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return postAdminService.searchPosts(condition, pageable);
    }

    @PatchMapping("/{postId}/hide")
    public ResponseEntity<Void> hide(@PathVariable Long postId) {
        postAdminService.hidePost(postId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{postId}/show")
    public ResponseEntity<Void> show(@PathVariable Long postId) {
        postAdminService.showPost(postId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> delete(@PathVariable Long postId) {
        postAdminService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }
}