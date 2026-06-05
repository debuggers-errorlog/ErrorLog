package com.errorlog.backend.board.repository;

import org.springframework.data.jpa.domain.Specification;

import com.errorlog.backend.board.domain.entity.Post;
import com.errorlog.backend.board.domain.entity.Tag;
import com.errorlog.backend.board.domain.enums.PostStatus;
import com.errorlog.backend.board.domain.enums.PostVisibility;
import com.errorlog.backend.board.domain.enums.TroubleshootingCategory;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;

public final class PostSpecification {

	private PostSpecification() {
	}

	@SafeVarargs
	public static Specification<Post> combine(Specification<Post>... specs) {
		Specification<Post> combined = null;
		for (Specification<Post> spec : specs) {
			if (spec == null) {
				continue;
			}
			combined = combined == null ? spec : combined.and(spec);
		}
		return combined != null ? combined : unconstrained();
	}

	private static Specification<Post> unconstrained() {
		return (root, query, cb) -> cb.conjunction();
	}

	public static Specification<Post> activeOnly() {
		return (root, query, cb) -> cb.equal(root.get("status"), PostStatus.ACTIVE);
	}

	public static Specification<Post> byAuthor(Long authorId) {
		if (authorId == null) {
			return null;
		}
		return (root, query, cb) -> cb.equal(root.get("userId"), authorId);
	}

	public static Specification<Post> byTagName(String tagName) {
		if (tagName == null || tagName.isBlank()) {
			return null;
		}
		String normalized = Tag.normalize(tagName);
		return (root, query, cb) -> {
			Join<Post, Tag> tags = root.join("tags", JoinType.INNER);
			query.distinct(true);
			return cb.equal(tags.get("name"), normalized);
		};
	}

	public static Specification<Post> byCategory(TroubleshootingCategory category) {
		if (category == null) {
			return null;
		}
		return (root, query, cb) -> cb.equal(root.get("metaCategory"), category.name());
	}

	public static Specification<Post> byFramework(String framework) {
		if (framework == null || framework.isBlank()) {
			return null;
		}
		return (root, query, cb) -> cb.equal(root.get("metaFramework"), framework);
	}

	public static Specification<Post> publicOnly() {
		return (root, query, cb) -> cb.equal(root.get("visibility"), PostVisibility.PUBLIC);
	}

	public static Specification<Post> withTags() {
		return (root, query, cb) -> {
			if (query != null && !Long.class.equals(query.getResultType())) {
				root.fetch("tags", JoinType.LEFT);
				query.distinct(true);
			}
			return cb.conjunction();
		};
	}
}
