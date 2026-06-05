package com.errorlog.backend.domain.auth.dto;

public record WithdrawRequest(
        String password  // LOCAL 유저만 필수, GOOGLE 유저는 null 가능
) {}
