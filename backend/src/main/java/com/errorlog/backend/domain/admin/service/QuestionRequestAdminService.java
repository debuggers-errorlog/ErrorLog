package com.errorlog.backend.domain.admin.service;

import com.errorlog.backend.domain.admin.dto.QuestionRequestListResponseDto;
import com.errorlog.backend.domain.admin.dto.QuestionRequestSearchConditionDto;
import com.errorlog.backend.domain.admin.repository.QuestionRequestAdminQueryRepository;
import com.errorlog.backend.domain.question.entity.QuestionRequest;
import com.errorlog.backend.domain.question.repository.QuestionRequestRepository;
import com.errorlog.backend.global.exception.AppException;
import com.errorlog.backend.global.exception.ErrorCode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class QuestionRequestAdminService {

    private final QuestionRequestAdminQueryRepository queryRepository;
    private final QuestionRequestRepository questionRequestRepository;

    public QuestionRequestAdminService(QuestionRequestAdminQueryRepository queryRepository,
                                       QuestionRequestRepository questionRequestRepository) {
        this.queryRepository = queryRepository;
        this.questionRequestRepository = questionRequestRepository;
    }

    public Page<QuestionRequestListResponseDto> search(QuestionRequestSearchConditionDto condition, Pageable pageable) {
        return queryRepository.search(condition, pageable);
    }

    @Transactional
    public void cancel(Long requestId) {
        QuestionRequest request = questionRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_REQUEST_NOT_FOUND));
        request.cancel();
    }
}