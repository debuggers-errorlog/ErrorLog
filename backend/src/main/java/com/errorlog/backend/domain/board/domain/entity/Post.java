package com.errorlog.backend.domain.board.domain.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.errorlog.backend.domain.board.domain.enums.PostStatus;
import com.errorlog.backend.domain.board.domain.enums.PostVisibility;
import com.errorlog.backend.domain.board.domain.vo.TroubleshootingMeta;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

	@Column(nullable = false)
	private String title;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String content;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(name = "troubleshooting_meta", columnDefinition = "json")
	private TroubleshootingMeta troubleshootingMeta;

	@Column(name = "meta_category", insertable = false, updatable = false)
	private String metaCategory;

	@Column(name = "meta_framework", insertable = false, updatable = false)
	private String metaFramework;

	@Column(name = "meta_error_type", insertable = false, updatable = false)
	private String metaErrorType;

	@Column(name = "meta_error_message", insertable = false, updatable = false)
	private String metaErrorMessage;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PostVisibility visibility;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PostStatus status;

	@Column(name = "view_count", nullable = false)
	private int viewCount;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;

	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;

	@Column(name = "hidden_at")
	private LocalDateTime hiddenAt;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
			name = "post_tags",
			joinColumns = @JoinColumn(name = "post_id"),
			inverseJoinColumns = @JoinColumn(name = "tag_id"))
	private Set<Tag> tags = new HashSet<>();

	public static Post create(
			Long userId,
			String title,
			String content,
			TroubleshootingMeta troubleshootingMeta,
			PostVisibility visibility,
			Set<Tag> tags) {
		Post post = new Post();
		post.userId = userId;
		post.title = title;
		post.content = content;
		post.troubleshootingMeta = troubleshootingMeta;
		post.visibility = visibility;
		post.status = PostStatus.ACTIVE;
		post.viewCount = 0;
		post.createdAt = LocalDateTime.now();
		post.updatedAt = post.createdAt;
		post.tags = new HashSet<>(tags);
		return post;
	}

	public void update(
			String title,
			String content,
			TroubleshootingMeta troubleshootingMeta,
			PostVisibility visibility,
			Set<Tag> tags) {
		this.title = title;
		this.content = content;
		this.troubleshootingMeta = troubleshootingMeta;
		this.visibility = visibility;
		this.tags.clear();
		this.tags.addAll(tags);
		this.updatedAt = LocalDateTime.now();
	}

	public void markDeleted() {
		this.status = PostStatus.DELETED;
		this.deletedAt = LocalDateTime.now();
		this.updatedAt = this.deletedAt;
	}

	public boolean isOwnedBy(Long userId) {
		return this.userId.equals(userId);
	}

	public boolean isSubscriberOnly() {
		return visibility == PostVisibility.SUBSCRIBERS;
	}
}
