package com.errorlog.backend.domain.admin.service;

import com.errorlog.backend.domain.admin.dto.SubscriptionListResponseDto;
import com.errorlog.backend.domain.admin.dto.SubscriptionSummaryDto;
import com.errorlog.backend.domain.admin.repository.AdminSubscriptionQueryRepository;
import com.errorlog.backend.domain.admin.repository.DashboardQueryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class SubscriptionAdminService {

    private final DashboardQueryRepository subscriptionQueryRepository;
    private final AdminSubscriptionQueryRepository adminsubscriptionListRepository;

    public SubscriptionAdminService(DashboardQueryRepository subscriptionQueryRepository,
                                    AdminSubscriptionQueryRepository adminsubscriptionListRepository) {
        this.subscriptionQueryRepository = subscriptionQueryRepository;
        this.adminsubscriptionListRepository = adminsubscriptionListRepository;
    }

    public SubscriptionSummaryDto getSummary() {
        long active  = subscriptionQueryRepository.countActiveSubscribers();
        long expired = subscriptionQueryRepository.countExpiredSubscriptions();
        long revenue = subscriptionQueryRepository.estimatedRevenue();
        return new SubscriptionSummaryDto(active, expired, revenue);
    }

    public Page<SubscriptionListResponseDto> getSubscriptions(String search, String status, Pageable pageable) {
        return adminsubscriptionListRepository.search(search, status, pageable);
    }
}
