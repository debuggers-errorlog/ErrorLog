package com.errorlog.backend.domain.payment.service;

import com.errorlog.backend.domain.payment.Entity.Payment;
import com.errorlog.backend.domain.payment.enums.PaymentStatus;
import com.errorlog.backend.domain.payment.enums.PaymentType;
import com.errorlog.backend.domain.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;

    @Transactional
    public void record(Long userId, Long targetId, PaymentType paymentType, Long price, PaymentStatus status) {
        Payment payment = Payment.builder()
                .userId(userId)
                .targetId(targetId)
                .paymentType(paymentType)
                .price(price)
                .status(status)
                .build();
        paymentRepository.save(payment);
    }

    @Transactional
    public void cancel(Long userId, Long targetId) {
        record(userId, targetId, PaymentType.SUBSCRIPTION, 0L, PaymentStatus.FAILED);
    }
}

/*

// 질문 수락
paymentService.record(
    requesterId,      // 결제자 (질문자)
    questionId,       // 질문글 ID
    PaymentType.QUESTION,
    0L,               // 가격 확정되면 교체
    PaymentStatus.PAID
);
 */
