package com.errorlog.backend.domain.admin.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;

@Getter
public class MonthlyRevenueDto {
    private final String month;   // "2026-05"
    private final Long amount;

    @QueryProjection
    public MonthlyRevenueDto(String month, Long amount) {
        this.month = month;
        this.amount = amount;
    }
}