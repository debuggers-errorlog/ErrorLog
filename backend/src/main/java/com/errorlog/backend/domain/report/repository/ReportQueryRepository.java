package com.errorlog.backend.domain.report.repository;

import com.errorlog.backend.domain.report.entity.ReportReasonCategory;
import com.errorlog.backend.domain.report.entity.ReportStatus;
import com.errorlog.backend.domain.report.dto.QReportListResponseDto;
import com.errorlog.backend.domain.report.dto.ReportListResponseDto;
import com.errorlog.backend.domain.report.dto.ReportSearchConditionDto;
import com.errorlog.backend.domain.report.entity.ReportTargetType;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import static com.errorlog.backend.domain.report.entity.QReport.report;

@Repository
@RequiredArgsConstructor
public class ReportQueryRepository {

    private final JPAQueryFactory queryFactory;

    public Page<ReportListResponseDto> search(ReportSearchConditionDto cond, Pageable pageable) {

        // 1) 콘텐츠 쿼리: 실제 데이터 한 페이지
        List<ReportListResponseDto> content = queryFactory
                .select(new QReportListResponseDto(
                        report.id,
                        report.reporterId,
                        // reporterNickname: users 조인 전이라 일단 null. 조인 살리면 user.nickname 으로 교체.
                        Expressions.nullExpression(String.class),
                        targetTypeExpression(),   // USER/POST/COMMENT 파생
                        targetIdExpression(),      // 채워진 대상 id
                        Expressions.nullExpression(String.class), // targetSummary: 조인 후 채움
                        report.reasonCategory,
                        report.reasonDetail,
                        report.status,
                        report.createdAt
                ))
                .from(report)
                // .leftJoin(user).on(user.id.eq(report.reporterId))               // reporterNickname 채우려면
                // .leftJoin(post).on(post.id.eq(report.reportedPostId))           // 게시글 제목 채우려면
                .where(
                        statusEq(cond.getStatus()),
                        targetTypeEq(cond.getTargetType()),
                        reasonCategoryEq(cond.getReasonCategory()),
                        createdGoe(cond.getCreatedFrom()),
                        createdLoe(cond.getCreatedTo())
                )
                .orderBy(report.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // 2) 카운트 쿼리: 전체 건수(페이지 계산용). 같은 where를 재사용한다.
        Long total = queryFactory
                .select(report.count())
                .from(report)
                .where(
                        statusEq(cond.getStatus()),
                        targetTypeEq(cond.getTargetType()),
                        reasonCategoryEq(cond.getReasonCategory()),
                        createdGoe(cond.getCreatedFrom()),
                        createdLoe(cond.getCreatedTo())
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }

    // ===== 동적 조건들 =====
    // 핵심 패턴: 값이 null이면 null을 반환한다. QueryDSL의 where()는 인자가 null이면
    // 그 조건을 "없는 셈" 친다. 그래서 사용자가 안 고른 필터는 자동으로 WHERE에서 빠진다.

    private BooleanExpression statusEq(ReportStatus status) {
        return status == null ? null : report.status.eq(status);
    }

    private BooleanExpression reasonCategoryEq(ReportReasonCategory category) {
        return category == null ? null : report.reasonCategory.eq(category);
    }

    // 대상 타입 필터: USER면 reported_user_id IS NOT NULL 인 행만, 식으로 변환
    private BooleanExpression targetTypeEq(ReportTargetType type) {
        if (type == null) return null;
        return switch (type) {
            case USER -> report.reportedUserId.isNotNull();
            case POST -> report.reportedPostId.isNotNull();
            case COMMENT -> report.reportedCommentId.isNotNull();
        };
    }

    // 기간: from은 그 날 00:00 이상, to는 '그 날 포함'이라 다음날 0시 미만으로 처리
    private BooleanExpression createdGoe(LocalDate from) {
        return from == null ? null : report.createdAt.goe(from.atStartOfDay());
    }

    private BooleanExpression createdLoe(LocalDate to) {
        return to == null ? null : report.createdAt.lt(to.plusDays(1).atStartOfDay());
    }

    // ===== select 안에서 대상 타입/ID를 파생시키는 표현식 =====
    // 옵션 A: 세 컬럼 중 채워진 것을 골라 하나의 값으로 만든다 (SQL CASE WHEN 으로 변환됨)

    private com.querydsl.core.types.Expression<ReportTargetType> targetTypeExpression() {
        return new com.querydsl.core.types.dsl.CaseBuilder()
                .when(report.reportedUserId.isNotNull()).then(ReportTargetType.USER)
                .when(report.reportedPostId.isNotNull()).then(ReportTargetType.POST)
                .otherwise(ReportTargetType.COMMENT);
    }

    private com.querydsl.core.types.Expression<Long> targetIdExpression() {
        return new com.querydsl.core.types.dsl.CaseBuilder()
                .when(report.reportedUserId.isNotNull()).then(report.reportedUserId)
                .when(report.reportedPostId.isNotNull()).then(report.reportedPostId)
                .otherwise(report.reportedCommentId);
    }
}
