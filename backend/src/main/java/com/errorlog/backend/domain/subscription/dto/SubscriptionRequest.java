package com.errorlog.backend.domain.subscription.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SubscriptionRequest {
    private Long subscriberId;
    private Long creatorId;
}
