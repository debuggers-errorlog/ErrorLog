package com.errorlog.backend.domain.board.domain.vo;

public record EnvironmentInfo(
		String language,
		String languageVersion,
		String framework,
		String frameworkVersion,
		String os,
		String deployTarget) {
}
