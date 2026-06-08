package com.errorlog.backend.domain.board.domain.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.errorlog.backend.domain.board.domain.entity.Post;
import com.errorlog.backend.domain.board.domain.entity.Tag;
import com.errorlog.backend.domain.board.domain.enums.PostVisibility;
import com.errorlog.backend.domain.board.domain.vo.TroubleshootingMeta;

public record PostResponse(
		Long id,
		Long authorId,
		String authorNickname,
		String title,
		String content,
		TroubleshootingMeta troubleshootingMeta,
		PostVisibility visibility,
		boolean locked,
		int viewCount,
		int likeCount,
		int commentCount,
		List<String> tags,
		List<ImageResponse> images,
		LocalDateTime createdAt,
		LocalDateTime updatedAt) {

	public static PostResponse from(
			Post post,
			boolean locked,
			List<ImageResponse> images,
			String authorNickname,
			int likeCount,
			int commentCount) {
		return new PostResponse(
				post.getId(),
				post.getUserId(),
				authorNickname,
				post.getTitle(),
				locked ? null : post.getContent(),
				locked ? maskMeta(post.getTroubleshootingMeta()) : post.getTroubleshootingMeta(),
				post.getVisibility(),
				locked,
				post.getViewCount(),
				likeCount,
				commentCount,
				post.getTags().stream().map(Tag::getName).sorted().toList(),
				locked ? List.of() : images,
				post.getCreatedAt(),
				post.getUpdatedAt());
	}

	public static PostResponse from(Post post, boolean locked, List<ImageResponse> images) {
		return from(post, locked, images, "Unknown", 0, 0);
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
