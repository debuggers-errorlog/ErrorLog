package com.errorlog.backend.domain.question.controller;

import com.errorlog.backend.domain.question.entity.Image;
import com.errorlog.backend.domain.question.service.ImageService;
import com.errorlog.backend.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/images") @RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    /**
     * POST /api/images/QUESTION/{targetId}
     * POST /api/images/ANSWER/{targetId}
     * form-data: files (MultipartFile[])
     */
    @PostMapping("/{targetType}/{targetId}")
    public ResponseEntity<ApiResponse<List<String>>> upload(
            @PathVariable Image.TargetType targetType,
            @PathVariable Long targetId,
            @RequestParam("files") List<MultipartFile> files) throws IOException {

        List<String> paths = imageService.uploadImages(targetType, targetId, files);
        return ResponseEntity.ok(ApiResponse.ok("업로드 완료", paths));
    }
}