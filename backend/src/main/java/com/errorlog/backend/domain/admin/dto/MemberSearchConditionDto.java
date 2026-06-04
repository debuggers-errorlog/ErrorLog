package com.errorlog.backend.domain.admin.dto;

import com.errorlog.backend.domain.user.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MemberSearchConditionDto {
    private String nickname;
    private String email;
    private User.Role role;
    private User.Status status;
    private LocalDate createdFrom;
    private LocalDate createdTo;
}
