package com.errorlog.backend.domain.question.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

// TODO: 임시 placeholder. question 도메인 담당자 실제 엔티티로 교체 예정.
@Entity
@Table(name = "question_requests")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuestionRequest {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "requester_id", nullable = false)
    private Long requesterId;   // 멘티

    @Column(name = "receiver_id", nullable = false)
    private Long receiverId;    // 멘토

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = Status.PENDING;
    }

    public void cancel() {   // 관리자 개입: 묵은 요청 취소
        this.status = Status.CANCELLED;
    }

    public enum Status { PENDING, ACCEPTED, REJECTED, CANCELLED }
}