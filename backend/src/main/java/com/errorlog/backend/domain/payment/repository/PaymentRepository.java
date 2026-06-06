package com.errorlog.backend.domain.payment.repository;


import com.errorlog.backend.domain.payment.Entity.Payment;
import com.errorlog.backend.domain.payment.enums.PaymentStatus;
import com.errorlog.backend.domain.payment.enums.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment,Long> {

    // 구독 or 질문글 결제 내역 조회 (paymentType 지정)
    List<Payment> findByTargetIdAndPaymentTypeAndStatusOrderByCreatedAtDesc(
            Long targetId, PaymentType paymentType, PaymentStatus status
    );

    // 전체 결제 내역 조회 (paymentType 없음)
    List<Payment> findByTargetIdAndStatusOrderByCreatedAtDesc(
            Long targetId, PaymentStatus status
    );
}
