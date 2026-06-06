package com.errorlog.backend.domain.payment.dto;

import com.errorlog.backend.domain.payment.enums.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class SettlementDetailResponse {
    private Long paymentId;
    private String payerName;        // 결제자 닉네임
    private PaymentType paymentType; // 구독 or 질문글
    private Long price;
    private LocalDateTime createdAt;
}
