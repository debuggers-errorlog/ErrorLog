package com.errorlog.backend.follow.dto;

public record FollowStatusResponse(
        boolean following,    // 내가 이 사람을 팔로우 중인가?
        long followerCount,   // 해당 유저의 팔로워 수
        long followingCount   // 해당 유저가 팔로잉하는 수
) {}