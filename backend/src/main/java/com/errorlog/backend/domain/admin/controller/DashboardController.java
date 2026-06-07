package com.errorlog.backend.domain.admin.controller;

import com.errorlog.backend.domain.admin.dto.DashboardResponseDto;
import com.errorlog.backend.domain.admin.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponseDto get() {
        return dashboardService.getDashboard();
    }
}