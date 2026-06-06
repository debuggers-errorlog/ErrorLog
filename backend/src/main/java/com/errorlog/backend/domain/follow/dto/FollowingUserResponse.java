package com.errorlog.backend.domain.follow.dto;

import com.errorlog.backend.domain.follow.entity.Follow;

import java.time.LocalDateTime;

public record FollowingUserResponse(
        Long userId,
        String nickname,
        String bio,
        String link,
        LocalDateTime followedAt
) {
    public static FollowingUserResponse from(Follow follow) {
        return new FollowingUserResponse(
                follow.getFollowing().getId(),
                follow.getFollowing().getNickname(),
                follow.getFollowing().getBio(),
                follow.getFollowing().getLink(),
                follow.getCreatedAt()
        );
    }
}
