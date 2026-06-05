package com.errorlog.backend.domain.board.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.errorlog.backend.domain.board.domain.dto.PostSummaryResponse;
import com.errorlog.backend.domain.board.domain.entity.Post;
import com.errorlog.backend.domain.board.domain.entity.Tag;
import com.errorlog.backend.domain.board.domain.enums.SearchScope;
import com.errorlog.backend.domain.board.domain.enums.TroubleshootingCategory;
import com.errorlog.backend.domain.board.repository.PostRepository;
import com.errorlog.backend.domain.board.repository.PostSearchRepository;
import com.errorlog.backend.domain.board.repository.PostSpecification;
import com.errorlog.backend.global.dto.PageResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SearchService {

	private final PostRepository postRepository;
	private final PostSearchRepository postSearchRepository;
	private final PostAccessService postAccessService;

	public PageResponse<PostSummaryResponse> search(
			String keyword,
			SearchScope scope,
			TroubleshootingCategory category,
			String framework,
			String tag,
			Long viewerId,
			Pageable pageable) {
		Page<Post> page;

		if (keyword == null || keyword.isBlank()) {
			Specification<Post> spec = PostSpecification.combine(
					PostSpecification.activeOnly(),
					PostSpecification.withTags(),
					PostSpecification.byTagName(tag),
					PostSpecification.byCategory(category),
					PostSpecification.byFramework(framework));
			page = postRepository.findAll(spec, pageable);
		} else {
			String normalizedTag = tag != null && !tag.isBlank() ? Tag.normalize(tag) : null;
			String categoryValue = category != null ? category.name() : null;
			SearchScope effectiveScope = scope != null ? scope : SearchScope.ALL;

			page = switch (effectiveScope) {
				case CONTENT -> postSearchRepository.searchByKeyword(
						keyword, categoryValue, framework, normalizedTag, pageable);
				case ERROR_MESSAGE -> postSearchRepository.searchByErrorMessage(keyword, categoryValue, pageable);
				case ALL -> postSearchRepository.searchByKeyword(
						keyword, categoryValue, framework, normalizedTag, pageable);
			};
		}

		return PageResponse.from(page.map(post -> PostSummaryResponse.from(post, postAccessService.isLocked(post, viewerId))));
	}
}
