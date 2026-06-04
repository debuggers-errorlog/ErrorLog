package com.errorlog.backend.domain.admin.dto;

import com.errorlog.backend.domain.post.entity.Post;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PostSearchConditionDto {
    private String title;                 // 제목 부분검색
    private Post.Status status;           // ACTIVE / HIDDEN (DELETED 기본 제외)
    private Post.Visibility visibility;   // PUBLIC / SUBSCRIBERS
    private LocalDate createdFrom;
    private LocalDate createdTo;
}