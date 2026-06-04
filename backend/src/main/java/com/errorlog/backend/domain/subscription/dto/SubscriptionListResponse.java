package com.errorlog.backend.domain.subscription.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class SubscriptionListResponse {
    // 구독 관리 목록
    private int followingCount;
    private List<FollowingResponse> following;
    private int followerCount;
    private List<FollowerResponse> followers;
}
