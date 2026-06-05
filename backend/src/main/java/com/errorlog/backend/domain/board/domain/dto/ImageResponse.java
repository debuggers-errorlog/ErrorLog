package com.errorlog.backend.domain.board.domain.dto;

import com.errorlog.backend.domain.board.domain.entity.Image;

public record ImageResponse(
		Long id,
		String url,
		int sequence) {

	public static ImageResponse from(Image image, String url) {
		return new ImageResponse(image.getId(), url, image.getImageSeq());
	}
}
