package com.errorlog.backend.board.domain.dto;

import java.util.List;

import com.errorlog.backend.board.domain.enums.PostVisibility;
import com.errorlog.backend.board.domain.vo.TroubleshootingMeta;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PostCreateRequest(
		@NotBlank @Size(max = 255) String title,
		@NotBlank String content,
		@Valid @NotNull TroubleshootingMeta troubleshootingMeta,
		@NotNull PostVisibility visibility,
		List<@NotBlank @Size(max = 50) String> tags) {
}
