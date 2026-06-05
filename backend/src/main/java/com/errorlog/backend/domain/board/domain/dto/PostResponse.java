package com.errorlog.backend.board.domain.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.errorlog.backend.board.domain.entity.Post;
import com.errorlog.backend.board.domain.entity.Tag;
import com.errorlog.backend.board.domain.enums.PostVisibility;
import com.errorlog.backend.board.domain.vo.TroubleshootingMeta;

public record PostResponse(
		Long id,
		Long authorId,
		String title,
		String content,
		TroubleshootingMeta troubleshootingMeta,
		PostVisibility visibility,
		boolean locked,
		int viewCount,
		List<String> tags,
		List<ImageResponse> images,
		LocalDateTime createdAt,
		LocalDateTime updatedAt) {

	public static PostResponse from(Post post, boolean locked, List<ImageResponse> images) {
		return new PostResponse(
				post.getId(),
				post.getUserId(),
				post.getTitle(),
				locked ? null : post.getContent(),
				locked ? maskMeta(post.getTroubleshootingMeta()) : post.getTroubleshootingMeta(),
				post.getVisibility(),
				locked,
				post.getViewCount(),
				post.getTags().stream().map(Tag::getName).sorted().toList(),
				locked ? List.of() : images,
				post.getCreatedAt(),
				post.getUpdatedAt());
	}

	private static TroubleshootingMeta maskMeta(TroubleshootingMeta meta) {
		if (meta == null) {
			return null;
		}
		return new TroubleshootingMeta(
				meta.category(),
				meta.environment(),
				null,
				meta.symptom(),
				null,
				null);
	}
}
