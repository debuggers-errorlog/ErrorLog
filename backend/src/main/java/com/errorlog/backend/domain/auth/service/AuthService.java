package com.errorlog.backend.domain.auth.service;

import com.errorlog.backend.domain.auth.dto.LoginRequest;
import com.errorlog.backend.domain.auth.dto.SignUpRequest;
import com.errorlog.backend.domain.auth.dto.TokenResponse;
import com.errorlog.backend.domain.user.entity.User;
import com.errorlog.backend.domain.user.repository.UserRepository;
import com.errorlog.backend.global.exception.AppException;
import com.errorlog.backend.global.exception.ErrorCode;
import com.errorlog.backend.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailVerificationService emailVerificationService;

    @Transactional
    public void signUp(SignUpRequest request) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.email())) {
            throw new AppException(ErrorCode.DUPLICATE_EMAIL);
        }
        // 닉네임 중복 체크
        if (userRepository.existsByNickname(request.nickname())) {
            throw new AppException(ErrorCode.DUPLICATE_NICKNAME);
        }

        // 이메일 인증 코드 검증
        emailVerificationService.verifyCode(request.email(), request.verificationCode());

        // 사용자 저장
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

    @Transactional(readOnly = true)
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        // 상태 검증
        if (user.getStatus() == User.Status.DELETED) {
            throw new AppException(ErrorCode.USER_DELETED);
        }
        if (user.getStatus() == User.Status.SUSPENDED) {
            throw new AppException(ErrorCode.USER_SUSPENDED);
        }

        // 비밀번호 검증
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId(), user.getRole().name());

        return new TokenResponse(accessToken, refreshToken);
    }
}
