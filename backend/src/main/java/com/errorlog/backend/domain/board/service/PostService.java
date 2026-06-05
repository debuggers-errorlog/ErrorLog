package com.errorlog.backend.domain.board.service;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.errorlog.backend.domain.board.domain.dto.PostCreateRequest;
import com.errorlog.backend.domain.board.domain.dto.PostResponse;
import com.errorlog.backend.domain.board.domain.dto.PostSummaryResponse;
import com.errorlog.backend.domain.board.domain.dto.PostUpdateRequest;
import com.errorlog.backend.domain.board.domain.entity.Post;
import com.errorlog.backend.domain.board.domain.entity.Tag;
import com.errorlog.backend.domain.board.domain.enums.PostStatus;
import com.errorlog.backend.domain.board.domain.enums.TroubleshootingCategory;
import com.errorlog.backend.domain.board.domain.vo.TroubleshootingMeta;
import com.errorlog.backend.domain.board.repository.PostRepository;
import com.errorlog.backend.domain.board.repository.PostSpecification;
import com.errorlog.backend.common.dto.PageResponse;
import com.errorlog.backend.common.exception.ApiException;
import com.errorlog.backend.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

	private final PostRepository postRepository;
	private final TagService tagService;
	private final PostAccessService postAccessService;
	private final PostImageService postImageService;

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

		Page<PostSummaryResponse> page = postRepository.findAll(spec, pageable)
				.map(post -> PostSummaryResponse.from(post, postAccessService.isLocked(post, viewerId)));

		return PageResponse.from(page);
	}

	public PostResponse getPost(Long postId, Long viewerId) {
		Post post = findActivePost(postId);
		boolean locked = postAccessService.isLocked(post, viewerId);

		if (!locked) {
			postRepository.incrementViewCount(postId);
		}

		return PostResponse.from(post, locked, postImageService.listPostImages(postId, viewerId));
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
		return PostResponse.from(saved, false, List.of());
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

		return PostResponse.from(post, false, postImageService.listPostImages(postId, actorId));
	}

	public void deletePost(Long postId, Long actorId) {
		Post post = findActivePost(postId);
		assertOwner(post, actorId);
		post.markDeleted();
	}

	private Post findActivePost(Long postId) {
		return postRepository.findByIdAndStatus(postId, PostStatus.ACTIVE)
				.orElseThrow(() -> new ApiException(ErrorCode.POST_NOT_FOUND));
	}

	private void assertOwner(Post post, Long actorId) {
		if (actorId == null || !post.isOwnedBy(actorId)) {
			throw new ApiException(ErrorCode.FORBIDDEN);
		}
	}

	private void validateMeta(TroubleshootingMeta meta) {
		if (meta == null || meta.category() == null) {
			throw new ApiException(ErrorCode.INVALID_REQUEST);
		}

		boolean hasErrorMessage = meta.error() != null
				&& meta.error().message() != null
				&& !meta.error().message().isBlank();
		boolean hasSymptom = meta.symptom() != null && !meta.symptom().isBlank();

		if (!hasErrorMessage && !hasSymptom) {
			throw new ApiException(ErrorCode.INVALID_REQUEST);
		}
	}
}
