package com.errorlog.backend.domain.board.service;

import java.io.InputStream;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import com.errorlog.backend.domain.board.port.ImageStoragePort;
import com.errorlog.backend.global.config.S3Properties;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@ConditionalOnProperty(prefix = "errorlog.s3", name = "enabled", havingValue = "true")
@RequiredArgsConstructor
public class S3ImageStorage implements ImageStoragePort {

	private final S3Client s3Client;
	private final S3Properties properties;

	@Override
	public void upload(String key, InputStream inputStream, long contentLength, String contentType) {
		PutObjectRequest request = PutObjectRequest.builder()
				.bucket(properties.bucket())
				.key(key)
				.contentType(contentType)
				.contentLength(contentLength)
				.build();

		s3Client.putObject(request, RequestBody.fromInputStream(inputStream, contentLength));
	}

	@Override
	public void delete(String key) {
		s3Client.deleteObject(DeleteObjectRequest.builder()
				.bucket(properties.bucket())
				.key(key)
				.build());
	}

	@Override
	public String getPublicUrl(String key) {
		if (properties.publicUrlBase() != null && !properties.publicUrlBase().isBlank()) {
			String base = properties.publicUrlBase().endsWith("/")
					? properties.publicUrlBase().substring(0, properties.publicUrlBase().length() - 1)
					: properties.publicUrlBase();
			return base + "/" + key;
		}
		return "https://%s.s3.%s.amazonaws.com/%s".formatted(properties.bucket(), properties.region(), key);
	}
}
