package com.errorlog.backend.domain.question.repository;

import com.errorlog.backend.domain.question.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    // 특정 질문의 답변 목록 (시간순)
    List<Answer> findByQuestionIdOrderByCreatedAtAsc(Long questionId);
}
