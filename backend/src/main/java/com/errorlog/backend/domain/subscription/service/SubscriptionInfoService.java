package com.errorlog.backend.domain.subscription.service;

import com.errorlog.backend.domain.subscription.Entity.Status;
import com.errorlog.backend.domain.subscription.Entity.SubscriptionSettings;
import com.errorlog.backend.domain.subscription.Entity.Visibility;
import com.errorlog.backend.domain.subscription.dto.PostSummary;
import com.errorlog.backend.domain.subscription.dto.SubscriptionInfoResponse;
import com.errorlog.backend.domain.subscription.repository.PostRepository;
import com.errorlog.backend.domain.subscription.repository.SubscriptionSettingsRepository;
import com.errorlog.backend.domain.subscription.Entity.User;
import com.errorlog.backend.domain.subscription.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionInfoService {
    private final SubscriptionSettingsRepository subscriptionSettingsRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public SubscriptionInfoResponse getSubscriptionInfo(Long creatorId) {

        // 1. 구독 설정 조회
        SubscriptionSettings settings = subscriptionSettingsRepository
                .findByUserId(creatorId)
                .orElseThrow(() -> new IllegalArgumentException("구독 플랜이 존재하지 않습니다."));
        // 2. 크리에이터 이름 조회
        String creatorName = userRepository.findById(creatorId)
                .map(User::getNickname)
                .orElse("알 수 없음");

        // 3. 유료글 개수 조회
        long premiumPostCount = postRepository.countByUserIdAndVisibilityAndStatus(
                creatorId, Visibility.SUBSCRIBERS, Status.ACTIVE
        );

        // 4. 최근 유료글 목록 조회
        List<PostSummary> recentPosts = postRepository
                .findTop5ByUserIdAndVisibilityAndStatusOrderByCreatedAtDesc(
                        creatorId, Visibility.SUBSCRIBERS, Status.ACTIVE
                )
                .stream()
                .map(post -> new PostSummary(post.getId(), post.getTitle()))
                .collect(Collectors.toList());

        return new SubscriptionInfoResponse(
                creatorName,
                settings.getPrice(),
                settings.getDescription(),
                premiumPostCount,
                recentPosts
        );
    }
}
