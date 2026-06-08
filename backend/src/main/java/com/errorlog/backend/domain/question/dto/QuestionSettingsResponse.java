package com.errorlog.backend.domain.question.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QuestionSettingsResponse {
    private Long userId;
    private Long price;
    private String description;
}
