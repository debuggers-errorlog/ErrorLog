package com.errorlog.backend.domain.admin.service;

import com.errorlog.backend.domain.admin.dto.DashboardResponseDto;
import com.errorlog.backend.domain.admin.repository.DashboardQueryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final DashboardQueryRepository dashboardQueryRepository;

    public DashboardService(DashboardQueryRepository dashboardQueryRepository) {
        this.dashboardQueryRepository = dashboardQueryRepository;
    }

    public DashboardResponseDto getDashboard() {
        return new DashboardResponseDto(
                dashboardQueryRepository.countMembers(),
                dashboardQueryRepository.countActiveSubscribers(),
                dashboardQueryRepository.estimatedRevenue(),
                dashboardQueryRepository.countPendingQuestionRequests(),
                dashboardQueryRepository.monthlyRevenue()
        );
    }
}