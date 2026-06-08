package com.errorlog.backend.domain.board.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.errorlog.backend.domain.board.domain.dto.PostCreateRequest;
import com.errorlog.backend.domain.board.domain.dto.PostResponse;
import com.errorlog.backend.domain.board.domain.dto.PostStatsResponse;
import com.errorlog.backend.domain.board.domain.dto.PostSummaryResponse;
import com.errorlog.backend.domain.board.domain.dto.PostUpdateRequest;
import com.errorlog.backend.domain.board.domain.entity.Post;
import com.errorlog.backend.domain.board.domain.entity.Tag;
import com.errorlog.backend.domain.board.domain.enums.PostStatus;
import com.errorlog.backend.domain.board.domain.enums.TroubleshootingCategory;
import com.errorlog.backend.domain.board.domain.vo.TroubleshootingMeta;
import com.errorlog.backend.domain.board.repository.PostRepository;
import com.errorlog.backend.domain.board.repository.PostSpecification;
import com.errorlog.backend.global.dto.PageResponse;
import com.errorlog.backend.global.exception.AppException;
import com.errorlog.backend.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

	private final PostRepository postRepository;
	private final TagService tagService;
	private final PostAccessService postAccessService;
	private final PostImageService postImageService;
	private final PostEnrichmentService postEnrichmentService;

	@Transactional(readOnly = true)
	public PageResponse<PostSummaryResponse> listPosts(
			Long authorId,
			String tag,
			TroubleshootingCategory category,
			String framework,
			Long viewerId,
			Pageable pageable) {
		Specification<Post> spec = PostSpecification.combine(
				PostSpecification.activeOnly(),
				PostSpecification.withTags(),
				PostSpecification.byAuthor(authorId),
				PostSpecification.byTagName(tag),
				PostSpecification.byCategory(category),
				PostSpecification.byFramework(framework));

		Page<Post> postPage = postRepository.findAll(spec, pageable);
		var summaries = postEnrichmentService.toSummaries(postPage.getContent(), viewerId, postAccessService);
		return PageResponse.from(new PageImpl<>(summaries, pageable, postPage.getTotalElements()));
	}

	@Transactional(readOnly = true)
	public PostStatsResponse getStats() {
		PostStatus active = PostStatus.ACTIVE;
		long totalPosts = postRepository.countByStatus(active);

		ZoneId zone = ZoneId.of("Asia/Seoul");
		LocalDateTime weekStart = LocalDate.now(zone)
				.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
				.atStartOfDay();
		long newPostsThisWeek = postRepository.countActiveSince(active, weekStart);

		Map<String, Long> categoryCounts = new LinkedHashMap<>();
		for (TroubleshootingCategory category : TroubleshootingCategory.values()) {
			categoryCounts.put(category.name(), 0L);
		}

		for (Object[] row : postRepository.countGroupByCategory(active)) {
			String categoryKey = row[0] != null ? row[0].toString() : TroubleshootingCategory.OTHER.name();
			long count = (Long) row[1];
			categoryCounts.merge(categoryKey, count, Long::sum);
		}

		return new PostStatsResponse(totalPosts, newPostsThisWeek, categoryCounts);
	}

	public PostResponse getPost(Long postId, Long viewerId) {
		Post post = findActivePost(postId);
		boolean locked = postAccessService.isLocked(post, viewerId);

		if (!locked) {
			postRepository.incrementViewCount(postId);
		}

		return postEnrichmentService.toDetail(post, locked, postImageService.listPostImages(postId, viewerId));
	}

	public PostResponse createPost(Long authorId, PostCreateRequest request) {
		validateMeta(request.troubleshootingMeta());

		Set<Tag> tags = tagService.resolveTags(request.tags());
		Post post = Post.create(
				authorId,
				request.title(),
				request.content(),
				request.troubleshootingMeta(),
				request.visibility(),
				tags);

		Post saved = postRepository.save(post);
		return postEnrichmentService.toDetail(saved, false, List.of());
	}

	public PostResponse updatePost(Long postId, Long actorId, PostUpdateRequest request) {
		Post post = findActivePost(postId);
		assertOwner(post, actorId);
		validateMeta(request.troubleshootingMeta());

		Set<Tag> tags = tagService.resolveTags(request.tags());
		post.update(
				request.title(),
				request.content(),
				request.troubleshootingMeta(),
				request.visibility(),
				tags);

		return postEnrichmentService.toDetail(post, false, postImageService.listPostImages(postId, actorId));
	}

	public void deletePost(Long postId, Long actorId) {
		Post post = findActivePost(postId);
		assertOwner(post, actorId);
		post.markDeleted();
	}

	private Post findActivePost(Long postId) {
		return postRepository.findByIdAndStatus(postId, PostStatus.ACTIVE)
				.orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
	}

	private void assertOwner(Post post, Long actorId) {
		if (actorId == null || !post.isOwnedBy(actorId)) {
			throw new AppException(ErrorCode.FORBIDDEN);
		}
	}

	private void validateMeta(TroubleshootingMeta meta) {
		if (meta == null || meta.category() == null) {
			throw new AppException(ErrorCode.INVALID_REQUEST);
		}

		boolean hasErrorMessage = meta.error() != null
				&& meta.error().message() != null
				&& !meta.error().message().isBlank();
		boolean hasSymptom = meta.symptom() != null && !meta.symptom().isBlank();

		if (!hasErrorMessage && !hasSymptom) {
			throw new AppException(ErrorCode.INVALID_REQUEST);
		}
	}
}
