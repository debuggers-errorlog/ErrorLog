package com.errorlog.backend.domain.question.service;

import com.errorlog.backend.domain.board.domain.entity.Image;
import com.errorlog.backend.domain.board.domain.enums.ImageTargetType;
import com.errorlog.backend.domain.board.repository.ImageRepository;
import com.errorlog.backend.domain.payment.enums.PaymentStatus;
import com.errorlog.backend.domain.payment.enums.PaymentType;
import com.errorlog.backend.domain.payment.service.PaymentService;
import com.errorlog.backend.domain.question.dto.AnswerDto;
import com.errorlog.backend.domain.question.dto.QuestionDto;
import com.errorlog.backend.domain.question.dto.QuestionRequestDto;
import com.errorlog.backend.domain.question.entity.Answer;
import com.errorlog.backend.domain.question.entity.Answer.AuthorRole;
import com.errorlog.backend.domain.question.entity.Question;
import com.errorlog.backend.domain.question.entity.Question.QuestionStatus;
import com.errorlog.backend.domain.question.entity.QuestionRequest;
import com.errorlog.backend.domain.question.entity.QuestionRequest.Status;
import com.errorlog.backend.domain.question.repository.AnswerRepository;
import com.errorlog.backend.domain.question.repository.QuestionRepository;
import com.errorlog.backend.domain.question.repository.QuestionRequestRepository;
import com.errorlog.backend.domain.user.entity.User;
import com.errorlog.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionService {

    private final QuestionRequestRepository requestRepo;
    private final QuestionRepository questionRepo;
    private final AnswerRepository answerRepo;
    private final UserRepository userRepository;
    private final ImageRepository imageRepository;
    private final PaymentService paymentService;
    private final QuestionRequestStatusUpdater statusUpdater;

    private String getNickname(Long userId) {
        return userRepository.findById(userId)
                .map(User::getNickname)
                .orElse("알 수 없음");
    }

    /* ═══════════════════════════════════════════════════
       1. 질문 요청 (질문자 → 답변자)
    ════════════════════════════════════════════════════ */

    @Transactional
    public QuestionRequestDto.RequestItem sendRequest(
            Long requesterId, QuestionRequestDto.SendRequest dto) {

        if (requesterId.equals(dto.getReceiverId()))
            throw new IllegalArgumentException("자기 자신에게 질문 요청을 보낼 수 없습니다.");

        QuestionRequest saved = requestRepo.save(
                QuestionRequest.builder()
                        .requesterId(requesterId)
                        .receiverId(dto.getReceiverId())
                        .title(dto.getTitle())
                        .content(dto.getContent())
                        .build()
        );

        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            List<Image> images = new ArrayList<>();
            for (int i = 0; i < dto.getImageUrls().size(); i++) {
                images.add(Image.createRequestImage(
                        saved.getId(),
                        dto.getImageUrls().get(i),
                        i + 1));
            }
            imageRepository.saveAll(images);
        }

        return toRequestItem(saved);
    }

    /** 내가 보낸 요청 목록 (질문자 탭) */
    public List<QuestionRequestDto.RequestItem> getSentRequests(Long requesterId) {
        return requestRepo.findByRequesterIdOrderByCreatedAtDesc(requesterId)
                .stream().map(this::toRequestItem).collect(Collectors.toList());
    }

    /** 내가 받은 요청 목록 (답변자 탭) */
    public List<QuestionRequestDto.RequestItem> getReceivedRequests(Long receiverId) {
        return requestRepo.findByReceiverIdOrderByCreatedAtDesc(receiverId)
                .stream().map(this::toRequestItem).collect(Collectors.toList());
    }

    /** 요청 상세 조회 */
    public QuestionRequestDto.RequestDetail getRequestDetail(Long requestId, Long userId) {
        QuestionRequest qr = findRequest(requestId);
        checkRequestParticipant(qr, userId);

        List<String> imageUrls = imageRepository
                .findByTargetTypeAndTargetIdOrderByImageSeqAsc(ImageTargetType.REQUEST, requestId)
                .stream()
                .map(Image::getImagePath)
                .collect(Collectors.toList());

        return QuestionRequestDto.RequestDetail.builder()
                .id(qr.getId())
                .requesterId(qr.getRequesterId())
                .requesterNickname(getNickname(qr.getRequesterId()))
                .receiverId(qr.getReceiverId())
                .receiverNickname(getNickname(qr.getReceiverId()))
                .title(qr.getTitle())
                .content(qr.getContent())
                .status(qr.getStatus())
                .createdAt(qr.getCreatedAt())
                .imageUrls(imageUrls)
                .build();
    }

    /* ═══════════════════════════════════════════════════
       2. 수락 / 거절 / 취소
    ════════════════════════════════════════════════════ */

    /**
     * [답변자] 요청 수락 → questions 레코드 생성
     */
    @Transactional
    public QuestionDto.QuestionDetail acceptRequest(Long requestId, Long mentorId) {

        QuestionRequest qr = findRequest(requestId);

        if (!qr.getReceiverId().equals(mentorId))
            throw new IllegalArgumentException("해당 요청의 수신자가 아닙니다.");
        if (qr.getStatus() != Status.PENDING)
            throw new IllegalStateException("이미 처리된 요청입니다.");

        // 결제 성공 → 수락
        qr.accept();

        Question question = questionRepo.save(
                Question.builder()
                        .requestId(qr.getId())
                        .userId(qr.getRequesterId())
                        .mentorId(qr.getReceiverId())
                        .title(qr.getTitle())
                        .content(qr.getContent())
                        .build()
        );

        try {
            paymentService.record(
                    qr.getRequesterId(),
                    question.getId(),
                    PaymentType.QUESTION,
                    0L,                  // 가격 확정되면 교체
                    PaymentStatus.PAID
            );
        } catch (Exception e) {
            // 결제 실패 → 별도 트랜잭션으로 REJECTED 커밋
            statusUpdater.rejectByPaymentFailure(requestId);
            // 현재 트랜잭션 롤백됨
            throw new IllegalStateException("결제 실패로 요청이 거절되었습니다.");
        }
        return toQuestionDetail(question, List.of());
    }

    /** [답변자] 요청 거절 */
    @Transactional
    public void rejectRequest(Long requestId, Long mentorId) {
        QuestionRequest qr = findRequest(requestId);
        if (!qr.getReceiverId().equals(mentorId))
            throw new IllegalArgumentException("해당 요청의 수신자가 아닙니다.");
        if (qr.getStatus() != Status.PENDING)
            throw new IllegalStateException("이미 처리된 요청입니다.");
        qr.reject();
    }

    /** [질문자] 요청 취소 */
    @Transactional
    public void cancelRequest(Long requestId, Long requesterId) {
        QuestionRequest qr = findRequest(requestId);
        if (!qr.getRequesterId().equals(requesterId))
            throw new IllegalArgumentException("해당 요청의 요청자가 아닙니다.");
        if (qr.getStatus() != Status.PENDING)
            throw new IllegalStateException("이미 처리된 요청은 취소할 수 없습니다.");
        qr.cancel();
    }

    /* ═══════════════════════════════════════════════════
       3. 질문 조회
    ════════════════════════════════════════════════════ */

    /** 질문 상세 + 답변 목록 (질문자·답변자 모두 접근 가능) */
    public QuestionDto.QuestionDetail getQuestionDetail(Long questionId, Long userId) {
        Question q = findQuestion(questionId);
        checkQuestionParticipant(q, userId);

        List<AnswerDto.AnswerItem> answers =
                answerRepo.findByQuestionIdOrderByCreatedAtAsc(questionId)
                        .stream()
                        .map(a -> AnswerDto.AnswerItem.from(a, getNickname(a.getAuthorId())))
                        .collect(Collectors.toList());

        return toQuestionDetail(q, answers);
    }

    /** 내가 질문자로 참여한 목록 */
    public List<QuestionDto.QuestionItem> getMyQuestionsAsAsker(Long userId) {
        return questionRepo.findByUserIdAndStatusOrderByCreatedAtDesc(userId, QuestionStatus.ACTIVE)
                .stream().map(this::toQuestionItem).collect(Collectors.toList());
    }

    /** 내가 답변자(멘토)로 참여한 목록 */
    public List<QuestionDto.QuestionItem> getMyQuestionsAsMentor(Long mentorId) {
        return questionRepo.findByMentorIdAndStatusOrderByCreatedAtDesc(mentorId, QuestionStatus.ACTIVE)
                .stream().map(this::toQuestionItem).collect(Collectors.toList());
    }

    /* ═══════════════════════════════════════════════════
       4. 답변 CRUD (질문자·답변자 모두 가능)
    ════════════════════════════════════════════════════ */

    /**
     * 답변 작성
     * - 질문자(userId) 또는 답변자(mentorId) 만 작성 가능
     */
    @Transactional
    public AnswerDto.AnswerItem writeAnswer(
            Long questionId, Long authorId, AnswerDto.WriteRequest dto) {

        Question q = findQuestion(questionId);
        checkQuestionParticipant(q, authorId);

        // 작성자 역할 판단
        AuthorRole role = q.getUserId().equals(authorId)
                ? AuthorRole.ASKER
                : AuthorRole.MENTOR;

        Answer saved = answerRepo.save(
                Answer.builder()
                        .questionId(questionId)
                        .authorId(authorId)
                        .authorRole(role)
                        .content(dto.getContent())
                        .build()
        );

        return AnswerDto.AnswerItem.from(saved, getNickname(authorId));
    }

    /**
     * 답변 수정 (자신이 작성한 것만)
     */
    @Transactional
    public AnswerDto.AnswerItem updateAnswer(
            Long answerId, Long authorId, AnswerDto.WriteRequest dto) {

        Answer answer = findAnswer(answerId);
        if (!answer.getAuthorId().equals(authorId))
            throw new IllegalArgumentException("수정 권한이 없습니다.");

        answer.update(dto.getContent());
        return AnswerDto.AnswerItem.from(answer, getNickname(authorId));
    }

    /**
     * 답변 삭제 (자신이 작성한 것만)
     */
    @Transactional
    public void deleteAnswer(Long answerId, Long authorId) {
        Answer answer = findAnswer(answerId);
        if (!answer.getAuthorId().equals(authorId))
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        answerRepo.delete(answer);
    }

    /* ═══════════════════════════════════════════════════
       헬퍼 — 조회 & 권한 체크
    ════════════════════════════════════════════════════ */

    private QuestionRequest findRequest(Long id) {
        return requestRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 요청입니다. id=" + id));
    }

    private Question findQuestion(Long id) {
        return questionRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 질문입니다. id=" + id));
    }

    private Answer findAnswer(Long id) {
        return answerRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 답변입니다. id=" + id));
    }

    private void checkRequestParticipant(QuestionRequest qr, Long userId) {
        if (!qr.getRequesterId().equals(userId) && !qr.getReceiverId().equals(userId))
            throw new IllegalArgumentException("접근 권한이 없습니다.");
    }

    private void checkQuestionParticipant(Question q, Long userId) {
        if (!q.getUserId().equals(userId) && !q.getMentorId().equals(userId))
            throw new IllegalArgumentException("접근 권한이 없습니다.");
    }

    /* ═══════════════════════════════════════════════════
       헬퍼 — DTO 변환
    ════════════════════════════════════════════════════ */

    private QuestionRequestDto.RequestItem toRequestItem(QuestionRequest qr) {
        return QuestionRequestDto.RequestItem.builder()
                .id(qr.getId())
                .requesterId(qr.getRequesterId())
                .requesterNickname(getNickname(qr.getRequesterId()))
                .receiverId(qr.getReceiverId())
                .receiverNickname(getNickname(qr.getReceiverId()))
                .title(qr.getTitle())
                .status(qr.getStatus())
                .createdAt(qr.getCreatedAt())
                .build();
    }

    private QuestionDto.QuestionItem toQuestionItem(Question q) {
        int cnt = answerRepo.findByQuestionIdOrderByCreatedAtAsc(q.getId()).size();
        return QuestionDto.QuestionItem.builder()
                .id(q.getId())
                .title(q.getTitle())
                .askerNickname(getNickname(q.getUserId()))
                .mentorNickname(getNickname(q.getMentorId()))
                .status(q.getStatus())
                .answerCount(cnt)
                .createdAt(q.getCreatedAt())
                .build();
    }

    private QuestionDto.QuestionDetail toQuestionDetail(
            Question q, List<AnswerDto.AnswerItem> answers) {
        return QuestionDto.QuestionDetail.builder()
                .id(q.getId())
                .requestId(q.getRequestId())
                .title(q.getTitle())
                .content(q.getContent())
                .askerId(q.getUserId())
                .askerNickname(getNickname(q.getUserId()))
                .mentorId(q.getMentorId())
                .mentorNickname(getNickname(q.getMentorId()))
                .status(q.getStatus())
                .createdAt(q.getCreatedAt())
                .answers(answers)
                .build();
    }
}
