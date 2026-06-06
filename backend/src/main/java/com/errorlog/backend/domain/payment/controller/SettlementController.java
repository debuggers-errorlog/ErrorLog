package com.errorlog.backend.domain.payment.controller;

import com.errorlog.backend.domain.payment.dto.SettlementResponse;
import com.errorlog.backend.domain.payment.enums.PaymentType;
import com.errorlog.backend.domain.payment.service.SettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class SettlementController {

    private final SettlementService settlementService;

    // GET /api/payments/settlement?creatorId={creatorId}&paymentType={paymentType}
    // 정산 조회 (구독/질문글/전체)
    @GetMapping("/settlement")
    public ResponseEntity<SettlementResponse> getSettlement(
            @RequestParam Long creatorId,
            @RequestParam(required = false) PaymentType paymentType) {
        return ResponseEntity.ok(settlementService.getSettlement(creatorId, paymentType));
    }
}
