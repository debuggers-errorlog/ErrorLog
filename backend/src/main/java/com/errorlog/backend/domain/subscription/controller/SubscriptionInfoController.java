package com.errorlog.backend.domain.subscription.controller;

import com.errorlog.backend.domain.subscription.dto.SubscriptionInfoResponse;
import com.errorlog.backend.domain.subscription.service.SubscriptionInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionInfoController {
    private final SubscriptionInfoService subscriptionInfoService;

    // 구독 결제 정보 화면
    @GetMapping("/{creatorId}/info")
    public ResponseEntity<SubscriptionInfoResponse> getSubscriptionInfo(
            @PathVariable Long creatorId) {
        return ResponseEntity.ok(subscriptionInfoService.getSubscriptionInfo(creatorId));
    }
}
