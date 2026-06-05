package com.errorlog.backend.domain.subscription.repository;

import com.errorlog.backend.domain.subscription.Entity.QSubscription;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
@RequiredArgsConstructor

public class SubscriptionQueryRepository {

    private  final JPAQueryFactory queryFactory;

    public boolean isActiveSubscription(Long subscriberId,Long creatorId){
        QSubscription s = QSubscription.subscription;

        return queryFactory
                .selectOne()
                .from(s)
                .where(
                        s.subscriberId.eq(subscriberId),
                        s.creatorId.eq(creatorId),
                        s.expiredAt.after(LocalDateTime.now())
                )
                .fetchFirst() != null;
    }
}
