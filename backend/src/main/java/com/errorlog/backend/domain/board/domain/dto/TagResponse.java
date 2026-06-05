package com.errorlog.backend.domain.board.domain.dto;

import com.errorlog.backend.domain.board.domain.entity.Tag;

public record TagResponse(Long id, String name) {

	public static TagResponse from(Tag tag) {
		return new TagResponse(tag.getId(), tag.getName());
	}
}
