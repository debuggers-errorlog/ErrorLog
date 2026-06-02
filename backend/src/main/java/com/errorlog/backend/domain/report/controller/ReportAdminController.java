package com.errorlog.backend.domain.report.controller;

import com.errorlog.backend.domain.report.dto.ReportListResponseDto;
import com.errorlog.backend.domain.report.dto.ReportSearchConditionDto;
import com.errorlog.backend.domain.report.service.ReportService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/admin/reports")
public class ReportAdminController {

    private final ReportService reportService;

    public ReportAdminController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public Page<ReportListResponseDto> search(
            @ModelAttribute ReportSearchConditionDto condition,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        // 정렬은 ReportQueryRepository에서 createdAt 내림차순으로 고정
        return reportService.searchReports(condition, pageable);
    }


    @PatchMapping("/{reportId}/resolve")
    public ResponseEntity<Void> resolve(@PathVariable Long reportId) {
        reportService.resolveReport(reportId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{reportId}/reject")
    public ResponseEntity<Void> reject(@PathVariable Long reportId) {
        reportService.rejectReport(reportId);
        return ResponseEntity.noContent().build();
    }
}
