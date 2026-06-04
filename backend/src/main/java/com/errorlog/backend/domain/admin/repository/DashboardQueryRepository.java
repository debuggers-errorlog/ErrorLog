package com.errorlog.backend.domain.admin.repository;

import com.errorlog.backend.domain.admin.dto.MonthlyRevenueDto;
import com.errorlog.backend.domain.admin.dto.QMonthlyRevenueDto;
import com.errorlog.backend.domain.question.entity.QuestionRequest;
import com.errorlog.backend.domain.user.entity.User;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

import static com.errorlog.backend.domain.question.entity.QQuestionRequest.questionRequest;
import static com.errorlog.backend.domain.subscription.entity.QSubscription.subscription;
import static com.errorlog.backend.domain.subscription.entity.QSubscriptionSettings.subscriptionSettings;
import static com.errorlog.backend.domain.user.entity.QUser.user;

@Repository
public class DashboardQueryRepository {

    private final JPAQueryFactory queryFactory;

    public DashboardQueryRepository(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    // 총 회원수 (탈퇴 제외, 일반 회원만)
    public long countMembers() {
        Long c = queryFactory.select(user.count()).from(user)
                .where(user.deletedAt.isNull(), user.role.eq(User.Role.USER))
                .fetchOne();
        return c == null ? 0 : c;
    }

    // 활성 유료 구독자 수 (expired_at > now)
    public long countActiveSubscribers() {
        Long c = queryFactory.select(subscription.count()).from(subscription)
                .where(subscription.expiredAt.gt(LocalDateTime.now()))
                .fetchOne();
        return c == null ? 0 : c;
    }

    // 추정 매출 = 활성 구독들의 (creator price) 합
    public long estimatedRevenue() {
        Long sum = queryFactory
                .select(Expressions.numberTemplate(Long.class, "sum({0})", subscriptionSettings.price))
                .from(subscription)
                .join(subscriptionSettings).on(subscriptionSettings.userId.eq(subscription.creatorId))
                .where(subscription.expiredAt.gt(LocalDateTime.now()))
                .fetchOne();
        return sum == null ? 0 : sum;
    }

    // 대기 중 1:1 요청 수 (멘토-멘티 건강 지표)
    public long countPendingQuestionRequests() {
        Long c = queryFactory.select(questionRequest.count()).from(questionRequest)
                .where(questionRequest.status.eq(QuestionRequest.Status.PENDING))
                .fetchOne();
        return c == null ? 0 : c;
    }

    // 월별 매출 추이 = 구독 시작월(created_at)로 묶어 price 합
    public List<MonthlyRevenueDto> monthlyRevenue() {
        StringTemplate month = Expressions.stringTemplate("DATE_FORMAT({0}, '%Y-%m')", subscription.createdAt);
        return queryFactory
                .select(new QMonthlyRevenueDto(month,
                        Expressions.numberTemplate(Long.class, "sum({0})", subscriptionSettings.price)))
                .from(subscription)
                .join(subscriptionSettings).on(subscriptionSettings.userId.eq(subscription.creatorId))
                .groupBy(month)
                .orderBy(month.asc())
                .fetch();
    }
}