package com.errorlog.backend.domain.report.service;

import com.errorlog.backend.domain.report.dto.ReportCreateRequestDto;
import com.errorlog.backend.domain.report.dto.ReportListResponseDto;
import com.errorlog.backend.domain.report.dto.ReportSearchConditionDto;
import com.errorlog.backend.domain.report.entity.Report;
import com.errorlog.backend.domain.report.repository.ReportQueryRepository;
import com.errorlog.backend.domain.report.repository.ReportRepository;
import com.errorlog.backend.global.exception.AppException;
import com.errorlog.backend.global.exception.ErrorCode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ReportService {
    private final ReportRepository reportRepository;
    private final ReportQueryRepository reportQueryRepository;

    public ReportService(ReportRepository reportRepository, ReportQueryRepository reportQueryRepository){
        this.reportRepository = reportRepository;
        this.reportQueryRepository = reportQueryRepository;
    }

    // ===== 사용자용: 신고 등록 =====
    @Transactional
    public Long createReport(Long reporterId, ReportCreateRequestDto request) {

        validateNotDuplicated(reporterId, request);

        Report report = switch (request.getTargetType()) {
            case USER -> Report.reportUser(reporterId, request.getTargetId(),
                    request.getReasonCategory(), request.getReasonDetail());
            case POST -> Report.reportPost(reporterId, request.getTargetId(),
                    request.getReasonCategory(), request.getReasonDetail());
            case COMMENT -> Report.reportComment(reporterId, request.getTargetId(),
                    request.getReasonCategory(), request.getReasonDetail());
        };

        return reportRepository.save(report).getId();
    }

    private void validateNotDuplicated(Long reporterId, ReportCreateRequestDto request) {
        boolean duplicated = switch (request.getTargetType()) {
            case USER -> reportRepository.existsByReporterIdAndReportedUserId(reporterId, request.getTargetId());
            case POST -> reportRepository.existsByReporterIdAndReportedPostId(reporterId, request.getTargetId());
            case COMMENT -> reportRepository.existsByReporterIdAndReportedCommentId(reporterId, request.getTargetId());
        };
        if (duplicated) {
            throw new AppException(ErrorCode.ALREADY_REPORTED);
        }
    }

    // ===== 관리자용: 목록 조회 (QueryDSL 동적 검색) =====
    public Page<ReportListResponseDto> searchReports(ReportSearchConditionDto condition, Pageable pageable) {
        return reportQueryRepository.search(condition, pageable);
    }

    @Transactional
    public void resolveReport(Long reportId) {
        Report report = findReportOrThrow(reportId);
        report.process(); // 상태 변경은 엔티티 메서드로만
    }

    @Transactional
    public void rejectReport(Long reportId) {
        Report report = findReportOrThrow(reportId);
        report.reject();
    }

    private Report findReportOrThrow(Long reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new AppException(ErrorCode.REPORT_NOT_FOUND));
    }
}