package com.errorlog.backend.domain.subscription.controller;

import com.errorlog.backend.domain.subscription.dto.SubscriptionSettingsRequest;
import com.errorlog.backend.domain.subscription.dto.SubscriptionSettingsResponse;
import com.errorlog.backend.domain.subscription.service.SubscriptionSettingsService;
import com.errorlog.backend.global.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscription-settings")
@RequiredArgsConstructor
public class SubscriptionSettingsController {
    private final SubscriptionSettingsService subscriptionSettingsService;

    // GET /api/subscription-settings/me
    @GetMapping("/me")
    public ResponseEntity<SubscriptionSettingsResponse> getMySettings() {
        Long userId = SecurityUtils.requireUserId();
        return ResponseEntity.ok(subscriptionSettingsService.getSettings(userId));
    }

    // GET /api/subscription-settings/{creatorId}
    @GetMapping("/{creatorId}")
    public ResponseEntity<SubscriptionSettingsResponse> getSettings(@PathVariable Long creatorId) {
        return ResponseEntity.ok(subscriptionSettingsService.getSettings(creatorId));
    }

    // POST /api/subscription-settings/me — 내 플랜 저장 (없으면 생성, 있으면 수정)
    @PostMapping("/me")
    public ResponseEntity<Void> saveMySettings(@RequestBody SubscriptionSettingsRequest request) {
        Long userId = SecurityUtils.requireUserId();
        subscriptionSettingsService.saveSettings(userId, request);
        return ResponseEntity.ok().build();
    }

    // POST /api/subscription-settings — 하위 호환 (동일하게 upsert)
    @PostMapping
    public ResponseEntity<Void> createSettings(@RequestBody SubscriptionSettingsRequest request) {
        Long userId = SecurityUtils.requireUserId();
        subscriptionSettingsService.saveSettings(userId, request);
        return ResponseEntity.ok().build();
    }
}
