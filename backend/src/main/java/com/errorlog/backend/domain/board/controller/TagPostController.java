package com.errorlog.backend.domain.board.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.errorlog.backend.domain.board.domain.dto.PostSummaryResponse;
import com.errorlog.backend.domain.board.service.PostService;
import com.errorlog.backend.global.dto.PageResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tags/{tagName}/posts")
@RequiredArgsConstructor
public class TagPostController {

	private final PostService postService;

	@GetMapping
	public PageResponse<PostSummaryResponse> listPostsByTag(
			@PathVariable String tagName,
			@RequestHeader(value = "X-User-Id", required = false) Long viewerId,
			@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
		return postService.listPosts(null, tagName, null, null, viewerId, pageable);
	}
}
