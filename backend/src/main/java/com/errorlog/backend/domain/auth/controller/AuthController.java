package com.errorlog.backend.domain.auth.controller;

import com.errorlog.backend.domain.auth.dto.LoginRequest;
import com.errorlog.backend.domain.auth.dto.SendVerificationEmailRequest;
import com.errorlog.backend.domain.auth.dto.SignUpRequest;
import com.errorlog.backend.domain.auth.dto.TokenResponse;
import com.errorlog.backend.domain.auth.service.AuthService;
import com.errorlog.backend.domain.auth.service.EmailVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailVerificationService emailVerificationService;

    // 이메일 인증 코드 발송
    // POST /api/auth/email/verification
    @PostMapping("/email/verification")
    public ResponseEntity<Void> sendVerificationEmail(
            @Valid @RequestBody SendVerificationEmailRequest request
    ) {
        emailVerificationService.sendVerificationCode(request.email());
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
}
