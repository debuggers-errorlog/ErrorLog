package com.errorlog.backend.domain.admin.dto;

import com.errorlog.backend.domain.board.domain.enums.PostStatus;
import com.errorlog.backend.domain.board.domain.enums.PostVisibility;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PostSearchConditionDto {
    private String title;                 // 제목 부분검색
    private PostStatus status;           // ACTIVE / HIDDEN (DELETED 기본 제외)
    private PostVisibility visibility;   // PUBLIC / SUBSCRIBERS
    private LocalDate createdFrom;
    private LocalDate createdTo;
}