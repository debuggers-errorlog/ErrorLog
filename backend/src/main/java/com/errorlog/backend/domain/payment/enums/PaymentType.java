package com.errorlog.backend.domain.payment.enums;

public enum PaymentType {

    SUBSCRIPTION("구독"),
    QUESTION("질문");

    private final String description;

    PaymentType(String description) {
        this.description = description;
    }
}
