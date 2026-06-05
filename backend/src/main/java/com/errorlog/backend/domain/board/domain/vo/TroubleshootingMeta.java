package com.errorlog.backend.board.domain.vo;

import com.errorlog.backend.board.domain.enums.TroubleshootingCategory;

public record TroubleshootingMeta(
		TroubleshootingCategory category,
		EnvironmentInfo environment,
		ErrorInfo error,
		String symptom,
		String rootCause,
		String resolutionSummary) {
}
