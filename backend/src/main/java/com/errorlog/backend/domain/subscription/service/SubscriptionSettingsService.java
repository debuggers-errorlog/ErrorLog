package com.errorlog.backend.domain.subscription.service;

import com.errorlog.backend.domain.subscription.Entity.SubscriptionSettings;
import com.errorlog.backend.domain.subscription.dto.SubscriptionSettingsRequest;
import com.errorlog.backend.domain.subscription.dto.SubscriptionSettingsResponse;
import com.errorlog.backend.domain.subscription.repository.SubscriptionSettingsRepository;
import com.errorlog.backend.global.exception.AppException;
import com.errorlog.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SubscriptionSettingsService {
    private final SubscriptionSettingsRepository subscriptionSettingsRepository;

    // 플랜 조회
    public SubscriptionSettingsResponse getSettings(Long creatorId) {
        SubscriptionSettings settings = subscriptionSettingsRepository
                .findByUserId(creatorId)
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_SETTINGS_NOT_FOUND));
        return new SubscriptionSettingsResponse(
                settings.getUserId(),
                settings.getPrice(),
                settings.getDescription()
        );
    }

    // 플랜 등록
    @Transactional
    public void createSettings(SubscriptionSettingsRequest request, Long userId) {
        if (subscriptionSettingsRepository.findByUserId(userId).isPresent()) {
            throw new AppException(ErrorCode.SUBSCRIPTION_SETTINGS_ALREADY_EXISTS);
        }
        subscriptionSettingsRepository.save(
                SubscriptionSettings.builder()
                        .userId(userId)
                        .price(request.getPrice())
                        .description(request.getDescription())
                        .build()
        );
    }

    // 플랜 수정
    @Transactional
    public void updateSettings(Long creatorId, SubscriptionSettingsRequest request) {
        SubscriptionSettings settings = subscriptionSettingsRepository
                .findByUserId(creatorId)
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_SETTINGS_NOT_FOUND));
        settings.update(request.getPrice(), request.getDescription());
        subscriptionSettingsRepository.save(settings);
    }

    // 플랜 저장 (없으면 생성, 있으면 수정)
    @Transactional
    public void saveSettings(Long userId, SubscriptionSettingsRequest request) {
        SubscriptionSettings settings = subscriptionSettingsRepository
                .findByUserId(userId)
                .orElseGet(() -> SubscriptionSettings.builder()
                        .userId(userId)
                        .build());
        settings.update(request.getPrice(), request.getDescription());
        subscriptionSettingsRepository.save(settings);
    }
}
