package com.errorlog.backend.domain.subscription.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
// 내가 구독하는 사람 목록
public class FollowingResponse {
    private Long creatorId;
    private String creatorName;
    private LocalDateTime expiredAt;
}
