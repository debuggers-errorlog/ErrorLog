package com.errorlog.backend.domain.question.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "questions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_id", nullable = false)
    private Long requestId;     // 어떤 요청에서 만들어진 질문인지

    @Column(name = "user_id", nullable = false)
    private Long userId;        // 질문자

    @Column(name = "mentor_id", nullable = false)
    private Long mentorId;      // 답변자(멘토)

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private QuestionStatus status = QuestionStatus.ACTIVE;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    private LocalDateTime deletedAt;

    // ── 소프트 삭제 ───────────────────────────────────
    public void delete() {
        this.status    = QuestionStatus.DELETED;
        this.deletedAt = LocalDateTime.now();
    }
    // ── 질문 답변 완료 ──────────────────────────────────
    public void close() {
        this.status = QuestionStatus.CLOSED;
        this.updatedAt = LocalDateTime.now();
    }

    public enum QuestionStatus {
        ACTIVE, CLOSED, DELETED, HIDDEN
    }
}
