package com.errorlog.backend.domain.question.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "answers")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    // 실제 작성자 userId
    @Column(name = "author_id", nullable = false)
    private Long authorId;

    // 작성자 역할 구분 (프론트 렌더링 분기용)
    @Enumerated(EnumType.STRING)
    @Column(name = "author_role", nullable = false)
    private AuthorRole authorRole;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    // ── 수정 ──────────────────────────────────────────
    public void update(String content) {
        this.content   = content;
        this.updatedAt = LocalDateTime.now();
    }

    public enum AuthorRole {
        ASKER,  // 질문자가 작성
        MENTOR  // 답변자(멘토)가 작성
    }
}
