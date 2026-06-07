package com.errorlog.backend.domain.admin.repository;

import com.errorlog.backend.domain.admin.dto.SubscriptionListResponseDto;
import com.errorlog.backend.domain.subscription.Entity.QSubscription;
import com.errorlog.backend.domain.subscription.Entity.QSubscriptionSettings;
import com.errorlog.backend.domain.user.entity.QUser;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class AdminSubscriptionQueryRepository {

    private final JPAQueryFactory queryFactory;

    public AdminSubscriptionQueryRepository(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    // users 테이블을 구독자/작성자 두 번 join → 별칭 두 개
    private static final QSubscription subscription = QSubscription.subscription;
    private static final QSubscriptionSettings settings = QSubscriptionSettings.subscriptionSettings;
    private static final QUser subscriber = new QUser("subscriber");
    private static final QUser creator = new QUser("creator");

    public Page<SubscriptionListResponseDto> search(String searchTerm, String status, Pageable pageable) {

        List<SubscriptionListResponseDto> content = queryFactory
                .select(Projections.constructor(SubscriptionListResponseDto.class,
                        subscription.id,
                        subscriber.nickname,
                        creator.nickname,
                        subscription.createdAt,
                        settings.price,
                        subscription.expiredAt))
                .from(subscription)
                .leftJoin(subscriber).on(subscriber.id.eq(subscription.subscriberId))
                .leftJoin(creator).on(creator.id.eq(subscription.creatorId))
                .leftJoin(settings).on(settings.userId.eq(subscription.creatorId))
                .where(nameContains(searchTerm), statusEq(status))
                .orderBy(subscription.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(subscription.count())
                .from(subscription)
                .leftJoin(subscriber).on(subscriber.id.eq(subscription.subscriberId))
                .leftJoin(creator).on(creator.id.eq(subscription.creatorId))
                .where(nameContains(searchTerm), statusEq(status))
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }

    // 검색어 → 구독자 또는 작성자 닉네임 포함 (null이면 where에서 자동 무시)
    private BooleanExpression nameContains(String term) {
        if (term == null || term.isBlank()) return null;
        return subscriber.nickname.containsIgnoreCase(term)
                .or(creator.nickname.containsIgnoreCase(term));
    }

    // 상태 필터: ACTIVE = 만료 안 됨 / EXPIRED = 만료됨 / 그 외 = 전체
    private BooleanExpression statusEq(String status) {
        if (status == null || status.isBlank()) return null;
        LocalDateTime now = LocalDateTime.now();
        return switch (status) {
            case "ACTIVE" -> subscription.expiredAt.gt(now);
            case "EXPIRED" -> subscription.expiredAt.loe(now);
            default -> null;
        };
    }
}
