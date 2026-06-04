package com.errorlog.backend.domain.subscription.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

// TODO: 임시 placeholder.
@Entity
@Table(name = "subscription_settings")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SubscriptionSettings {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;     // 구독 판매자(creator)

    @Column(nullable = false)
    private Long price;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
}