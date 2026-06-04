package com.errorlog.backend.domain.admin.dto;

import lombok.Getter;
import java.util.List;

@Getter
public class DashboardResponseDto {
    private final long totalMembers;
    private final long activeSubscribers;
    private final long estimatedRevenue;
    private final long pendingQuestionRequests;
    private final List<MonthlyRevenueDto> monthlyRevenue;

    public DashboardResponseDto(long totalMembers, long activeSubscribers, long estimatedRevenue,
                                long pendingQuestionRequests, List<MonthlyRevenueDto> monthlyRevenue) {
        this.totalMembers = totalMembers;
        this.activeSubscribers = activeSubscribers;
        this.estimatedRevenue = estimatedRevenue;
        this.pendingQuestionRequests = pendingQuestionRequests;
        this.monthlyRevenue = monthlyRevenue;
    }
}
