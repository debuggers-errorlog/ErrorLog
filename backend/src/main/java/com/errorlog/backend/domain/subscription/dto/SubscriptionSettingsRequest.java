package com.errorlog.backend.domain.subscription.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SubscriptionSettingsRequest {
    private Long userId;
    private Long price;
    private String description;
}
