package com.errorlog.backend.domain.auth.controller;

import com.errorlog.backend.domain.auth.dto.LoginRequest;
import com.errorlog.backend.domain.auth.dto.PasswordResetRequest;
import com.errorlog.backend.domain.auth.dto.SendVerificationEmailRequest;
import com.errorlog.backend.domain.auth.dto.SignUpRequest;
import com.errorlog.backend.domain.auth.dto.TokenResponse;
import com.errorlog.backend.domain.auth.dto.WithdrawRequest;
import com.errorlog.backend.domain.auth.service.AuthService;
import com.errorlog.backend.domain.auth.service.EmailVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailVerificationService emailVerificationService;

    // 이메일 인증 코드 발송 (회원가입 / 비밀번호 재설정 공용)
    // POST /api/auth/email/verification
    @PostMapping("/email/verification")
    public ResponseEntity<Void> sendVerificationEmail(
            @Valid @RequestBody SendVerificationEmailRequest request
    ) {
        emailVerificationService.sendVerificationCode(request.email(), request.purpose());
        return ResponseEntity.ok().build();
    }

    // 비밀번호 재설정
    // POST /api/auth/password/reset
    @PostMapping("/password/reset")
    public ResponseEntity<Void> resetPassword(
            @Valid @RequestBody PasswordResetRequest request
    ) {
        authService.resetPassword(request);
        return ResponseEntity.ok().build();
    }

    // 회원가입
    // POST /api/auth/signup
    @PostMapping("/signup")
    public ResponseEntity<Void> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        authService.signUp(request);
        return ResponseEntity.ok().build();
    }

    // 로그인
    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }

    // Access Token 재발급
    // POST /api/auth/reissue
    @PostMapping("/reissue")
    public ResponseEntity<TokenResponse> reissue(
            @RequestHeader("Authorization") String authHeader
    ) {
        String refreshToken = authHeader.substring(7);
        return ResponseEntity.ok(authService.reissue(refreshToken));
    }

    // 로그아웃
    // POST /api/auth/logout
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        authService.logout(token);
        return ResponseEntity.ok().build();
    }

    // 회원탈퇴
    // DELETE /api/auth/withdraw
    @DeleteMapping("/withdraw")
    public ResponseEntity<Void> withdraw(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody WithdrawRequest request
    ) {
        authService.withdraw(userId, request);
        return ResponseEntity.ok().build();
    }
}

