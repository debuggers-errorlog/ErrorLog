package com.errorlog.backend.domain.auth.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken
) {}
