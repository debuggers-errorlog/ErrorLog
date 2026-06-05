package com.errorlog.backend.domain.subscription.repository;

import com.errorlog.backend.domain.subscription.Entity.Post;
import com.errorlog.backend.domain.subscription.Entity.Status;
import com.errorlog.backend.domain.subscription.Entity.Visibility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// 구독 정보 페이지에서 프리미엄 글 목록 조회시 사용
public interface PostRepository extends JpaRepository<Post,Long> {
    // 크리에이터의 유료글 개수
    long countByUserIdAndVisibilityAndStatus(Long userId, Visibility visibility, Status status);

    // 크리에이터의 최근 유료글 목록
    List<Post> findTop5ByUserIdAndVisibilityAndStatusOrderByCreatedAtDesc(Long userId, Visibility visibility, Status status);
}
