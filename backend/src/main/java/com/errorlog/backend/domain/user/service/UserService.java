package com.errorlog.backend.domain.user.service;

import com.errorlog.backend.domain.board.domain.dto.PostSummaryResponse;
import com.errorlog.backend.domain.board.domain.enums.PostStatus;
import com.errorlog.backend.domain.board.repository.PostRepository;
import com.errorlog.backend.domain.user.dto.UpdateProfileRequest;
import com.errorlog.backend.domain.user.dto.UserProfileResponse;
import com.errorlog.backend.domain.user.entity.User;
import com.errorlog.backend.domain.user.repository.UserRepository;
import com.errorlog.backend.global.exception.AppException;
import com.errorlog.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PostRepository postRepository;

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

        if (StringUtils.hasText(request.nickname()) && !request.nickname().equals(user.getNickname())) {
            if (userRepository.existsByNickname(request.nickname())) {
                throw new AppException(ErrorCode.DUPLICATE_NICKNAME);
            }
            user.updateNickname(request.nickname());
        }

        if (StringUtils.hasText(request.password())) {
            user.updatePassword(passwordEncoder.encode(request.password()));
        }

        String bio = request.bio() != null ? request.bio() : user.getBio();
        String link = request.link() != null ? request.link() : user.getLink();
        user.updateProfile(bio, link);

        return UserProfileResponse.from(user);
    }

    @Transactional(readOnly = true)
    public Page<PostSummaryResponse> getMyPosts(Long userId, Pageable pageable) {
        return postRepository.findByUserIdAndStatus(userId, PostStatus.ACTIVE, pageable)
                .map(post -> PostSummaryResponse.from(post, false));
    }
}
