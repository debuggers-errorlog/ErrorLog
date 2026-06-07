package com.errorlog.backend.domain.admin.dto;

import java.time.LocalDateTime;

public record SubscriptionListResponseDto(
        Long id,
        String subscriberNickname,
        String creatorNickname,
        LocalDateTime startedAt,
        Long price,
        LocalDateTime expiredAt
) {}
