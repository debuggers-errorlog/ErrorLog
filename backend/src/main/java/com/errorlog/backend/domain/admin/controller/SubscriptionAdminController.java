package com.errorlog.backend.domain.admin.controller;

import com.errorlog.backend.domain.admin.dto.SubscriptionListResponseDto;
import com.errorlog.backend.domain.admin.dto.SubscriptionSummaryDto;
import com.errorlog.backend.domain.admin.service.SubscriptionAdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/subscriptions")
public class SubscriptionAdminController {

    private final SubscriptionAdminService subscriptionAdminService;

    public SubscriptionAdminController(SubscriptionAdminService subscriptionAdminService) {
        this.subscriptionAdminService = subscriptionAdminService;
    }

    @GetMapping("/summary")
    public ResponseEntity<SubscriptionSummaryDto> getSummary() {
        return ResponseEntity.ok(subscriptionAdminService.getSummary());
    }
    @GetMapping
    public ResponseEntity<Page<SubscriptionListResponseDto>> getList(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(subscriptionAdminService.getSubscriptions(search, status, pageable));
    }
}