package com.errorlog.backend.domain.question.dto;

import com.errorlog.backend.domain.question.entity.QuestionRequest.RequestStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class QuestionRequestDto {

    /* ── 요청 보내기 (질문자 → 답변자) ─────────────── */
    @Getter
    public static class SendRequest {
        @NotNull(message = "수신자 ID는 필수입니다.")
        private Long receiverId;

        @NotBlank(message = "제목은 필수입니다.")
        private String title;

        @NotBlank(message = "내용은 필수입니다.")
        private String content;
    }

    /* ── 목록 응답 (한 건) ──────────────────────────── */
    @Getter
    @Builder
    public static class RequestItem {
        private Long id;
        private Long requesterId;
        private String requesterNickname;
        private Long receiverId;
        private String receiverNickname;
        private String title;
        private RequestStatus status;
        private LocalDateTime createdAt;
    }

    /* ── 상세 응답 ──────────────────────────────────── */
    @Getter
    @Builder
    public static class RequestDetail {
        private Long id;
        private Long requesterId;
        private String requesterNickname;
        private Long receiverId;
        private String receiverNickname;
        private String title;
        private String content;
        private RequestStatus status;
        private LocalDateTime createdAt;
    }
}
