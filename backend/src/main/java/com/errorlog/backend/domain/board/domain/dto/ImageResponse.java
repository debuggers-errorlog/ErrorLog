package com.errorlog.backend.board.domain.dto;

import com.errorlog.backend.board.domain.entity.Image;

public record ImageResponse(
		Long id,
		String url,
		int sequence) {

	public static ImageResponse from(Image image, String url) {
		return new ImageResponse(image.getId(), url, image.getImageSeq());
	}
}
