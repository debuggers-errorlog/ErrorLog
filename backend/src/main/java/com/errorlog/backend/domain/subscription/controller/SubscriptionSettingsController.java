package com.errorlog.backend.domain.subscription.controller;

import com.errorlog.backend.domain.subscription.dto.SubscriptionSettingsRequest;
import com.errorlog.backend.domain.subscription.dto.SubscriptionSettingsResponse;
import com.errorlog.backend.domain.subscription.service.SubscriptionSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscription-settings")
@RequiredArgsConstructor
public class SubscriptionSettingsController {
    private final SubscriptionSettingsService subscriptionSettingsService;

    // GET /api/subscription-settings/{creatorId}
    // 플랜 조회
    @GetMapping("/{creatorId}")
    public ResponseEntity<SubscriptionSettingsResponse> getSettings(
            @PathVariable Long creatorId) {
        return ResponseEntity.ok(subscriptionSettingsService.getSettings(creatorId));
    }

    // POST /api/subscription-settings
    // 플랜 등록
    @PostMapping
    public ResponseEntity<Void> createSettings(
            @RequestBody SubscriptionSettingsRequest request) {
        subscriptionSettingsService.createSettings(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // PUT /api/subscription-settings/{creatorId}
    // 플랜 수정
    @PutMapping("/{creatorId}")
    public ResponseEntity<Void> updateSettings(
            @PathVariable Long creatorId,
            @RequestBody SubscriptionSettingsRequest request) {
        subscriptionSettingsService.updateSettings(creatorId, request);
        return ResponseEntity.ok().build();
    }
}
