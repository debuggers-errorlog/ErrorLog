package com.errorlog.backend.domain.payment.service;

import com.errorlog.backend.domain.subscription.Entity.User; // merge후 user 도메인 엔티티로 변경
import com.errorlog.backend.domain.subscription.repository.UserRepository; // merge후 user 도메인 repo로 변경
import com.errorlog.backend.domain.payment.Entity.Payment;
import com.errorlog.backend.domain.payment.dto.SettlementDetailResponse;
import com.errorlog.backend.domain.payment.dto.SettlementResponse;
import com.errorlog.backend.domain.payment.enums.PaymentStatus;
import com.errorlog.backend.domain.payment.enums.PaymentType;
import com.errorlog.backend.domain.payment.repository.PaymentQueryRepository;
import com.errorlog.backend.domain.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SettlementService {
    private final PaymentQueryRepository paymentQueryRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public SettlementResponse getSettlement(Long creatorId, PaymentType paymentType) {

        // 1. 총 수익 조회
        Long totalRevenue = paymentQueryRepository.getTotalRevenue(creatorId, paymentType);

        // 2. 이번 달 수익 조회
        Long thisMonthRevenue = paymentQueryRepository.getThisMonthRevenue(creatorId, paymentType);

        // 3. 총 건수 조회
        Long totalCount = paymentQueryRepository.getTotalCount(creatorId, paymentType);

        // 4. 결제 내역 조회
        List<Payment> payments = paymentType == null
                ? paymentRepository.findByTargetIdAndStatusOrderByCreatedAtDesc(
                creatorId, PaymentStatus.PAID)
                : paymentRepository.findByTargetIdAndPaymentTypeAndStatusOrderByCreatedAtDesc(
                creatorId, paymentType, PaymentStatus.PAID);

        List<SettlementDetailResponse> details = payments.stream()
                .map(p -> {
                    // 결제자 닉네임 조회
                    String payerName = userRepository.findById(p.getUserId())
                            .map(User::getNickname)
                            .orElse("알 수 없음");
                    return new SettlementDetailResponse(
                            p.getId(),
                            payerName,          // userId 대신 닉네임
                            p.getPaymentType(),
                            p.getPrice(),
                            p.getCreatedAt()
                    );
                })
                .collect(Collectors.toList()); // Stream -> List 변환

        return new SettlementResponse(thisMonthRevenue, totalRevenue, totalCount, details);
    }

}
