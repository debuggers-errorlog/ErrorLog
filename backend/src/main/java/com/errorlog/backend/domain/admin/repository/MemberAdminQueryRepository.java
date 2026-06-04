package com.errorlog.backend.domain.admin.repository;

import com.errorlog.backend.domain.admin.dto.MemberListResponseDto;
import com.errorlog.backend.domain.admin.dto.MemberSearchConditionDto;
import com.errorlog.backend.domain.admin.dto.QMemberListResponseDto;
import com.errorlog.backend.domain.user.entity.User;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import static com.errorlog.backend.domain.user.entity.QUser.user;

@Repository
public class MemberAdminQueryRepository {

    private final JPAQueryFactory queryFactory;

    public MemberAdminQueryRepository(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    public Page<MemberListResponseDto> search(MemberSearchConditionDto cond, Pageable pageable) {

        // 1) 콘텐츠 쿼리
        List<MemberListResponseDto> content = queryFactory
                .select(new QMemberListResponseDto(
                        user.id,
                        user.nickname,
                        user.email,
                        user.role,
                        user.status,
                        user.createdAt
                ))
                .from(user)
                .where(
                        notDeleted(),
                        roleIsUser(),
                        nicknameContains(cond.getNickname()),
                        emailContains(cond.getEmail()),
                        roleEq(cond.getRole()),
                        statusEq(cond.getStatus()),
                        createdGoe(cond.getCreatedFrom()),
                        createdLoe(cond.getCreatedTo())
                )
                .orderBy(user.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // 2) 카운트 쿼리: 전체 건수(페이지 계산용)
        Long total = queryFactory
                .select(user.count())
                .from(user)
                .where(
                        notDeleted(),
                        roleIsUser(),
                        nicknameContains(cond.getNickname()),
                        emailContains(cond.getEmail()),
                        roleEq(cond.getRole()),
                        statusEq(cond.getStatus()),
                        createdGoe(cond.getCreatedFrom()),
                        createdLoe(cond.getCreatedTo())
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }

    private BooleanExpression notDeleted() {
        return user.deletedAt.isNull();
    }

    private BooleanExpression nicknameContains(String nickname) {
        return (nickname == null || nickname.isBlank()) ? null : user.nickname.contains(nickname);
    }

    private BooleanExpression emailContains(String email) {
        return (email == null || email.isBlank()) ? null : user.email.contains(email);
    }

    private BooleanExpression roleEq(User.Role role) {
        return role == null ? null : user.role.eq(role);
    }

    private BooleanExpression roleIsUser() {
        return user.role.eq(User.Role.USER);   // 항상 적용: 관리자는 회원관리 대상 아님
    }

    private BooleanExpression statusEq(User.Status status) {
        return status == null ? null : user.status.eq(status);
    }

    private BooleanExpression createdGoe(LocalDate from) {
        return from == null ? null : user.createdAt.goe(from.atStartOfDay());
    }

    private BooleanExpression createdLoe(LocalDate to) {
        return to == null ? null : user.createdAt.lt(to.plusDays(1).atStartOfDay());
    }
}
