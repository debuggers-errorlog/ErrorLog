package com.errorlog.backend.domain.user.dto;

import com.errorlog.backend.domain.user.entity.User;

public record UserProfileResponse(
        Long id,
        String email,
        String nickname,
        String bio,
        String link,
        String role,
        String status
) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getBio(),
                user.getLink(),
                user.getRole().name(),
                user.getStatus().name()
        );
    }
}
