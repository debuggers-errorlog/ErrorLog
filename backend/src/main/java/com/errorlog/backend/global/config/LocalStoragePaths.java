package com.errorlog.backend.global.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@ConditionalOnProperty(prefix = "errorlog.s3", name = "enabled", havingValue = "false", matchIfMissing = true)
public class LocalStoragePaths {

	private final Path uploadRoot;
	private final String resourceLocation;

	public LocalStoragePaths(@Value("${errorlog.storage.local-dir:uploads}") String localDir) {
		this.uploadRoot = Path.of(localDir).toAbsolutePath().normalize();
		try {
			Files.createDirectories(this.uploadRoot);
		} catch (IOException ex) {
			throw new IllegalStateException("업로드 디렉터리 생성에 실패했습니다: " + this.uploadRoot, ex);
		}
		String uri = this.uploadRoot.toUri().toString();
		this.resourceLocation = uri.endsWith("/") ? uri : uri + "/";
		log.info("Local image storage path: {}", this.uploadRoot);
	}

	public Path uploadRoot() {
		return uploadRoot;
	}

	public String resourceLocation() {
		return resourceLocation;
	}
}
