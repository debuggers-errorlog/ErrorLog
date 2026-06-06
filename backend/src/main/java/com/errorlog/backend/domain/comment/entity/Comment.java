package com.errorlog.backend.domain.comment.entity;

import com.errorlog.backend.domain.board.domain.entity.Post;
import com.errorlog.backend.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "parent_id")
    private Comment parent;   // null이면 최상위 댓글, 값이 있으면 대댓글

    @Enumerated(EnumType.STRING)
    private CommentStatus status;

    @Column(columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp  private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
    private LocalDateTime hiddenAt;

    public Comment(Post post, User user, Comment parent, String content) {
        this.post = post;
        this.user = user;
        this.parent = parent;
        this.content = content;
        this.status = CommentStatus.ACTIVE;
    }

    public void updateContent(String content) {
        this.content = content;
    }

    public void softDelete() {
        this.status = CommentStatus.DELETED;
        this.deletedAt = LocalDateTime.now();
    }
}