package com.errorlog.backend.domain.post.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// TODO: 임시 placeholder. posts 도메인 담당자의 실제 Post로 교체/병합 예정.
@Entity
@Table(name = "posts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Visibility visibility;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "view_count", nullable = false)
    private Integer viewCount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "hidden_at")
    private LocalDateTime hiddenAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) this.status = Status.ACTIVE;
        if (this.visibility == null) this.visibility = Visibility.PUBLIC;
        if (this.viewCount == null) this.viewCount = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ===== 관리자 상태 변경 =====
    public void hide() {
        this.status = Status.HIDDEN;
        this.hiddenAt = LocalDateTime.now();
    }

    public void show() {
        this.status = Status.ACTIVE;
        this.hiddenAt = null;
    }

    public void softDelete() {
        this.status = Status.DELETED;
        this.deletedAt = LocalDateTime.now();
    }

    public enum Visibility { PUBLIC, SUBSCRIBERS }
    public enum Status { ACTIVE, DELETED, HIDDEN }
}