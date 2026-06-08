package com.errorlog.backend.domain.question.service;

import com.errorlog.backend.domain.question.dto.QuestionSettingsRequest;
import com.errorlog.backend.domain.question.dto.QuestionSettingsResponse;
import com.errorlog.backend.domain.question.entity.QuestionSettings;
import com.errorlog.backend.domain.question.repository.QuestionSettingsRepository;
import com.errorlog.backend.global.exception.AppException;
import com.errorlog.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QuestionSettingsService {
    private final QuestionSettingsRepository questionSettingsRepository;

    @Transactional(readOnly = true)
    public QuestionSettingsResponse getSettings(Long mentorId) {
        QuestionSettings settings = questionSettingsRepository
                .findByUserId(mentorId)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_SETTINGS_NOT_FOUND));
        return toResponse(settings);
    }

    @Transactional(readOnly = true)
    public Long getPriceOrThrow(Long mentorId) {
        return questionSettingsRepository.findByUserId(mentorId)
                .map(QuestionSettings::getPrice)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_SETTINGS_NOT_FOUND));
    }

    @Transactional
    public void saveSettings(Long userId, QuestionSettingsRequest request) {
        validateRequest(request);
        QuestionSettings settings = questionSettingsRepository
                .findByUserId(userId)
                .orElseGet(() -> QuestionSettings.builder().userId(userId).build());
        settings.update(request.getPrice(), request.getDescription());
        questionSettingsRepository.save(settings);
    }

    private void validateRequest(QuestionSettingsRequest request) {
        if (request.getPrice() == null || request.getPrice() <= 0) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        if (request.getDescription() == null || request.getDescription().isBlank()) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
    }

    private QuestionSettingsResponse toResponse(QuestionSettings settings) {
        return new QuestionSettingsResponse(
                settings.getUserId(),
                settings.getPrice(),
                settings.getDescription()
        );
    }
}
