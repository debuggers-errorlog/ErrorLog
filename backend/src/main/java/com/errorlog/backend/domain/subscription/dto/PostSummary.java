package com.errorlog.backend.domain.subscription.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostSummary {
    // 게시글 목록
    private Long id;
    private String title;
}
