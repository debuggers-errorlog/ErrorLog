package com.errorlog.backend.domain.question.repository;

import com.errorlog.backend.domain.question.entity.QuestionSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuestionSettingsRepository extends JpaRepository<QuestionSettings, Long> {
    Optional<QuestionSettings> findByUserId(Long userId);
}
