package com.errorlog.backend.domain.question.service;

import com.errorlog.backend.domain.question.entity.QuestionRequest;
import com.errorlog.backend.domain.question.repository.QuestionRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class QuestionRequestStatusUpdater {

    private final QuestionRequestRepository requestRepo;

    /*
     * 결제 실패 시 요청을 거절 처리합니다.
     * REQUIRES_NEW: acceptRequest()의 트랜잭션이 롤백되더라도
     * 이 메서드의 REJECTED 저장은 독립적으로 커밋됩니다.
     */

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void rejectByPaymentFailure(Long requestId) {
        QuestionRequest qr = requestRepo.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 요청입니다. id=" + requestId));
        qr.reject();
    }
}