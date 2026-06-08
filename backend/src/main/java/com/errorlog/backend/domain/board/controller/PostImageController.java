package com.errorlog.backend.domain.board.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.errorlog.backend.domain.board.domain.dto.ImageResponse;
import com.errorlog.backend.domain.board.service.PostImageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/posts/{postId}/images")
@RequiredArgsConstructor
public class PostImageController {

	private final PostImageService postImageService;

	@GetMapping
	public List<ImageResponse> listImages(
			@PathVariable Long postId,
			@AuthenticationPrincipal Long viewerId) {
		return postImageService.listPostImages(postId, viewerId);
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@ResponseStatus(HttpStatus.CREATED)
	public ImageResponse uploadImage(
			@PathVariable Long postId,
			@AuthenticationPrincipal Long actorId,
			@RequestPart("file") MultipartFile file) {
		return postImageService.uploadPostImage(postId, actorId, file);
	}

	@DeleteMapping("/{imageId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteImage(
			@PathVariable Long postId,
			@PathVariable Long imageId,
			@AuthenticationPrincipal Long actorId) {
		postImageService.deletePostImage(postId, imageId, actorId);
	}
}
