package com.errorlog.backend.domain.subscription.repository;

import com.errorlog.backend.domain.subscription.Entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription,Long> {
    Optional<Subscription> findBySubscriberIdAndCreatorId(Long subscriberId, Long creatorId);

    // 구독 목록 관리
    List<Subscription> findBySubscriberId(Long subscriberId);
    List<Subscription> findByCreatorId(Long creatorId);
}
