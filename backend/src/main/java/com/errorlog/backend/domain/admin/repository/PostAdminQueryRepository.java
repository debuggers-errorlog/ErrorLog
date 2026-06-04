package com.errorlog.backend.domain.admin.repository;

import com.errorlog.backend.domain.admin.dto.PostListResponseDto;
import com.errorlog.backend.domain.admin.dto.PostSearchConditionDto;
import com.errorlog.backend.domain.admin.dto.QPostListResponseDto;
import com.errorlog.backend.domain.post.entity.Post;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import static com.errorlog.backend.domain.post.entity.QPost.post;
import static com.errorlog.backend.domain.user.entity.QUser.user;

@Repository
public class PostAdminQueryRepository {

    private final JPAQueryFactory queryFactory;

    public PostAdminQueryRepository(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    public Page<PostListResponseDto> search(PostSearchConditionDto cond, Pageable pageable) {

        List<PostListResponseDto> content = queryFactory
                .select(new QPostListResponseDto(
                        post.id,
                        post.title,
                        user.nickname,                        // 작성자 닉네임
                        post.visibility,
                        post.status,
                        post.viewCount,
                        post.createdAt
                ))
                .from(post)
                .leftJoin(user).on(user.id.eq(post.userId))   // posts.user_id ↔ users.id
                .where(
                        notDeleted(),
                        titleContains(cond.getTitle()),
                        statusEq(cond.getStatus()),
                        visibilityEq(cond.getVisibility()),
                        createdGoe(cond.getCreatedFrom()),
                        createdLoe(cond.getCreatedTo())
                )
                .orderBy(post.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(post.count())
                .from(post)                                   // 카운트는 post 컬럼만 보니 조인 불필요
                .where(
                        notDeleted(),
                        titleContains(cond.getTitle()),
                        statusEq(cond.getStatus()),
                        visibilityEq(cond.getVisibility()),
                        createdGoe(cond.getCreatedFrom()),
                        createdLoe(cond.getCreatedTo())
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }

    private BooleanExpression notDeleted() {
        return post.deletedAt.isNull();   // 삭제 글만 제외 (HIDDEN은 보여야 해제 가능)
    }

    private BooleanExpression titleContains(String title) {
        return (title == null || title.isBlank()) ? null : post.title.contains(title);
    }

    private BooleanExpression statusEq(Post.Status status) {
        return status == null ? null : post.status.eq(status);
    }

    private BooleanExpression visibilityEq(Post.Visibility visibility) {
        return visibility == null ? null : post.visibility.eq(visibility);
    }

    private BooleanExpression createdGoe(LocalDate from) {
        return from == null ? null : post.createdAt.goe(from.atStartOfDay());
    }

    private BooleanExpression createdLoe(LocalDate to) {
        return to == null ? null : post.createdAt.lt(to.plusDays(1).atStartOfDay());
    }
}