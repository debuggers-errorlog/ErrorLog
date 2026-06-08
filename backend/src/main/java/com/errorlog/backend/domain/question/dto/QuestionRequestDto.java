package com.errorlog.backend.domain.question.dto;

import com.errorlog.backend.domain.question.entity.QuestionRequest.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

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

        @Size(max = 10, message = "이미지는 최대 10장까지 첨부할 수 있습니다.")
        private List<String> imageUrls;
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
        private Status status;
        private LocalDateTime createdAt;
        private Long questionPrice;
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
        private Status status;
        private LocalDateTime createdAt;
        private List<String> imageUrls;
        private Long questionId;
        private Long questionPrice;
    }
}
