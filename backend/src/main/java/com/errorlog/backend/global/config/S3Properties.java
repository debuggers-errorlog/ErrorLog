package com.errorlog.backend.global.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "errorlog.s3")
public record S3Properties(
		boolean enabled,
		String bucket,
		String region,
		String accessKey,
		String secretKey,
		String endpoint,
		String publicUrlBase) {
}
