package com.errorlog.backend.domain.payment.repository;

import com.errorlog.backend.domain.payment.enums.PaymentStatus;
import com.errorlog.backend.domain.payment.enums.PaymentType;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

import static com.errorlog.backend.domain.payment.Entity.QPayment.payment;

@Repository
@RequiredArgsConstructor
public class PaymentQueryRepository {
    private final JPAQueryFactory queryFactory;

    // 전체 조회탭( paymentType == null )
    private BooleanExpression paymentTypeEq(PaymentType paymentType) {
        return paymentType == null ? null : payment.paymentType.eq(paymentType);
    }

    // 총 수익 조회
    public Long getTotalRevenue(Long creatorId, PaymentType paymentType) {
        Long result = queryFactory
                .select(payment.price.sumLong().longValue())
                .from(payment)
                .where(
                        payment.targetId.eq(creatorId),
                        paymentTypeEq(paymentType),
                        payment.status.eq(PaymentStatus.PAID)
                )
                .fetchOne();
        return result == null ? 0L : result;
    }

    // 이번 달 수익 조회
    public Long getThisMonthRevenue(Long creatorId, PaymentType paymentType) {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        Long result = queryFactory
                .select(payment.price.longValue().sumLong())
                .from(payment)
                .where(
                        payment.targetId.eq(creatorId),
                        paymentTypeEq(paymentType),
                        payment.status.eq(PaymentStatus.PAID),
                        payment.createdAt.goe(startOfMonth)
                )
                .fetchOne();
        return result == null ? 0L : result;
    }


    // 총 건수 조회
    public Long getTotalCount(Long creatorId, PaymentType paymentType) {
        return queryFactory
                .select(payment.count())
                .from(payment)
                .where(
                        payment.targetId.eq(creatorId),
                        paymentTypeEq(paymentType),
                        payment.status.eq(PaymentStatus.PAID)
                )
                .fetchOne();
    }
}
