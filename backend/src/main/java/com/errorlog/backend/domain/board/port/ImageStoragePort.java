package com.errorlog.backend.domain.board.port;

import java.io.InputStream;

public interface ImageStoragePort {

	void upload(String key, InputStream inputStream, long contentLength, String contentType);

	void delete(String key);

	String getPublicUrl(String key);
}
