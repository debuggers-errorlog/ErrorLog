package com.errorlog.backend.domain.subscription.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "subscription_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long price;

    @Column(columnDefinition = "TEXT")
    private String description;

    public void update(Long price, String description) {
        this.price = price;
        this.description = description;
    }
}