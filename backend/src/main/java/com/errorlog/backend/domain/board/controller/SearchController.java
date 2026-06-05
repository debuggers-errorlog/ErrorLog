package com.errorlog.backend.domain.board.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.errorlog.backend.domain.board.domain.dto.PostSummaryResponse;
import com.errorlog.backend.domain.board.domain.enums.SearchScope;
import com.errorlog.backend.domain.board.domain.enums.TroubleshootingCategory;
import com.errorlog.backend.domain.board.service.SearchService;
import com.errorlog.backend.common.dto.PageResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

	private final SearchService searchService;

	@GetMapping
	public PageResponse<PostSummaryResponse> search(
			@RequestParam(required = false) String q,
			@RequestParam(required = false) SearchScope scope,
			@RequestParam(required = false) TroubleshootingCategory category,
			@RequestParam(required = false) String framework,
			@RequestParam(required = false) String tag,
			@RequestHeader(value = "X-User-Id", required = false) Long viewerId,
			@PageableDefault(size = 20) Pageable pageable) {
		return searchService.search(q, scope, category, framework, tag, viewerId, pageable);
	}
}
