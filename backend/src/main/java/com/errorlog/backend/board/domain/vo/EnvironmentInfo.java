package com.errorlog.backend.board.domain.vo;

public record EnvironmentInfo(
		String language,
		String languageVersion,
		String framework,
		String frameworkVersion,
		String os,
		String deployTarget) {
}
