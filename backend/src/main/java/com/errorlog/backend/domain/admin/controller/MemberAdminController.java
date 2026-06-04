package com.errorlog.backend.domain.admin.controller;

import com.errorlog.backend.domain.admin.dto.MemberListResponseDto;
import com.errorlog.backend.domain.admin.dto.MemberSearchConditionDto;
import com.errorlog.backend.domain.admin.service.MemberAdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/members")
public class MemberAdminController {

    private final MemberAdminService memberAdminService;

    public MemberAdminController(MemberAdminService memberAdminService) {
        this.memberAdminService = memberAdminService;
    }

    @GetMapping
    public Page<MemberListResponseDto> search(
            @ModelAttribute MemberSearchConditionDto condition,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        // 정렬은 MemberAdminQueryRepository에서 createdAt 내림차순 고정
        return memberAdminService.searchMembers(condition, pageable);
    }

    @PatchMapping("/{memberId}/suspend")
    public ResponseEntity<Void> suspend(@PathVariable Long memberId) {
        memberAdminService.suspendMember(memberId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{memberId}/restore")
    public ResponseEntity<Void> restore(@PathVariable Long memberId) {
        memberAdminService.restoreMember(memberId);
        return ResponseEntity.noContent().build();
    }
}
