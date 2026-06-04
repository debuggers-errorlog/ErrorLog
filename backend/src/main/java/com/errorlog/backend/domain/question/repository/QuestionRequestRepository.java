package com.errorlog.backend.domain.question.repository;

import com.errorlog.backend.domain.question.entity.QuestionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRequestRepository extends JpaRepository<QuestionRequest, Long> {
}