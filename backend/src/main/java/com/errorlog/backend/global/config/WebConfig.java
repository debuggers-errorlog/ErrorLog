package com.errorlog.backend.global.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Value("${errorlog.cors.allowed-origins}")
	private String allowedOrigins;

	@Value("${errorlog.s3.enabled:false}")
	private boolean s3Enabled;

	@Autowired(required = false)
	private LocalStoragePaths localStoragePaths;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**")
				.allowedOrigins(allowedOrigins.split(","))
				.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
				.allowedHeaders("*")
				.exposedHeaders("*")
				.allowCredentials(true);
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		if (!s3Enabled && localStoragePaths != null) {
			registry.addResourceHandler("/uploads/**")
					.addResourceLocations(localStoragePaths.resourceLocation());
		}
	}
}
