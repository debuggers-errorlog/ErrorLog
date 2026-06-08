package com.errorlog.backend.domain.question.controller;

import com.errorlog.backend.domain.question.dto.QuestionSettingsRequest;
import com.errorlog.backend.domain.question.dto.QuestionSettingsResponse;
import com.errorlog.backend.domain.question.service.QuestionSettingsService;
import com.errorlog.backend.global.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/question-settings")
@RequiredArgsConstructor
public class QuestionSettingsController {
    private final QuestionSettingsService questionSettingsService;

    @GetMapping("/me")
    public ResponseEntity<QuestionSettingsResponse> getMySettings() {
        Long userId = SecurityUtils.requireUserId();
        return ResponseEntity.ok(questionSettingsService.getSettings(userId));
    }

    @GetMapping("/{mentorId}")
    public ResponseEntity<QuestionSettingsResponse> getSettings(@PathVariable Long mentorId) {
        return ResponseEntity.ok(questionSettingsService.getSettings(mentorId));
    }

    @PostMapping("/me")
    public ResponseEntity<Void> saveMySettings(@RequestBody QuestionSettingsRequest request) {
        Long userId = SecurityUtils.requireUserId();
        questionSettingsService.saveSettings(userId, request);
        return ResponseEntity.ok().build();
    }
}
