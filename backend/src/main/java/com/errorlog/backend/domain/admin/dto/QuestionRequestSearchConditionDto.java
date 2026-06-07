package com.errorlog.backend.domain.admin.dto;

import com.errorlog.backend.domain.question.entity.QuestionRequest;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class QuestionRequestSearchConditionDto {
    private QuestionRequest.Status status;   // PENDING / ACCEPTED / REJECTED / CANCELLED
    private String mentorNickname;           // 멘토(receiver) 부분검색
    private LocalDate createdFrom;
    private LocalDate createdTo;
}