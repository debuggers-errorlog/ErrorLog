package com.errorlog.backend.domain.board.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.errorlog.backend.domain.board.domain.enums.PostVisibility;
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


	// 구독 결제전 정보 화면에서 유료글 목록 보여줄 때 사용합니다.
	// 크리에이터의 유료글 개수
	long countByUserIdAndVisibilityAndStatus(Long userId, PostVisibility visibility, PostStatus status);

	// 크리에이터의 최근 유료글 목록
	List<Post> findTop5ByUserIdAndVisibilityAndStatusOrderByCreatedAtDesc(Long userId, PostVisibility visibility, PostStatus status);

	long countByStatus(PostStatus status);

	@Query("""
			SELECT p.metaCategory, COUNT(p)
			FROM Post p
			WHERE p.status = :status
			GROUP BY p.metaCategory
			""")
	List<Object[]> countGroupByCategory(@Param("status") PostStatus status);

	@Query("""
			SELECT COUNT(p)
			FROM Post p
			WHERE p.status = :status
			AND p.createdAt >= :since
			""")
	long countActiveSince(@Param("status") PostStatus status, @Param("since") LocalDateTime since);

}
