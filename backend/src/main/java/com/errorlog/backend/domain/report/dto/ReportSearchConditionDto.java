package com.errorlog.backend.domain.report.dto;

import com.errorlog.backend.domain.report.entity.ReportReasonCategory;
import com.errorlog.backend.domain.report.entity.ReportStatus;
import com.errorlog.backend.domain.report.entity.ReportTargetType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class ReportSearchConditionDto {

    private ReportStatus status;          // 처리 상태 (PENDING / RESOLVED / REJECTED)
    private ReportTargetType targetType;  // 대상 종류 (USER / POST / COMMENT)
    private ReportReasonCategory reasonCategory; // 사유 분류

    // 접수일 기간 (둘 다 선택). from만, to만, 둘 다, 혹은 둘 다 없음 모두 허용.
    private LocalDate createdFrom;
    private LocalDate createdTo;
}