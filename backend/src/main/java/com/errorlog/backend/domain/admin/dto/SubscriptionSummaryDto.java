package com.errorlog.backend.domain.admin.dto;

public record SubscriptionSummaryDto(
        long activeSubscribers,
        long expiredSubscriptions,
        long estimatedRevenue
) {}