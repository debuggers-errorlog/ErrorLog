package com.errorlog.backend.domain.subscription.controller;

import com.errorlog.backend.domain.subscription.dto.SubscriptionListResponse;
import com.errorlog.backend.domain.subscription.dto.SubscriptionRequest;
import com.errorlog.backend.domain.subscription.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    // 구독 하기
    @PostMapping
    public ResponseEntity<Void> subscribe(@RequestBody SubscriptionRequest request) {
        subscriptionService.subscribe(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 구독 유효 여부 확인
    @GetMapping("/status")
    public ResponseEntity<Boolean> isActiveSubscription(
            @RequestParam Long subscriberId,
            @RequestParam Long creatorId) {
        boolean isActive = subscriptionService.isActiveSubscription(subscriberId, creatorId);
        return ResponseEntity.ok(isActive);
    }

    // 구독 목록 조회
    @GetMapping("/list")
    public ResponseEntity<SubscriptionListResponse> getSubscriptionList(
            @RequestParam Long userId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionList(userId));
    }
}
