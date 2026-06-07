package com.errorlog.backend.domain.admin.dto;

import com.errorlog.backend.domain.user.entity.User;
import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MemberListResponseDto {

    private final Long id;
    private final String nickname;
    private final String email;
    private final User.Role role;
    private final User.Status status;
    private final LocalDateTime createdAt;

    @QueryProjection
    public MemberListResponseDto(Long id, String nickname, String email,
                                 User.Role role, User.Status status, LocalDateTime createdAt) {
        this.id = id;
        this.nickname = nickname;
        this.email = email;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
    }
}