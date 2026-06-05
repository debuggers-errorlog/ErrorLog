package com.errorlog.backend.domain.board.domain.vo;

import com.errorlog.backend.domain.board.domain.enums.TroubleshootingCategory;

public record TroubleshootingMeta(
		TroubleshootingCategory category,
		EnvironmentInfo environment,
		ErrorInfo error,
		String symptom,
		String rootCause,
		String resolutionSummary) {
}
