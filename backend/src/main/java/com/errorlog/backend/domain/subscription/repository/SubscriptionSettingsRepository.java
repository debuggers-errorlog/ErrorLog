package com.errorlog.backend.domain.subscription.repository;

import com.errorlog.backend.domain.subscription.Entity.SubscriptionSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubscriptionSettingsRepository extends JpaRepository<SubscriptionSettings, Long> {
    Optional<SubscriptionSettings> findByUserId(Long userId);
}
