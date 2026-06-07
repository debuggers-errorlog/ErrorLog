package com.errorlog.backend.domain.subscription.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SubscriptionSettingsResponse {
    private Long userId;
    private Long price;
    private String description;
}
