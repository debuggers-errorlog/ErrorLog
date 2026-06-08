package com.errorlog.backend.domain.board.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.errorlog.backend.domain.board.domain.entity.Post;

public interface PostSearchRepository extends JpaRepository<Post, Long> {

	@Query(
			value = """
					SELECT DISTINCT p.*
					FROM posts p
					LEFT JOIN post_tags pt ON p.id = pt.post_id
					LEFT JOIN tags t ON pt.tag_id = t.id
					WHERE p.status = 'ACTIVE'
					  AND (
					    MATCH(p.title, p.content) AGAINST (:keyword IN NATURAL LANGUAGE MODE)
					    OR t.name LIKE CONCAT('%', :tagKeyword, '%')
					  )
					  AND (:category IS NULL OR p.meta_category = :category)
					  AND (:framework IS NULL OR p.meta_framework = :framework)
					  AND (:tag IS NULL OR t.name LIKE CONCAT('%', :tag, '%'))
					ORDER BY p.created_at DESC
					""",
			countQuery = """
					SELECT COUNT(DISTINCT p.id)
					FROM posts p
					LEFT JOIN post_tags pt ON p.id = pt.post_id
					LEFT JOIN tags t ON pt.tag_id = t.id
					WHERE p.status = 'ACTIVE'
					  AND (
					    MATCH(p.title, p.content) AGAINST (:keyword IN NATURAL LANGUAGE MODE)
					    OR t.name LIKE CONCAT('%', :tagKeyword, '%')
					  )
					  AND (:category IS NULL OR p.meta_category = :category)
					  AND (:framework IS NULL OR p.meta_framework = :framework)
					  AND (:tag IS NULL OR t.name LIKE CONCAT('%', :tag, '%'))
					""",
			nativeQuery = true)
	Page<Post> searchByKeyword(
			@Param("keyword") String keyword,
			@Param("tagKeyword") String tagKeyword,
			@Param("category") String category,
			@Param("framework") String framework,
			@Param("tag") String tag,
			Pageable pageable);

	@Query(
			value = """
					SELECT DISTINCT p.*
					FROM posts p
					WHERE p.status = 'ACTIVE'
					  AND MATCH(p.meta_error_message) AGAINST (:keyword IN NATURAL LANGUAGE MODE)
					  AND (:category IS NULL OR p.meta_category = :category)
					ORDER BY p.created_at DESC
					""",
			countQuery = """
					SELECT COUNT(DISTINCT p.id)
					FROM posts p
					WHERE p.status = 'ACTIVE'
					  AND MATCH(p.meta_error_message) AGAINST (:keyword IN NATURAL LANGUAGE MODE)
					  AND (:category IS NULL OR p.meta_category = :category)
					""",
			nativeQuery = true)
	Page<Post> searchByErrorMessage(
			@Param("keyword") String keyword,
			@Param("category") String category,
			Pageable pageable);
}
