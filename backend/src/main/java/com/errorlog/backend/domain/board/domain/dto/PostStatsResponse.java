package com.errorlog.backend.domain.board.domain.dto;

import java.util.Map;

public record PostStatsResponse(
		long totalPosts,
		long newPostsThisWeek,
		Map<String, Long> categoryCounts) {
}
