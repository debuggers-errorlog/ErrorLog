package com.errorlog.backend.domain.question.dto;

import com.errorlog.backend.domain.question.entity.Question.QuestionStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

public class QuestionDto {

    /* ── 질문 목록 아이템 ───────────────────────────── */
    @Getter
    @Builder
    public static class QuestionItem {
        private Long id;
        private String title;
        private String askerNickname;   // 질문자 닉네임
        private String mentorNickname;  // 답변자 닉네임
        private QuestionStatus status;
        private int answerCount;        // 답변 수
        private LocalDateTime createdAt;
    }

    /* ── 질문 상세 (답변 목록 포함) ────────────────── */
    @Getter
    @Builder
    public static class QuestionDetail {
        private Long id;
        private Long requestId;
        private String title;
        private String content;

        // 질문자 정보
        private Long askerId;
        private String askerNickname;

        // 답변자(멘토) 정보
        private Long mentorId;
        private String mentorNickname;

        private QuestionStatus status;
        private LocalDateTime createdAt;

        // 답변(대화) 목록 — 시간순 정렬
        private List<AnswerDto.AnswerItem> answers;
    }
}
