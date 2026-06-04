package com.errorlog.backend.domain.user.service;

import com.errorlog.backend.domain.user.dto.UpdateProfileRequest;
import com.errorlog.backend.domain.user.dto.UserProfileResponse;
import com.errorlog.backend.domain.user.entity.User;
import com.errorlog.backend.domain.user.repository.UserRepository;
import com.errorlog.backend.global.exception.AppException;
import com.errorlog.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserProfileResponse getMyProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return UserProfileResponse.from(user);
    }

    @Transactional
    public UserProfileResponse updateMyProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 닉네임 변경
        if (StringUtils.hasText(request.nickname()) && !request.nickname().equals(user.getNickname())) {
            if (userRepository.existsByNickname(request.nickname())) {
                throw new AppException(ErrorCode.DUPLICATE_NICKNAME);
            }
            user.updateNickname(request.nickname());
        }

        // 비밀번호 변경
        if (StringUtils.hasText(request.password())) {
            user.updatePassword(passwordEncoder.encode(request.password()));
        }

        // 한 줄 소개 / 링크 변경 (null이면 기존 값 유지)
        String bio = request.bio() != null ? request.bio() : user.getBio();
        String link = request.link() != null ? request.link() : user.getLink();
        user.updateProfile(bio, link);

        return UserProfileResponse.from(user);
    }
}
