package com.errorlog.backend.domain.subscription.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class SubscriptionInfoResponse {
    // 결제 정보 화면 
    private String creatorName;
    private Long price;
    private String description;
    private Long premiumPostCount;
    private List<PostSummary> recentPremiumPosts;
}
