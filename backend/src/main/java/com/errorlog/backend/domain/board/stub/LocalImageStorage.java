package com.errorlog.backend.domain.board.stub;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.errorlog.backend.domain.board.port.ImageStoragePort;
import com.errorlog.backend.global.config.LocalStoragePaths;

@Component
@ConditionalOnProperty(prefix = "errorlog.s3", name = "enabled", havingValue = "false", matchIfMissing = true)
public class LocalImageStorage implements ImageStoragePort {

	private final Path uploadRoot;

	public LocalImageStorage(LocalStoragePaths localStoragePaths) {
		this.uploadRoot = localStoragePaths.uploadRoot();
	}

	@Override
	public void upload(String key, InputStream inputStream, long contentLength, String contentType) {
		try {
			Path target = uploadRoot.resolve(key);
			Files.createDirectories(target.getParent());
			Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException ex) {
			throw new IllegalStateException("로컬 이미지 저장에 실패했습니다.", ex);
		}
	}

	@Override
	public void delete(String key) {
		try {
			Files.deleteIfExists(uploadRoot.resolve(key));
		} catch (IOException ex) {
			throw new IllegalStateException("로컬 이미지 삭제에 실패했습니다.", ex);
		}
	}

	@Override
	public String getPublicUrl(String key) {
		// Vite proxy(/uploads → 8080) 호환을 위해 상대 경로 반환
		return "/uploads/" + key.replace('\\', '/');
	}
}
