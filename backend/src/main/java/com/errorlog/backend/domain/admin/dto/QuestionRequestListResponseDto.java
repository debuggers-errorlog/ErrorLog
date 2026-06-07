package com.errorlog.backend.domain.admin.dto;

import com.errorlog.backend.domain.question.entity.QuestionRequest;
import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Getter
public class QuestionRequestListResponseDto {
    private final Long id;
    private final String menteeNickname;   // requester
    private final String mentorNickname;   // receiver
    private final String title;
    private final QuestionRequest.Status status;
    private final LocalDateTime createdAt;

    @QueryProjection
    public QuestionRequestListResponseDto(Long id, String menteeNickname, String mentorNickname,
                                          String title, QuestionRequest.Status status,
                                          LocalDateTime createdAt) {
        this.id = id;
        this.menteeNickname = menteeNickname;
        this.mentorNickname = mentorNickname;
        this.title = title;
        this.status = status;
        this.createdAt = createdAt;
    }

    // 대기 경과일 — SQL이 아니라 Java에서 계산 (JSON엔 daysElapsed로 나감)
    public long getDaysElapsed() {
        return ChronoUnit.DAYS.between(createdAt.toLocalDate(), LocalDate.now());
    }
}