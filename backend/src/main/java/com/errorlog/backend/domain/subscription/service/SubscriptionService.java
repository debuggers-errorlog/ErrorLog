package com.errorlog.backend.domain.subscription.service;

import com.errorlog.backend.domain.payment.enums.PaymentStatus;
import com.errorlog.backend.domain.payment.enums.PaymentType;
import com.errorlog.backend.domain.payment.service.PaymentService;
import com.errorlog.backend.domain.subscription.Entity.Subscription;
import com.errorlog.backend.domain.subscription.Entity.SubscriptionSettings;
import com.errorlog.backend.domain.subscription.dto.FollowerResponse;
import com.errorlog.backend.domain.subscription.dto.FollowingResponse;
import com.errorlog.backend.domain.subscription.dto.SubscriptionListResponse;
import com.errorlog.backend.domain.subscription.dto.SubscriptionRequest;
import com.errorlog.backend.domain.subscription.repository.SubscriptionQueryRepository;
import com.errorlog.backend.domain.subscription.repository.SubscriptionRepository;
import com.errorlog.backend.domain.subscription.repository.SubscriptionSettingsRepository;
import com.errorlog.backend.domain.user.entity.User;
import com.errorlog.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionQueryRepository subscriptionQueryRepository;
    private final SubscriptionSettingsRepository subscriptionSettingsRepository;
    private final PaymentService paymentService;
    private final UserRepository userRepository;

    @Transactional
    public void subscribe(SubscriptionRequest request,Long subscriberId) {

        // 1. 크리에이터 플랜에서 price 조회
        SubscriptionSettings settings = subscriptionSettingsRepository
                .findByUserId(request.getCreatorId())
                .orElseThrow(() -> new IllegalArgumentException("구독 플랜이 존재하지 않습니다."));

        // 2. 결제 기록 저장 (PaymentService 호출)
        paymentService.record(
                subscriberId,
                request.getCreatorId(),
                PaymentType.SUBSCRIPTION,
                settings.getPrice(),
                PaymentStatus.PAID
        );

        // 3. 구독 신규 or 재구독 처리
        subscriptionRepository
                .findBySubscriberIdAndCreatorId(subscriberId, request.getCreatorId())
                .ifPresentOrElse(
                        subscription -> {
                            subscription.renew();
                            subscriptionRepository.save((subscription));
                        },
                         () -> subscriptionRepository.save(
                                Subscription.builder()
                                        .subscriberId(subscriberId)
                                        .creatorId(request.getCreatorId())
                                        .expiredAt(LocalDateTime.now().plusMonths(1))
                                        .build()
                        )
                );
    }

    // 구독 목록 전체 조회
    public SubscriptionListResponse getSubscriptionList(Long userId) {

        // 내가 구독중인 목록
        List<FollowingResponse> following = subscriptionRepository
                .findBySubscriberId(userId)
                .stream()
                .map(sub -> {
                    String creatorName = userRepository.findById(sub.getCreatorId())
                            .map(User::getNickname)
                            .orElse("알 수 없음");
                    return new FollowingResponse(sub.getCreatorId(), creatorName, sub.getExpiredAt());
                })
                .collect(Collectors.toList());

        // 나를 구독하는 목록
        List<FollowerResponse> followers = subscriptionRepository
                .findByCreatorId(userId)
                .stream()
                .map(sub -> {
                    String subscriberName = userRepository.findById(sub.getSubscriberId())
                            .map(User::getNickname)
                            .orElse("알 수 없음");
                    return new FollowerResponse(sub.getSubscriberId(), subscriberName, sub.getCreatedAt());
                })
                .collect(Collectors.toList());

        return new SubscriptionListResponse(
                following.size(),
                following,
                followers.size(),
                followers
        );
    }

    public boolean isActiveSubscription(Long subscriberId, Long creatorId) {
        return subscriptionQueryRepository.isActiveSubscription(subscriberId, creatorId);
    }
}
