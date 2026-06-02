package com.errorlog.backend.domain.report.repository;

import com.errorlog.backend.domain.report.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
    boolean existsByReporterIdAndReportedUserId(Long reporterId, Long reportedUserId);

    boolean existsByReporterIdAndReportedPostId(Long reporterId, Long reportedPostId);

    boolean existsByReporterIdAndReportedCommentId(Long reporterId, Long reportedCommentId);
}