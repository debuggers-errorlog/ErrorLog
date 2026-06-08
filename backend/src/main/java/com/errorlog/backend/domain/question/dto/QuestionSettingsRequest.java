package com.errorlog.backend.domain.question.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class QuestionSettingsRequest {
    private Long price;
    private String description;
}
