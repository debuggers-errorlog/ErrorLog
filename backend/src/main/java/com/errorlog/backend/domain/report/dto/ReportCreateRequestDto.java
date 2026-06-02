package com.errorlog.backend.domain.report.dto;

import com.errorlog.backend.domain.report.entity.ReportReasonCategory;
import com.errorlog.backend.domain.report.entity.ReportTargetType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReportCreateRequestDto {

    @NotNull
    private ReportTargetType targetType;  // USER / POST / COMMENT

    @NotNull
    private Long targetId;                 // 신고 대상의 id

    @NotNull
    private ReportReasonCategory reasonCategory;

    private String reasonDetail;           // 선택 (NULL 허용)
}