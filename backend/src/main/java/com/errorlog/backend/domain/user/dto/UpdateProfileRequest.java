package com.errorlog.backend.domain.user.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(

        @Size(min = 2, max = 20, message = "닉네임은 2~20자 사이여야 합니다.")
        String nickname,

        @Pattern(
                regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+=-]).{8,20}$",
                message = "비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자여야 합니다."
        )
        String password,

        @Size(max = 150, message = "한 줄 소개는 150자 이내여야 합니다.")
        String bio,

        @Size(max = 255, message = "링크는 255자 이내여야 합니다.")
        String link
) {}
