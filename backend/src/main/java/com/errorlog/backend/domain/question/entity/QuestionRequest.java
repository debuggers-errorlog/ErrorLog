package com.errorlog.backend.domain.question.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "question_requests")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class QuestionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 팀원의 User 엔티티를 @ManyToOne으로 참조
    // User 엔티티가 com.errorlog.backend.domain.user.entity.User 에 있다고 가정
    @Column(name = "requester_id", nullable = false)
    private Long requesterId;   // 질문자 userId

    @Column(name = "receiver_id", nullable = false)
    private Long receiverId;    // 답변자(멘토) userId

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // ── 상태 변경 메서드 ──────────────────────────────
    public void accept()  { this.status = RequestStatus.ACCEPTED;  }
    public void reject()  { this.status = RequestStatus.REJECTED;  }
    public void cancel()  { this.status = RequestStatus.CANCELLED; }

    public enum RequestStatus {
        PENDING,    // 대기 중
        ACCEPTED,   // 수락됨
        REJECTED,   // 거절됨
        CANCELLED   // 질문자가 취소
    }
}
