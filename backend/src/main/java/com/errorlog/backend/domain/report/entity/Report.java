package com.errorlog.backend.domain.report.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long reporterId;

    @Column(name = "reported_user_id")
    private Long reportedUserId;

    @Column(name = "reported_post_id")
    private Long reportedPostId;

    @Column(name = "reported_comment_id")
    private Long reportedCommentId;
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportReasonCategory reasonCategory;

    @Column(length = 1000)
    private String reasonDetail; // 상세 사유 (선택)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status;

    @CreationTimestamp // BaseTimeEntity가 생기면 그걸 extends 하고 이 필드 삭제.
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime processedAt;

    private Report(Long reporterId, ReportReasonCategory reasonCategory, String reasonDetail) {
        this.reporterId = reporterId;
        this.reasonCategory = reasonCategory;
        this.reasonDetail = reasonDetail;
        this.status = ReportStatus.PENDING;
    }

    public static Report reportUser(Long reporterId, Long targetUserId,
                                    ReportReasonCategory category, String detail) {
        Report report = new Report(reporterId, category, detail);
        report.reportedUserId = targetUserId;
        return report;
    }

    public static Report reportPost(Long reporterId, Long targetPostId,
                                    ReportReasonCategory category, String detail) {
        Report report = new Report(reporterId, category, detail);
        report.reportedPostId = targetPostId;
        return report;
    }

    public static Report reportComment(Long reporterId, Long targetCommentId,
                                       ReportReasonCategory category, String detail) {
        Report report = new Report(reporterId, category, detail);
        report.reportedCommentId = targetCommentId;
        return report;
    }

    // --- 관리자 처리 액션
    public void process() {
        this.status = ReportStatus.RESOLVED;
        this.processedAt = LocalDateTime.now();
    }

    public void reject() {
        this.status = ReportStatus.REJECTED;
        this.processedAt = LocalDateTime.now();
    }

    @Transient
    public ReportTargetType getTargetType() {
        if (reportedUserId != null) return ReportTargetType.USER;
        if (reportedPostId != null) return ReportTargetType.POST;
        if (reportedCommentId != null) return ReportTargetType.COMMENT;
        return null;
    }
}