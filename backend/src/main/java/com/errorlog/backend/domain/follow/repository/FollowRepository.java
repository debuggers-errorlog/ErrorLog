package com.errorlog.backend.domain.follow.repository;

import com.errorlog.backend.domain.follow.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    boolean existsByFollower_IdAndFollowing_Id(Long followerId, Long followingId);

    void deleteByFollower_IdAndFollowing_Id(Long followerId, Long followingId);

    long countByFollowing_Id(Long userId);
    long countByFollower_Id(Long userId);

    @EntityGraph(attributePaths = {"following"})
    List<Follow> findByFollower_Id(Long followerId);
}