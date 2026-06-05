package com.errorlog.backend.board.domain.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.errorlog.backend.board.domain.entity.Post;
import com.errorlog.backend.board.domain.entity.Tag;
import com.errorlog.backend.board.domain.enums.PostVisibility;
import com.errorlog.backend.board.domain.enums.TroubleshootingCategory;

public record PostSummaryResponse(
		Long id,
		Long authorId,
		String title,
		String excerpt,
		PostVisibility visibility,
		boolean locked,
		TroubleshootingCategory category,
		String errorType,
		List<String> tags,
		int viewCount,
		LocalDateTime createdAt) {

	public static PostSummaryResponse from(Post post, boolean locked) {
		String excerpt = locked
				? resolveLockedExcerpt(post)
				: truncate(post.getContent(), 160);

		TroubleshootingCategory category = post.getTroubleshootingMeta() != null
				? post.getTroubleshootingMeta().category()
				: null;

		return new PostSummaryResponse(
				post.getId(),
				post.getUserId(),
				post.getTitle(),
				excerpt,
				post.getVisibility(),
				locked,
				category,
				post.getMetaErrorType(),
				post.getTags().stream().map(Tag::getName).sorted().toList(),
				post.getViewCount(),
				post.getCreatedAt());
	}

	private static String resolveLockedExcerpt(Post post) {
		if (post.getTroubleshootingMeta() != null && post.getTroubleshootingMeta().symptom() != null) {
			return truncate(post.getTroubleshootingMeta().symptom(), 160);
		}
		return "구독자 전용 게시글입니다.";
	}

	private static String truncate(String value, int max) {
		if (value == null || value.isBlank()) {
			return "";
		}
		return value.length() <= max ? value : value.substring(0, max) + "...";
	}
}
