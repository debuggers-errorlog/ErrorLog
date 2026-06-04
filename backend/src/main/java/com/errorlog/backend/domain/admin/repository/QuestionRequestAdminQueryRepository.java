package com.errorlog.backend.domain.admin.repository;

import com.errorlog.backend.domain.admin.dto.QQuestionRequestListResponseDto;
import com.errorlog.backend.domain.admin.dto.QuestionRequestListResponseDto;
import com.errorlog.backend.domain.admin.dto.QuestionRequestSearchConditionDto;
import com.errorlog.backend.domain.question.entity.QuestionRequest;
import com.errorlog.backend.domain.user.entity.QUser;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import static com.errorlog.backend.domain.question.entity.QQuestionRequest.questionRequest;

@Repository
public class QuestionRequestAdminQueryRepository {

    private final JPAQueryFactory queryFactory;

    public QuestionRequestAdminQueryRepository(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    // 같은 users를 두 번 조인하니 별칭(alias) 두 개를 만든다
    private static final QUser mentee = new QUser("mentee");   // requester
    private static final QUser mentor = new QUser("mentor");   // receiver

    public Page<QuestionRequestListResponseDto> search(QuestionRequestSearchConditionDto cond, Pageable pageable) {

        List<QuestionRequestListResponseDto> content = queryFactory
                .select(new QQuestionRequestListResponseDto(
                        questionRequest.id,
                        mentee.nickname,
                        mentor.nickname,
                        questionRequest.title,
                        questionRequest.status,
                        questionRequest.createdAt
                ))
                .from(questionRequest)
                .leftJoin(mentee).on(mentee.id.eq(questionRequest.requesterId))
                .leftJoin(mentor).on(mentor.id.eq(questionRequest.receiverId))
                .where(
                        statusEq(cond.getStatus()),
                        mentorNicknameContains(cond.getMentorNickname()),
                        createdGoe(cond.getCreatedFrom()),
                        createdLoe(cond.getCreatedTo())
                )
                .orderBy(questionRequest.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(questionRequest.count())
                .from(questionRequest)
                .leftJoin(mentor).on(mentor.id.eq(questionRequest.receiverId))  // 멘토 닉 필터용 조인 유지
                .where(
                        statusEq(cond.getStatus()),
                        mentorNicknameContains(cond.getMentorNickname()),
                        createdGoe(cond.getCreatedFrom()),
                        createdLoe(cond.getCreatedTo())
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }

    private BooleanExpression statusEq(QuestionRequest.Status status) {
        return status == null ? null : questionRequest.status.eq(status);
    }

    private BooleanExpression mentorNicknameContains(String nickname) {
        return (nickname == null || nickname.isBlank()) ? null : mentor.nickname.contains(nickname);
    }

    private BooleanExpression createdGoe(LocalDate from) {
        return from == null ? null : questionRequest.createdAt.goe(from.atStartOfDay());
    }

    private BooleanExpression createdLoe(LocalDate to) {
        return to == null ? null : questionRequest.createdAt.lt(to.plusDays(1).atStartOfDay());
    }
}