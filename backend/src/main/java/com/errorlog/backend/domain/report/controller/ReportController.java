package com.errorlog.backend.domain.report.controller;

import com.errorlog.backend.domain.report.dto.ReportCreateRequestDto;
import com.errorlog.backend.domain.report.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<Long> create(
            @AuthenticationPrincipal Long reporterId,
            @Valid @RequestBody ReportCreateRequestDto request
    ) {
        Long reportId = reportService.createReport(reporterId, request);
        // TODO: 팀 공통 응답 래퍼(ApiResponse 등)가 있으면 그걸로 감싸기
        return ResponseEntity.status(HttpStatus.CREATED).body(reportId);
    }
}