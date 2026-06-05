package com.errorlog.backend.domain.payment.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PaymentCancelRequest {
    private Long userId;
    private Long creatorId;
}
