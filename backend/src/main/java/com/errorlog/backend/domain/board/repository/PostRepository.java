package com.errorlog.backend.domain.board.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.errorlog.backend.domain.board.domain.entity.Post;
import com.errorlog.backend.domain.board.domain.enums.PostStatus;

public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {

	@EntityGraph(attributePaths = {"tags"})
	Optional<Post> findByIdAndStatus(Long id, PostStatus status);

	@Modifying(clearAutomatically = true)
	@Query("update Post p set p.viewCount = p.viewCount + 1 where p.id = :id")
	void incrementViewCount(@Param("id") Long id);

	@EntityGraph(attributePaths = {"tags"})
	Page<Post> findByUserIdAndStatus(Long userId, PostStatus status, Pageable pageable);
}
