package com.errorlog.backend.domain.board.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.errorlog.backend.domain.board.domain.dto.EditorImageUploadResponse;
import com.errorlog.backend.domain.board.port.ImageStoragePort;
import com.errorlog.backend.common.exception.ApiException;
import com.errorlog.backend.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EditorImageService {

	private final ImageStoragePort imageStoragePort;

	public EditorImageUploadResponse uploadEditorImage(Long userId, MultipartFile file) {
		if (userId == null) {
			throw new ApiException(ErrorCode.FORBIDDEN);
		}

		String extension = ImageFileValidator.validateAndGetExtension(file);
		String key = "editor/%d/%s.%s".formatted(userId, UUID.randomUUID(), extension);

		try {
			imageStoragePort.upload(key, file.getInputStream(), file.getSize(), file.getContentType());
		} catch (IOException ex) {
			throw new ApiException(ErrorCode.INVALID_REQUEST);
		}

		return new EditorImageUploadResponse(imageStoragePort.getPublicUrl(key));
	}
}
