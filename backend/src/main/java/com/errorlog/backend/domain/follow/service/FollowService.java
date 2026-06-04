package com.errorlog.backend.follow.service;

import com.errorlog.backend.follow.dto.FollowStatusResponse;
import com.errorlog.backend.follow.entity.Follow;
import com.errorlog.backend.follow.repository.FollowRepository;
import com.errorlog.backend.domain.user.entity.User;
import com.errorlog.backend.domain.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    // 팔로우 토글: 이미 팔로우면 취소, 아니면 팔로우. 반환값 = "지금 팔로우 상태인가?"
    @Transactional
    public boolean toggleFollow(Long followerId, Long followingId) {
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("자기 자신은 팔로우할 수 없습니다.");
        }

        if (followRepository.existsByFollower_IdAndFollowing_Id(followerId, followingId)) {
            followRepository.deleteByFollower_IdAndFollowing_Id(followerId, followingId);
            return false;   // 언팔로우됨
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 없습니다: " + followerId));
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new EntityNotFoundException("대상 사용자가 없습니다: " + followingId));

        followRepository.save(new Follow(follower, following));
        return true;        // 팔로우됨
    }

    // 화면 처음 들어올 때, 버튼 초기 상태와 숫자를 알려주기 위한 조회
    @Transactional(readOnly = true)
    public FollowStatusResponse getStatus(Long viewerId, Long targetId) {
        boolean following = followRepository.existsByFollower_IdAndFollowing_Id(viewerId, targetId);
        long followerCount = followRepository.countByFollowing_Id(targetId);
        long followingCount = followRepository.countByFollower_Id(targetId);
        return new FollowStatusResponse(following, followerCount, followingCount);
    }
}