package com.errorlog.backend.domain.subscription.service;

import com.errorlog.backend.domain.subscription.Entity.SubscriptionSettings;
import com.errorlog.backend.domain.subscription.dto.SubscriptionSettingsRequest;
import com.errorlog.backend.domain.subscription.dto.SubscriptionSettingsResponse;
import com.errorlog.backend.domain.subscription.repository.SubscriptionSettingsRepository;
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
                .orElseThrow(() -> new IllegalArgumentException("구독 플랜이 존재하지 않습니다."));
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
            throw new IllegalArgumentException("이미 구독 플랜이 존재합니다.");
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
                .orElseThrow(() -> new IllegalArgumentException("구독 플랜이 존재하지 않습니다."));
        settings.update(request.getPrice(), request.getDescription());
        subscriptionSettingsRepository.save(settings);
    }
}
