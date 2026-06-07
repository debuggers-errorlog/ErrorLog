package com.errorlog.backend.domain.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

// 정산내역 확인
@Getter
@AllArgsConstructor
public class SettlementResponse {
    private Long thisMonthRevenue;      // 이번 달 수익
    private Long totalRevenue;          // 총 누적 수익
    private Long totalCount;            // 총 건수 (구독자 수 or 질문 건수)
    private List<SettlementDetailResponse> details; // 결제 내역
}
