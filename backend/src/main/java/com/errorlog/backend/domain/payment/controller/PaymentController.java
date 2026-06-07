package com.errorlog.backend.domain.payment.controller;

import com.errorlog.backend.domain.payment.dto.PaymentCancelRequest;
import com.errorlog.backend.domain.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/cancel")
    public ResponseEntity<Void> cancel(
            @RequestBody PaymentCancelRequest request,
            @AuthenticationPrincipal Long userId) {
        paymentService.cancel(userId, request.getCreatorId());
        return ResponseEntity.ok().build();
    }
}
