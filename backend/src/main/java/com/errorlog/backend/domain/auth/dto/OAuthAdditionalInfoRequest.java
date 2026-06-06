package com.errorlog.backend.domain.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OAuthAdditionalInfoRequest(

        @NotBlank(message = "닉네임을 입력해주세요.")
        @Size(min = 2, max = 20, message = "닉네임은 2~20자 사이여야 합니다.")
        String nickname,

        @Size(max = 150, message = "한 줄 소개는 150자 이내여야 합니다.")
        String bio,

        @Size(max = 255, message = "링크는 255자 이내여야 합니다.")
        String link
) {}
