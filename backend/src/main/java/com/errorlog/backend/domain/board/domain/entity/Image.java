package com.errorlog.backend.domain.board.domain.entity;

import java.time.LocalDateTime;

import com.errorlog.backend.domain.board.domain.enums.ImageTargetType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "images")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Image {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(name = "target_type", nullable = false)
	private ImageTargetType targetType;

	@Column(name = "target_id", nullable = false)
	private Long targetId;

	@Column(name = "image_path", nullable = false)
	private String imagePath;

	@Column(name = "image_seq", nullable = false)
	private int imageSeq;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	public static Image createPostImage(Long postId, String imagePath, int imageSeq) {
		Image image = new Image();
		image.targetType = ImageTargetType.POST;
		image.targetId = postId;
		image.imagePath = imagePath;
		image.imageSeq = imageSeq;
		image.createdAt = LocalDateTime.now();
		return image;
	}
}
