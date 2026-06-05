package com.errorlog.backend.domain.subscription.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
// 나를 구독하는 사람 목록
public class FollowerResponse {
    private Long subscriberId;
    private String subscriberName;
    private LocalDateTime createdAt;
}
