package com.errorlog.backend.domain.question.repository;

import com.errorlog.backend.domain.question.entity.QuestionRequest;
import com.errorlog.backend.domain.question.entity.QuestionRequest.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRequestRepository extends JpaRepository<QuestionRequest, Long> {

    // 내가 보낸 요청 목록 (질문자)
    List<QuestionRequest> findByRequesterIdOrderByCreatedAtDesc(Long requesterId);

    // 내가 받은 요청 목록 (답변자)
    List<QuestionRequest> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);

    // 받은 요청 중 특정 상태만 필터
    List<QuestionRequest> findByReceiverIdAndStatusOrderByCreatedAtDesc(
            Long receiverId, RequestStatus status);
}
