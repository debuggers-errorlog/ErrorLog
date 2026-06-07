package com.errorlog.backend.domain.board.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.errorlog.backend.domain.board.domain.dto.PostCreateRequest;
import com.errorlog.backend.domain.board.domain.dto.PostResponse;
import com.errorlog.backend.domain.board.domain.dto.PostSummaryResponse;
import com.errorlog.backend.domain.board.domain.dto.PostUpdateRequest;
import com.errorlog.backend.domain.board.domain.enums.TroubleshootingCategory;
import com.errorlog.backend.domain.board.service.PostService;
import com.errorlog.backend.global.dto.PageResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

	private final PostService postService;

	@GetMapping
	public PageResponse<PostSummaryResponse> listPosts(
			@RequestParam(required = false) Long authorId,
			@RequestParam(required = false) String tag,
			@RequestParam(required = false) TroubleshootingCategory category,
			@RequestParam(required = false) String framework,
			@AuthenticationPrincipal Long viewerId,
			@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
		return postService.listPosts(authorId, tag, category, framework, viewerId, pageable);
	}

	@GetMapping("/{postId}")
	public PostResponse getPost(
			@PathVariable Long postId,
			@AuthenticationPrincipal Long viewerId) {
		return postService.getPost(postId, viewerId);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public PostResponse createPost(
			@AuthenticationPrincipal Long authorId,
			@Valid @RequestBody PostCreateRequest request) {
		return postService.createPost(authorId, request);
	}

	@PutMapping("/{postId}")
	public PostResponse updatePost(
			@PathVariable Long postId,
			@AuthenticationPrincipal Long actorId,
			@Valid @RequestBody PostUpdateRequest request) {
		return postService.updatePost(postId, actorId, request);
	}

	@DeleteMapping("/{postId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deletePost(
			@PathVariable Long postId,
			@AuthenticationPrincipal Long actorId) {
		postService.deletePost(postId, actorId);
	}
}
