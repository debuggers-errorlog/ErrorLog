package com.errorlog.backend.domain.board.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.errorlog.backend.domain.board.domain.dto.EditorImageUploadResponse;
import com.errorlog.backend.domain.board.service.EditorImageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class EditorImageController {

	private final EditorImageService editorImageService;

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@ResponseStatus(HttpStatus.CREATED)
	public EditorImageUploadResponse uploadEditorImage(
			@RequestHeader("X-User-Id") Long userId,
			@RequestPart("file") MultipartFile file) {
		return editorImageService.uploadEditorImage(userId, file);
	}
}
