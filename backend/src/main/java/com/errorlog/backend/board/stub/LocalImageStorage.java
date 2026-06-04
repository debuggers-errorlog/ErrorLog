package com.errorlog.backend.board.stub;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.errorlog.backend.board.port.ImageStoragePort;

@Component
@ConditionalOnProperty(prefix = "errorlog.s3", name = "enabled", havingValue = "false", matchIfMissing = true)
public class LocalImageStorage implements ImageStoragePort {

	private final Path uploadRoot;
	private final String publicUrlBase;

	public LocalImageStorage(
			@Value("${errorlog.storage.local-dir:uploads}") String localDir,
			@Value("${errorlog.storage.public-url-base:http://localhost:8080/uploads}") String publicUrlBase) {
		this.uploadRoot = Path.of(localDir);
		this.publicUrlBase = publicUrlBase.endsWith("/") ? publicUrlBase.substring(0, publicUrlBase.length() - 1) : publicUrlBase;
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
		return publicUrlBase + "/" + key;
	}
}
