package com.errorlog.backend.domain.board.service;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.errorlog.backend.domain.board.domain.dto.ImageResponse;
import com.errorlog.backend.domain.board.domain.dto.PostResponse;
import com.errorlog.backend.domain.board.domain.dto.PostSummaryResponse;
import com.errorlog.backend.domain.board.domain.entity.Post;
import com.errorlog.backend.domain.comment.entity.CommentStatus;
import com.errorlog.backend.domain.comment.repository.CommentRepository;
import com.errorlog.backend.domain.like.repository.LikeRepository;
import com.errorlog.backend.domain.user.entity.User;
import com.errorlog.backend.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostEnrichmentService {

	private final UserRepository userRepository;
	private final LikeRepository likeRepository;
	private final CommentRepository commentRepository;

	public List<PostSummaryResponse> toSummaries(
			List<Post> posts,
			Long viewerId,
			PostAccessService postAccessService) {
		if (posts.isEmpty()) {
			return List.of();
		}

		Set<Long> userIds = posts.stream().map(Post::getUserId).collect(Collectors.toSet());
		List<Long> postIds = posts.stream().map(Post::getId).toList();
		Map<Long, String> nicknames = findNicknames(userIds);
		Map<Long, Integer> likeCounts = findLikeCounts(postIds);
		Map<Long, Integer> commentCounts = findCommentCounts(postIds);

		return posts.stream()
				.map(post -> PostSummaryResponse.from(
						post,
						postAccessService.isLocked(post, viewerId),
						nicknames.getOrDefault(post.getUserId(), "Unknown"),
						likeCounts.getOrDefault(post.getId(), 0),
						commentCounts.getOrDefault(post.getId(), 0)))
				.toList();
	}

	public PostResponse toDetail(Post post, boolean locked, List<ImageResponse> images) {
		String nickname = userRepository.findById(post.getUserId())
				.map(User::getNickname)
				.orElse("Unknown");
		int likeCount = (int) likeRepository.countByPost_Id(post.getId());
		int commentCount = (int) commentRepository.countByPost_IdAndStatus(post.getId(), CommentStatus.ACTIVE);
		return PostResponse.from(post, locked, images, nickname, likeCount, commentCount);
	}

	private Map<Long, String> findNicknames(Collection<Long> userIds) {
		if (userIds.isEmpty()) {
			return Map.of();
		}
		return userRepository.findAllById(userIds).stream()
				.collect(Collectors.toMap(User::getId, User::getNickname));
	}

	private Map<Long, Integer> findLikeCounts(Collection<Long> postIds) {
		if (postIds.isEmpty()) {
			return Map.of();
		}
		return toCountMap(likeRepository.countGroupedByPostId(postIds));
	}

	private Map<Long, Integer> findCommentCounts(Collection<Long> postIds) {
		if (postIds.isEmpty()) {
			return Map.of();
		}
		return toCountMap(commentRepository.countGroupedByPostId(postIds, CommentStatus.ACTIVE));
	}

	private Map<Long, Integer> toCountMap(List<Object[]> rows) {
		Map<Long, Integer> map = new HashMap<>();
		for (Object[] row : rows) {
			map.put((Long) row[0], ((Number) row[1]).intValue());
		}
		return map;
	}
}
