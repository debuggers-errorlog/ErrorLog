package com.errorlog.backend.domain.admin.controller;

import com.errorlog.backend.domain.admin.dto.QuestionRequestListResponseDto;
import com.errorlog.backend.domain.admin.dto.QuestionRequestSearchConditionDto;
import com.errorlog.backend.domain.admin.service.QuestionRequestAdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/question-requests")
public class QuestionRequestAdminController {

    private final QuestionRequestAdminService service;

    public QuestionRequestAdminController(QuestionRequestAdminService service) {
        this.service = service;
    }

    @GetMapping
    public Page<QuestionRequestListResponseDto> search(
            @ModelAttribute QuestionRequestSearchConditionDto condition,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return service.search(condition, pageable);
    }

    @PatchMapping("/{requestId}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long requestId) {
        service.cancel(requestId);
        return ResponseEntity.noContent().build();
    }
}