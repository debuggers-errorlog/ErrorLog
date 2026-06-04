package com.errorlog.backend.domain.auth.service;

import com.errorlog.backend.domain.auth.dto.LoginRequest;
import com.errorlog.backend.domain.auth.dto.PasswordResetRequest;
import com.errorlog.backend.domain.auth.dto.SignUpRequest;
import com.errorlog.backend.domain.auth.dto.TokenResponse;
import com.errorlog.backend.domain.auth.dto.WithdrawRequest;
import com.errorlog.backend.domain.auth.entity.RefreshToken;
import com.errorlog.backend.domain.auth.repository.RefreshTokenRepository;
import com.errorlog.backend.domain.user.entity.User;
import com.errorlog.backend.domain.user.repository.UserRepository;
import com.errorlog.backend.global.exception.AppException;
import com.errorlog.backend.global.exception.ErrorCode;
import com.errorlog.backend.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailVerificationService emailVerificationService;
    private final TokenBlacklistService tokenBlacklistService;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    @Transactional
    public void signUp(SignUpRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new AppException(ErrorCode.DUPLICATE_EMAIL);
        }
        if (userRepository.existsByNickname(request.nickname())) {
            throw new AppException(ErrorCode.DUPLICATE_NICKNAME);
        }

        emailVerificationService.verifyCode(request.email(), request.verificationCode(), EmailVerificationService.Purpose.SIGNUP);

        User user = User.builder()
                .email(request.email())
                .nickname(request.nickname())
                .password(passwordEncoder.encode(request.password()))
                .role(User.Role.USER)
                .status(User.Status.ACTIVE)
                .build();

        userRepository.save(user);
        log.info("회원가입 완료: {}", request.email());
    }

    @Transactional
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        if (user.getStatus() == User.Status.DELETED) {
            throw new AppException(ErrorCode.USER_DELETED);
        }
        if (user.getStatus() == User.Status.SUSPENDED) {
            throw new AppException(ErrorCode.USER_SUSPENDED);
        }
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId(), user.getRole().name());

        // 기존 Refresh Token 전부 무효화 후 새로 저장
        refreshTokenRepository.revokeAllByUserId(user.getId());
        refreshTokenRepository.save(RefreshToken.builder()
                .user(user)
                .token(refreshToken)
                .isRevoked(false)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000))
                .build());

        return new TokenResponse(accessToken, refreshToken);
    }

    @Transactional
    public TokenResponse reissue(String refreshToken) {
        // 토큰 유효성 검증
        if (!jwtUtil.isTokenValid(refreshToken)) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        // DB에서 Refresh Token 조회
        RefreshToken stored = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new AppException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));

        // 이미 무효화된 토큰인지 확인
        if (stored.isRevoked()) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_REVOKED);
        }

        // 만료 시간 확인
        if (stored.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.EXPIRED_TOKEN);
        }

        User user = stored.getUser();

        // 기존 토큰 무효화 후 새 토큰 발급
        stored.revoke();
        String newAccessToken = jwtUtil.generateAccessToken(user.getId(), user.getRole().name());
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getId(), user.getRole().name());

        refreshTokenRepository.save(RefreshToken.builder()
                .user(user)
                .token(newRefreshToken)
                .isRevoked(false)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000))
                .build());

        log.info("토큰 재발급 완료: userId={}", user.getId());
        return new TokenResponse(newAccessToken, newRefreshToken);
    }

    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        emailVerificationService.verifyCode(request.email(), request.verificationCode(), EmailVerificationService.Purpose.PASSWORD_RESET);

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.updatePassword(passwordEncoder.encode(request.newPassword()));
        log.info("비밀번호 재설정 완료: {}", request.email());
    }

    public void logout(String token) {        tokenBlacklistService.add(token);
        log.info("로그아웃 완료 - 토큰 블랙리스트 등록");
    }

    @Transactional
    public void withdraw(Long userId, WithdrawRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        refreshTokenRepository.revokeAllByUserId(userId);
        user.withdraw();
        log.info("회원탈퇴 완료: userId={}", userId);
    }
}
