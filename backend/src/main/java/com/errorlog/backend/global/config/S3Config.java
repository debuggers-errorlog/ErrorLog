package com.errorlog.backend.global.config;

import java.net.URI;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3ClientBuilder;

@Configuration
@EnableConfigurationProperties(S3Properties.class)
public class S3Config {

	@Bean
	@ConditionalOnProperty(prefix = "errorlog.s3", name = "enabled", havingValue = "true")
	S3Client s3Client(S3Properties properties) {
		S3ClientBuilder builder = S3Client.builder()
				.region(Region.of(properties.region()));

		if (properties.endpoint() != null && !properties.endpoint().isBlank()) {
			builder.endpointOverride(URI.create(properties.endpoint()))
					.forcePathStyle(true);
		}

		if (hasStaticCredentials(properties)) {
			builder.credentialsProvider(StaticCredentialsProvider.create(
					AwsBasicCredentials.create(properties.accessKey(), properties.secretKey())));
		} else {
			builder.credentialsProvider(DefaultCredentialsProvider.create());
		}

		return builder.build();
	}

	private boolean hasStaticCredentials(S3Properties properties) {
		return properties.accessKey() != null && !properties.accessKey().isBlank()
				&& properties.secretKey() != null && !properties.secretKey().isBlank();
	}
}
