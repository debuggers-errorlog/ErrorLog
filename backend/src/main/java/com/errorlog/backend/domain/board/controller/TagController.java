package com.errorlog.backend.domain.board.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.errorlog.backend.domain.board.domain.dto.TagResponse;
import com.errorlog.backend.domain.board.service.TagService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

	private final TagService tagService;

	@GetMapping
	public List<TagResponse> listPopularTags(@RequestParam(defaultValue = "20") int limit) {
		return tagService.listPopular(limit);
	}

	@GetMapping("/suggest")
	public List<TagResponse> suggestTags(
			@RequestParam String prefix,
			@RequestParam(defaultValue = "10") int limit) {
		return tagService.suggest(prefix, limit);
	}
}
