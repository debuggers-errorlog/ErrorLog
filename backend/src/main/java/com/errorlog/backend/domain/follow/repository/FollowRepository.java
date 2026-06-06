package com.errorlog.backend.domain.follow.repository;

import com.errorlog.backend.domain.follow.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    boolean existsByFollower_IdAndFollowing_Id(Long followerId, Long followingId);

    void deleteByFollower_IdAndFollowing_Id(Long followerId, Long followingId);

    long countByFollowing_Id(Long userId);  // 해당 유저의 팔로워 수
    long countByFollower_Id(Long userId);    // 해당 유저가 팔로잉하는 수
}