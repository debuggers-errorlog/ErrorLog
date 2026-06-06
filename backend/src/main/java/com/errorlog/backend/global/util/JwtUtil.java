package com.errorlog.backend.global.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expiration}") long accessTokenExpiration,
            @Value("${jwt.refresh-token-expiration}") long refreshTokenExpiration
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    public String generateAccessToken(Long userId, String role) {
        return buildToken(userId, role, accessTokenExpiration);
    }

    public String generateRefreshToken(Long userId, String role) {
        return buildToken(userId, role, refreshTokenExpiration);
    }

    // OAuth 신규 유저용 임시 토큰 (10분)
    public String generateTempToken(String email, String providerId) {
        return Jwts.builder()
                .subject(email)
                .claim("providerId", providerId)
                .claim("type", "TEMP")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 600000))
                .signWith(secretKey)
                .compact();
    }

    public String extractEmailFromTempToken(String token) {
        return parseToken(token).getSubject();
    }

    public String extractProviderIdFromTempToken(String token) {
        return parseToken(token).get("providerId", String.class);
    }

    public boolean isTempToken(String token) {
        return "TEMP".equals(parseToken(token).get("type", String.class));
    }

    private String buildToken(Long userId, String role, long expiration) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long extractUserId(String token) {
        return Long.parseLong(parseToken(token).getSubject());
    }

    public String extractRole(String token) {
        return parseToken(token).get("role", String.class);
    }

    public boolean isTokenValid(String token) {
        try {
            parseToken(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("만료된 JWT: {}", e.getMessage());
        } catch (JwtException e) {
            log.warn("유효하지 않은 JWT: {}", e.getMessage());
        }
        return false;
    }
}
