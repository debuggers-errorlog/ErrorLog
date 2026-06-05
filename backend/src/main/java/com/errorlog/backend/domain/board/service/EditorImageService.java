package com.errorlog.backend.domain.board.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.errorlog.backend.domain.board.domain.dto.EditorImageUploadResponse;
import com.errorlog.backend.domain.board.port.ImageStoragePort;
import com.errorlog.backend.global.exception.AppException;
import com.errorlog.backend.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EditorImageService {

	private final ImageStoragePort imageStoragePort;

	public EditorImageUploadResponse uploadEditorImage(Long userId, MultipartFile file) {
		if (userId == null) {
			throw new AppException(ErrorCode.FORBIDDEN);
		}

		String extension = ImageFileValidator.validateAndGetExtension(file);
		String key = "editor/%d/%s.%s".formatted(userId, UUID.randomUUID(), extension);

		try {
			imageStoragePort.upload(key, file.getInputStream(), file.getSize(), file.getContentType());
		} catch (IOException ex) {
			throw new AppException(ErrorCode.INVALID_REQUEST);
		}

		return new EditorImageUploadResponse(imageStoragePort.getPublicUrl(key));
	}
}
