package com.errorlog.backend.domain.question.dto;

import com.errorlog.backend.domain.question.entity.Answer;
import com.errorlog.backend.domain.question.entity.Answer.AuthorRole;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class AnswerDto {

    /* ── 답변 작성 / 수정 공통 요청 ────────────────── */
    @Getter
    public static class WriteRequest {
        @NotBlank(message = "답변 내용은 필수입니다.")
        private String content;
    }

    /* ── 답변 응답 아이템 ───────────────────────────── */
    @Getter
    @Builder
    public static class AnswerItem {
        private Long id;
        private Long questionId;
        private Long authorId;
        private String authorNickname;  // 작성자 닉네임
        private AuthorRole authorRole;  // ASKER or MENTOR → 프론트 말풍선 구분
        private String content;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static AnswerItem from(Answer a, String nickname) {
            return AnswerItem.builder()
                    .id(a.getId())
                    .questionId(a.getQuestionId())
                    .authorId(a.getAuthorId())
                    .authorNickname(nickname)
                    .authorRole(a.getAuthorRole())
                    .content(a.getContent())
                    .createdAt(a.getCreatedAt())
                    .updatedAt(a.getUpdatedAt())
                    .build();
        }
    }
}
