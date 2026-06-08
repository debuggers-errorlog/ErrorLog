package com.errorlog.backend.domain.question.repository;

import com.errorlog.backend.domain.question.entity.Question;
import com.errorlog.backend.domain.question.entity.Question.QuestionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    // 내가 질문자로 참여한 목록
    List<Question> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, QuestionStatus status);

    // 내가 답변자로 참여한 목록
    List<Question> findByMentorIdAndStatusOrderByCreatedAtDesc(Long mentorId, QuestionStatus status);

    // 요청 ID로 질문 조회 (ACCEPTED 상태)
    Optional<Question> findByRequestId(Long requestId);
}
