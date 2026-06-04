package com.errorlog.backend.domain.post.repository;

import com.errorlog.backend.domain.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

// TODO: 임시. posts 도메인 담당자 레포로 교체/병합 예정.
public interface PostRepository extends JpaRepository<Post, Long> {
}