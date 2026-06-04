package com.errorlog.backend.board.service;

import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

import com.errorlog.backend.common.exception.ApiException;
import com.errorlog.backend.common.exception.ErrorCode;

final class ImageFileValidator {

	private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
			"image/jpeg",
			"image/png",
			"image/gif",
			"image/webp");

	private static final Map<String, String> EXTENSION_BY_CONTENT_TYPE = Map.of(
			"image/jpeg", "jpg",
			"image/png", "png",
			"image/gif", "gif",
			"image/webp", "webp");

	private ImageFileValidator() {
	}

	static String validateAndGetExtension(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new ApiException(ErrorCode.INVALID_REQUEST);
		}

		String contentType = file.getContentType();
		if (contentType == null) {
			throw new ApiException(ErrorCode.INVALID_FILE_TYPE);
		}

		String normalized = contentType.toLowerCase(Locale.ROOT);
		if (!ALLOWED_CONTENT_TYPES.contains(normalized)) {
			throw new ApiException(ErrorCode.INVALID_FILE_TYPE);
		}

		return EXTENSION_BY_CONTENT_TYPE.get(normalized);
	}
}
