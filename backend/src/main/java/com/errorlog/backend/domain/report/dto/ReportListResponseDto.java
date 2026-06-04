package com.errorlog.backend.domain.report.dto;

import com.errorlog.backend.domain.report.entity.ReportReasonCategory;
import com.errorlog.backend.domain.report.entity.ReportStatus;
import com.errorlog.backend.domain.report.entity.ReportTargetType;
import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ReportListResponseDto {

    private final Long reportId;

    private final Long reporterId;
    private final String reporterNickname; // users 조인해서 채움

    private final ReportTargetType targetType; // 어떤 대상인지
    private final Long targetId;               // 대상의 실제 id (user/post/comment 중 채워진 값)
    private final String targetSummary;        // 대상 요약(닉네임 또는 글 제목 등). 조인해서 채움

    private final ReportReasonCategory reasonCategory;
    private final String reasonDetail; // NULL 허용 — 상세 없이 신고했을 수 있음

    private final ReportStatus status;
    private final LocalDateTime createdAt;

    @QueryProjection
    public ReportListResponseDto(Long reportId, Long reporterId, String reporterNickname,
                                 ReportTargetType targetType, Long targetId, String targetSummary,
                                 ReportReasonCategory reasonCategory, String reasonDetail,
                                 ReportStatus status, LocalDateTime createdAt) {
        this.reportId = reportId;
        this.reporterId = reporterId;
        this.reporterNickname = reporterNickname;
        this.targetType = targetType;
        this.targetId = targetId;
        this.targetSummary = targetSummary;
        this.reasonCategory = reasonCategory;
        this.reasonDetail = reasonDetail;
        this.status = status;
        this.createdAt = createdAt;
    }
}