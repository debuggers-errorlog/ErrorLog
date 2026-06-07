package com.errorlog.backend.domain.board.controller;

import java.io.IOException;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.errorlog.backend.global.config.S3Properties;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;

@RestController
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "errorlog.s3", name = "enabled", havingValue = "true")
public class S3ImageServeController {

	private static final String UPLOAD_PREFIX = "/uploads/";

	private final S3Client s3Client;
	private final S3Properties properties;

	@GetMapping("/uploads/**")
	public ResponseEntity<InputStreamResource> serve(HttpServletRequest request) throws IOException {
		String key = extractKey(request.getRequestURI());
		if (key == null) {
			return ResponseEntity.badRequest().build();
		}

		try {
			ResponseInputStream<GetObjectResponse> object = s3Client.getObject(
					GetObjectRequest.builder()
							.bucket(properties.bucket())
							.key(key)
							.build());

			GetObjectResponse metadata = object.response();
			MediaType mediaType = resolveMediaType(metadata.contentType(), key);

			return ResponseEntity.ok()
					.contentType(mediaType)
					.cacheControl(CacheControl.maxAge(365, java.util.concurrent.TimeUnit.DAYS).cachePublic())
					.body(new InputStreamResource(object));
		} catch (NoSuchKeyException ex) {
			return ResponseEntity.notFound().build();
		}
	}

	private String extractKey(String requestUri) {
		if (requestUri == null || !requestUri.startsWith(UPLOAD_PREFIX)) {
			return null;
		}
		String key = requestUri.substring(UPLOAD_PREFIX.length());
		if (key.isBlank() || key.contains("..")) {
			return null;
		}
		return key;
	}

	private MediaType resolveMediaType(String contentType, String key) {
		if (contentType != null && !contentType.isBlank()) {
			return MediaType.parseMediaType(contentType);
		}
		if (key.endsWith(".png")) {
			return MediaType.IMAGE_PNG;
		}
		if (key.endsWith(".jpg") || key.endsWith(".jpeg")) {
			return MediaType.IMAGE_JPEG;
		}
		if (key.endsWith(".gif")) {
			return MediaType.IMAGE_GIF;
		}
		if (key.endsWith(".webp")) {
			return MediaType.parseMediaType("image/webp");
		}
		return MediaType.APPLICATION_OCTET_STREAM;
	}
}
