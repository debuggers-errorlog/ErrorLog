package com.errorlog.backend.domain.board.service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.errorlog.backend.domain.board.domain.dto.ImageResponse;
import com.errorlog.backend.domain.board.domain.entity.Image;
import com.errorlog.backend.domain.board.domain.entity.Post;
import com.errorlog.backend.domain.board.domain.enums.ImageTargetType;
import com.errorlog.backend.domain.board.domain.enums.PostStatus;
import com.errorlog.backend.domain.board.port.ImageStoragePort;
import com.errorlog.backend.domain.board.repository.ImageRepository;
import com.errorlog.backend.domain.board.repository.PostRepository;
import com.errorlog.backend.common.exception.ApiException;
import com.errorlog.backend.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PostImageService {

	private final PostRepository postRepository;
	private final ImageRepository imageRepository;
	private final ImageStoragePort imageStoragePort;
	private final PostAccessService postAccessService;

	@Transactional(readOnly = true)
	public List<ImageResponse> listPostImages(Long postId, Long viewerId) {
		Post post = findActivePost(postId);
		if (postAccessService.isLocked(post, viewerId)) {
			return List.of();
		}
		return toResponses(imageRepository.findByTargetTypeAndTargetIdOrderByImageSeqAsc(ImageTargetType.POST, postId));
	}

	public ImageResponse uploadPostImage(Long postId, Long actorId, MultipartFile file) {
		Post post = findActivePost(postId);
		assertOwner(post, actorId);

		String extension = ImageFileValidator.validateAndGetExtension(file);
		String key = "posts/%d/%s.%s".formatted(postId, UUID.randomUUID(), extension);
		int nextSeq = imageRepository.findMaxSeq(ImageTargetType.POST, postId) + 1;

		try {
			imageStoragePort.upload(key, file.getInputStream(), file.getSize(), file.getContentType());
		} catch (IOException ex) {
			throw new ApiException(ErrorCode.INVALID_REQUEST);
		}

		Image saved = imageRepository.save(Image.createPostImage(postId, key, nextSeq));
		return ImageResponse.from(saved, imageStoragePort.getPublicUrl(key));
	}

	public void deletePostImage(Long postId, Long imageId, Long actorId) {
		Post post = findActivePost(postId);
		assertOwner(post, actorId);

		Image image = imageRepository.findByIdAndTargetTypeAndTargetId(imageId, ImageTargetType.POST, postId)
				.orElseThrow(() -> new ApiException(ErrorCode.IMAGE_NOT_FOUND));

		imageStoragePort.delete(image.getImagePath());
		imageRepository.delete(image);
	}

	private List<ImageResponse> toResponses(List<Image> images) {
		return images.stream()
				.map(image -> ImageResponse.from(image, imageStoragePort.getPublicUrl(image.getImagePath())))
				.toList();
	}

	private Post findActivePost(Long postId) {
		return postRepository.findByIdAndStatus(postId, PostStatus.ACTIVE)
				.orElseThrow(() -> new ApiException(ErrorCode.POST_NOT_FOUND));
	}

	private void assertOwner(Post post, Long actorId) {
		if (actorId == null || !post.isOwnedBy(actorId)) {
			throw new ApiException(ErrorCode.FORBIDDEN);
		}
	}
}
