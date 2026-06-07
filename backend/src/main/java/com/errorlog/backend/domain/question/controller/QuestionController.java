package com.errorlog.backend.domain.question.controller;

import com.errorlog.backend.domain.question.dto.AnswerDto;
import com.errorlog.backend.domain.question.dto.QuestionDto;
import com.errorlog.backend.domain.question.dto.QuestionRequestDto;
import com.errorlog.backend.domain.question.service.QuestionService;
import com.errorlog.backend.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    // ── 질문 요청 ────────────────────────────────────────────────────

    @PostMapping("/requests")
    public ResponseEntity<ApiResponse<QuestionRequestDto.RequestItem>> sendRequest(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody QuestionRequestDto.SendRequest dto) {

        return ResponseEntity.ok(
                ApiResponse.ok("질문 요청을 보냈습니다.",
                        questionService.sendRequest(userId, dto)));
    }

    @GetMapping("/requests/sent")
    public ResponseEntity<ApiResponse<List<QuestionRequestDto.RequestItem>>> getSentRequests(
            @AuthenticationPrincipal Long userId) {

        return ResponseEntity.ok(ApiResponse.ok(
                questionService.getSentRequests(userId)));
    }

    @GetMapping("/requests/received")
    public ResponseEntity<ApiResponse<List<QuestionRequestDto.RequestItem>>> getReceivedRequests(
            @AuthenticationPrincipal Long userId) {

        return ResponseEntity.ok(ApiResponse.ok(
                questionService.getReceivedRequests(userId)));
    }

    @GetMapping("/requests/{requestId}")
    public ResponseEntity<ApiResponse<QuestionRequestDto.RequestDetail>> getRequestDetail(
            @PathVariable Long requestId,
            @AuthenticationPrincipal Long userId) {

        return ResponseEntity.ok(ApiResponse.ok(
                questionService.getRequestDetail(requestId, userId)));
    }

    // ── 수락 / 거절 / 취소 ──────────────────────────────────────────

    @PostMapping("/requests/{requestId}/accept")
    public ResponseEntity<ApiResponse<QuestionDto.QuestionDetail>> acceptRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal Long userId) {

        return ResponseEntity.ok(
                ApiResponse.ok("요청을 수락했습니다.",
                        questionService.acceptRequest(requestId, userId)));
    }

    @PostMapping("/requests/{requestId}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal Long userId) {

        questionService.rejectRequest(requestId, userId);
        return ResponseEntity.ok(ApiResponse.ok("요청을 거절했습니다.", null));
    }

    @DeleteMapping("/requests/{requestId}")
    public ResponseEntity<ApiResponse<Void>> cancelRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal Long userId) {

        questionService.cancelRequest(requestId, userId);
        return ResponseEntity.ok(ApiResponse.ok("요청을 취소했습니다.", null));
    }

    // ── 질문 조회 ───────────────────────────────────────────────────

    @GetMapping("/{questionId}")
    public ResponseEntity<ApiResponse<QuestionDto.QuestionDetail>> getQuestionDetail(
            @PathVariable Long questionId,
            @AuthenticationPrincipal Long userId) {

        return ResponseEntity.ok(ApiResponse.ok(
                questionService.getQuestionDetail(questionId, userId)));
    }

    @GetMapping("/my/asker")
    public ResponseEntity<ApiResponse<List<QuestionDto.QuestionItem>>> getMyQuestionsAsAsker(
            @AuthenticationPrincipal Long userId) {

        return ResponseEntity.ok(ApiResponse.ok(
                questionService.getMyQuestionsAsAsker(userId)));
    }

    @GetMapping("/my/mentor")
    public ResponseEntity<ApiResponse<List<QuestionDto.QuestionItem>>> getMyQuestionsAsMentor(
            @AuthenticationPrincipal Long userId) {

        return ResponseEntity.ok(ApiResponse.ok(
                questionService.getMyQuestionsAsMentor(userId)));
    }

    // ── 답변 CRUD ───────────────────────────────────────────────────

    @PostMapping("/{questionId}/answers")
    public ResponseEntity<ApiResponse<AnswerDto.AnswerItem>> writeAnswer(
            @PathVariable Long questionId,
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody AnswerDto.WriteRequest dto) {

        return ResponseEntity.ok(
                ApiResponse.ok("답변을 작성했습니다.",
                        questionService.writeAnswer(questionId, userId, dto)));
    }

    @PutMapping("/answers/{answerId}")
    public ResponseEntity<ApiResponse<AnswerDto.AnswerItem>> updateAnswer(
            @PathVariable Long answerId,
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody AnswerDto.WriteRequest dto) {

        return ResponseEntity.ok(
                ApiResponse.ok("답변을 수정했습니다.",
                        questionService.updateAnswer(answerId, userId, dto)));
    }

    @DeleteMapping("/answers/{answerId}")
    public ResponseEntity<ApiResponse<Void>> deleteAnswer(
            @PathVariable Long answerId,
            @AuthenticationPrincipal Long userId) {

        questionService.deleteAnswer(answerId, userId);
        return ResponseEntity.ok(ApiResponse.ok("답변을 삭제했습니다.", null));
    }

    @PostMapping("/{questionId}/close")
    public ResponseEntity<ApiResponse<Void>> closeQuestion(
            @PathVariable Long questionId,
            @AuthenticationPrincipal Long userId) {
        questionService.closeQuestion(questionId, userId);
        return ResponseEntity.ok(ApiResponse.ok("질문이 종료되었습니다.", null));
    }
}
