package com.errorlog.backend.domain.auth.dto;

import com.errorlog.backend.domain.auth.service.EmailVerificationService.Purpose;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SendVerificationEmailRequest(

        @NotBlank(message = "이메일을 입력해주세요.")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        String email,

        @NotNull(message = "purpose를 입력해주세요.")
        Purpose purpose
) {}
