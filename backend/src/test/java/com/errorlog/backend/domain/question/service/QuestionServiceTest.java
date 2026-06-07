package com.errorlog.backend.domain.question.service;

import com.errorlog.backend.domain.board.domain.entity.Image;
import com.errorlog.backend.domain.board.domain.enums.ImageTargetType;
import com.errorlog.backend.domain.board.repository.ImageRepository;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

/**
 * QuestionService 단위 테스트
 *
 * ─ 핵심 개념 ───────────────────────────────────────────────────
 *  @Mock          : 실제 DB·외부 서비스 대신 동작하는 가짜 객체입니다.
 *                   "이 메서드가 호출되면 이 값을 돌려줘" 하고 미리 설정합니다.
 *
 *  @InjectMocks   : @Mock 으로 만든 가짜 객체들을 자동으로 주입해서
 *                   QuestionService 를 생성합니다.
 *
 *  given / when / then 패턴
 *    given  - 테스트 환경 설정 (가짜 객체의 반환값 지정)
 *    when   - 실제 메서드 호출
 *    then   - 결과 검증 (assertThat, assertThatThrownBy 등)
 * ──────────────────────────────────────────────────────────────
 */
@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

    // ── Mock 선언 ──────────────────────────────────────────────────
    // [수정] 기존 파일에서 ImageRepository 패키지 경로가 잘못 지정되어 있었습니다.
    //        board 패키지에서 import 해야 합니다.
    @Mock private QuestionRequestRepository requestRepo;
    @Mock private QuestionRepository        questionRepo;
    @Mock private AnswerRepository          answerRepo;
    @Mock private UserRepository            userRepository;
    @Mock private ImageRepository           imageRepository;   // ← board.repository

    // [수정] 아래 두 Mock 이 기존 파일에서 누락되어 있었습니다.
    //        QuestionService 생성자에 포함되는 의존성이므로 반드시 있어야 합니다.
    @Mock private PaymentService                paymentService;
    @Mock private QuestionRequestStatusUpdater  statusUpdater;

    @InjectMocks
    private QuestionService questionService;

    // ── 공통 테스트 데이터 ─────────────────────────────────────────
    private static final Long REQUESTER_ID = 1L;   // 질문자(멘티) ID
    private static final Long RECEIVER_ID  = 2L;   // 답변자(멘토) ID
    private static final Long REQUEST_ID   = 10L;  // 질문 요청 ID
    private static final Long QUESTION_ID  = 20L;  // 질문 ID
    private static final Long ANSWER_ID    = 30L;  // 답변 ID

    private QuestionRequest pendingRequest;   // PENDING 상태 질문 요청
    private Question        activeQuestion;   // ACTIVE 상태 질문
    private Answer          mentorAnswer;     // 멘토가 작성한 답변

    @BeforeEach
    void setUp() {
        // userRepository 는 거의 모든 테스트에서 호출되므로
        // lenient() 로 등록해 "불필요한 Mock 호출 감지" 경고를 방지합니다.
        lenient().when(userRepository.findById(any(Long.class)))
                .thenReturn(Optional.empty());  // 닉네임이 "알 수 없음"으로 표시됩니다.

        // [수정] 기존 파일에서 pendingRequest 빌더가 두 번 호출되어 있었습니다.
        //        아래처럼 한 번만 초기화합니다.
        pendingRequest = QuestionRequest.builder()
                .id(REQUEST_ID)
                .requesterId(REQUESTER_ID)
                .receiverId(RECEIVER_ID)
                .title("스프링 질문입니다")
                .content("JPA 연관관계 설정이 헷갈려요")
                .status(Status.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        activeQuestion = Question.builder()
                .id(QUESTION_ID)
                .requestId(REQUEST_ID)
                .userId(REQUESTER_ID)
                .mentorId(RECEIVER_ID)
                .title("스프링 질문입니다")
                .content("JPA 연관관계 설정이 헷갈려요")
                .status(QuestionStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        mentorAnswer = Answer.builder()
                .id(ANSWER_ID)
                .questionId(QUESTION_ID)
                .authorId(RECEIVER_ID)
                .authorRole(AuthorRole.MENTOR)
                .content("@ManyToOne 을 사용하시면 됩니다!")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }


    // ════════════════════════════════════════════════════════════════
    // 1. 질문 요청 보내기 (sendRequest)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("질문 요청 보내기")
    class SendRequestTest {

        @Test
        @DisplayName("정상적으로 질문 요청을 보낼 수 있다")
        void sendRequest_success() {
            // given
            given(requestRepo.save(any(QuestionRequest.class)))
                    .willReturn(pendingRequest);

            QuestionRequestDto.SendRequest dto = mock(QuestionRequestDto.SendRequest.class);
            given(dto.getReceiverId()).willReturn(RECEIVER_ID);
            given(dto.getTitle()).willReturn("스프링 질문입니다");
            given(dto.getContent()).willReturn("JPA 연관관계 설정이 헷갈려요");
            given(dto.getImageUrls()).willReturn(null);  // 이미지 없이 요청

            // when
            QuestionRequestDto.RequestItem result =
                    questionService.sendRequest(REQUESTER_ID, dto);

            // then
            assertThat(result.getId()).isEqualTo(REQUEST_ID);
            assertThat(result.getRequesterId()).isEqualTo(REQUESTER_ID);
            assertThat(result.getReceiverId()).isEqualTo(RECEIVER_ID);
            assertThat(result.getStatus()).isEqualTo(Status.PENDING);
            assertThat(result.getTitle()).isEqualTo("스프링 질문입니다");

            verify(requestRepo, times(1)).save(any(QuestionRequest.class));
        }

        @Test
        @DisplayName("이미지를 포함한 질문 요청을 보낼 수 있다")
        void sendRequest_withImages() {
            // given
            given(requestRepo.save(any(QuestionRequest.class)))
                    .willReturn(pendingRequest);

            // 이미지 URL 목록이 담긴 요청
            List<String> imageUrls = List.of("https://cdn.example.com/img1.png",
                    "https://cdn.example.com/img2.png");

            QuestionRequestDto.SendRequest dto = mock(QuestionRequestDto.SendRequest.class);
            given(dto.getReceiverId()).willReturn(RECEIVER_ID);
            given(dto.getTitle()).willReturn("스프링 질문입니다");
            given(dto.getContent()).willReturn("JPA 연관관계 설정이 헷갈려요");
            given(dto.getImageUrls()).willReturn(imageUrls);

            // when
            questionService.sendRequest(REQUESTER_ID, dto);

            // then - 이미지가 2건 저장 요청됐는지 확인
            verify(imageRepository, times(1)).saveAll(any());
        }

        // [신규] 기존 파일에 없던 케이스
        @Test
        @DisplayName("자기 자신에게 질문 요청을 보내면 예외가 발생한다")
        void sendRequest_selfRequest_throwsException() {
            // given - receiverId 를 본인 ID 로 설정
            QuestionRequestDto.SendRequest dto = mock(QuestionRequestDto.SendRequest.class);
            given(dto.getReceiverId()).willReturn(REQUESTER_ID);  // 자기 자신

            // when & then
            assertThatThrownBy(() ->
                    questionService.sendRequest(REQUESTER_ID, dto))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("자기 자신에게 질문 요청을 보낼 수 없습니다.");

            // 예외가 발생했으므로 save 는 호출되면 안 됩니다.
            verify(requestRepo, never()).save(any());
        }
    }


    // ════════════════════════════════════════════════════════════════
    // 2. 요청 목록 조회 (getSentRequests / getReceivedRequests)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("요청 목록 조회")
    class GetRequestsTest {

        @Test
        @DisplayName("내가 보낸 요청 목록을 조회할 수 있다")
        void getSentRequests_success() {
            // given
            given(requestRepo.findByRequesterIdOrderByCreatedAtDesc(REQUESTER_ID))
                    .willReturn(List.of(pendingRequest));

            // when
            List<QuestionRequestDto.RequestItem> result =
                    questionService.getSentRequests(REQUESTER_ID);

            // then
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getTitle()).isEqualTo("스프링 질문입니다");
            assertThat(result.get(0).getStatus()).isEqualTo(Status.PENDING);
        }

        @Test
        @DisplayName("내가 받은 요청 목록을 조회할 수 있다")
        void getReceivedRequests_success() {
            // given
            given(requestRepo.findByReceiverIdOrderByCreatedAtDesc(RECEIVER_ID))
                    .willReturn(List.of(pendingRequest));

            // when
            List<QuestionRequestDto.RequestItem> result =
                    questionService.getReceivedRequests(RECEIVER_ID);

            // then
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getReceiverId()).isEqualTo(RECEIVER_ID);
        }

        @Test
        @DisplayName("보낸 요청이 없으면 빈 목록을 반환한다")
        void getSentRequests_empty() {
            // given
            given(requestRepo.findByRequesterIdOrderByCreatedAtDesc(REQUESTER_ID))
                    .willReturn(List.of());

            // when
            List<QuestionRequestDto.RequestItem> result =
                    questionService.getSentRequests(REQUESTER_ID);

            // then
            assertThat(result).isEmpty();
        }
    }


    // ════════════════════════════════════════════════════════════════
    // 3. 요청 상세 조회 (getRequestDetail)  ← [신규] 기존 파일에 없던 섹션
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("요청 상세 조회")
    class GetRequestDetailTest {

        @Test
        @DisplayName("질문자가 자신의 요청 상세를 조회할 수 있다")
        void getRequestDetail_asRequester() {
            // given
            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));
            // 이미지가 없는 경우를 가정
            given(imageRepository.findByTargetTypeAndTargetIdOrderByImageSeqAsc(
                    ImageTargetType.REQUEST, REQUEST_ID))
                    .willReturn(List.of());

            // when
            QuestionRequestDto.RequestDetail result =
                    questionService.getRequestDetail(REQUEST_ID, REQUESTER_ID);

            // then
            assertThat(result.getId()).isEqualTo(REQUEST_ID);
            assertThat(result.getTitle()).isEqualTo("스프링 질문입니다");
            assertThat(result.getStatus()).isEqualTo(Status.PENDING);
            assertThat(result.getImageUrls()).isEmpty();
        }

        @Test
        @DisplayName("답변자(멘토)도 요청 상세를 조회할 수 있다")
        void getRequestDetail_asMentor() {
            // given
            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));
            given(imageRepository.findByTargetTypeAndTargetIdOrderByImageSeqAsc(
                    ImageTargetType.REQUEST, REQUEST_ID))
                    .willReturn(List.of());

            // when - 멘토(RECEIVER_ID) 가 조회
            QuestionRequestDto.RequestDetail result =
                    questionService.getRequestDetail(REQUEST_ID, RECEIVER_ID);

            // then
            assertThat(result.getReceiverId()).isEqualTo(RECEIVER_ID);
        }

        @Test
        @DisplayName("참여자가 아닌 사람이 상세를 조회하면 예외가 발생한다")
        void getRequestDetail_notParticipant() {
            // given
            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));

            // when & then
            assertThatThrownBy(() ->
                    questionService.getRequestDetail(REQUEST_ID, 999L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("접근 권한이 없습니다.");
        }

        @Test
        @DisplayName("존재하지 않는 요청 ID 로 조회하면 예외가 발생한다")
        void getRequestDetail_notFound() {
            // given
            given(requestRepo.findById(999L)).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() ->
                    questionService.getRequestDetail(999L, REQUESTER_ID))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("존재하지 않는 요청입니다");
        }
    }


    // ════════════════════════════════════════════════════════════════
    // 4. 요청 수락 (acceptRequest)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("요청 수락")
    class AcceptRequestTest {

        @Test
        @DisplayName("답변자가 요청을 수락하면 질문이 생성된다")
        void acceptRequest_success() {
            // given
            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));
            given(questionRepo.save(any(Question.class)))
                    .willReturn(activeQuestion);
            // paymentService.record() 는 void 메서드이므로 별도 설정 없이 정상 실행됩니다.

            // [수정] 실제 서비스 메서드는 acceptRequest(requestId, mentorId) 로
            //        DTO 파라미터가 없습니다. 기존 테스트는 잘못된 시그니처를 사용했습니다.
            // when
            QuestionDto.QuestionDetail result =
                    questionService.acceptRequest(REQUEST_ID, RECEIVER_ID);

            // then
            assertThat(result.getTitle()).isEqualTo("스프링 질문입니다");
            assertThat(result.getAskerId()).isEqualTo(REQUESTER_ID);
            assertThat(result.getMentorId()).isEqualTo(RECEIVER_ID);
            assertThat(result.getAnswers()).isEmpty();

            // questionRepo.save() 가 한 번 호출됐는지 확인
            verify(questionRepo, times(1)).save(any(Question.class));
        }

        @Test
        @DisplayName("결제 실패 시 요청이 거절 처리되고 예외가 발생한다")
        void acceptRequest_paymentFails_throwsException() {
            // given
            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));
            given(questionRepo.save(any(Question.class)))
                    .willReturn(activeQuestion);

            // paymentService.record() 가 예외를 던지도록 설정
            doThrow(new RuntimeException("결제 서버 오류"))
                    .when(paymentService).record(any(), any(), any(), any(), any());

            // when & then
            assertThatThrownBy(() ->
                    questionService.acceptRequest(REQUEST_ID, RECEIVER_ID))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("결제 실패로 요청이 거절되었습니다.");

            // 결제 실패 시 statusUpdater 가 호출됐는지 확인
            verify(statusUpdater, times(1)).rejectByPaymentFailure(REQUEST_ID);
        }

        @Test
        @DisplayName("수신자가 아닌 사람이 수락하면 예외가 발생한다")
        void acceptRequest_wrongMentor() {
            // given
            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));

            // when & then - 999L 은 수신자가 아닙니다.
            assertThatThrownBy(() ->
                    questionService.acceptRequest(REQUEST_ID, 999L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("해당 요청의 수신자가 아닙니다.");
        }

        @Test
        @DisplayName("이미 처리된 요청을 수락하면 예외가 발생한다")
        void acceptRequest_alreadyProcessed() {
            // given - 이미 ACCEPTED 상태인 요청
            QuestionRequest acceptedRequest = QuestionRequest.builder()
                    .id(REQUEST_ID)
                    .requesterId(REQUESTER_ID)
                    .receiverId(RECEIVER_ID)
                    .title("이미 처리된 요청")
                    .content("내용")
                    .status(Status.ACCEPTED)
                    .createdAt(LocalDateTime.now())
                    .build();

            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(acceptedRequest));

            // when & then
            assertThatThrownBy(() ->
                    questionService.acceptRequest(REQUEST_ID, RECEIVER_ID))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("이미 처리된 요청입니다.");
        }
    }


    // ════════════════════════════════════════════════════════════════
    // 5. 요청 거절 (rejectRequest)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("요청 거절")
    class RejectRequestTest {

        @Test
        @DisplayName("답변자가 요청을 거절할 수 있다")
        void rejectRequest_success() {
            // given
            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));

            // when & then - 예외 없이 정상 실행되면 통과
            assertThatCode(() ->
                    questionService.rejectRequest(REQUEST_ID, RECEIVER_ID))
                    .doesNotThrowAnyException();

            // 상태가 REJECTED 로 바뀌었는지 확인
            assertThat(pendingRequest.getStatus()).isEqualTo(Status.REJECTED);
        }

        @Test
        @DisplayName("수신자가 아닌 사람이 거절하면 예외가 발생한다")
        void rejectRequest_wrongUser() {
            // given
            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));

            // when & then
            assertThatThrownBy(() ->
                    questionService.rejectRequest(REQUEST_ID, 999L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("해당 요청의 수신자가 아닙니다.");
        }

        @Test
        @DisplayName("이미 처리된 요청을 거절하면 예외가 발생한다")
        void rejectRequest_alreadyProcessed() {
            // given - 이미 REJECTED 상태
            QuestionRequest rejectedRequest = QuestionRequest.builder()
                    .id(REQUEST_ID)
                    .requesterId(REQUESTER_ID)
                    .receiverId(RECEIVER_ID)
                    .title("이미 거절된 요청")
                    .content("내용")
                    .status(Status.REJECTED)
                    .createdAt(LocalDateTime.now())
                    .build();

            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(rejectedRequest));

            // when & then
            assertThatThrownBy(() ->
                    questionService.rejectRequest(REQUEST_ID, RECEIVER_ID))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("이미 처리된 요청입니다.");
        }
    }


    // ════════════════════════════════════════════════════════════════
    // 6. 요청 취소 (cancelRequest)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("요청 취소")
    class CancelRequestTest {

        @Test
        @DisplayName("질문자가 자신의 요청을 취소할 수 있다")
        void cancelRequest_success() {
            // given
            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));

            // when & then
            assertThatCode(() ->
                    questionService.cancelRequest(REQUEST_ID, REQUESTER_ID))
                    .doesNotThrowAnyException();

            // 상태가 CANCELLED 로 바뀌었는지 확인
            assertThat(pendingRequest.getStatus()).isEqualTo(Status.CANCELLED);
        }

        @Test
        @DisplayName("요청자가 아닌 사람이 취소하면 예외가 발생한다")
        void cancelRequest_wrongUser() {
            // given
            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));

            // when & then
            assertThatThrownBy(() ->
                    questionService.cancelRequest(REQUEST_ID, 999L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("해당 요청의 요청자가 아닙니다.");
        }

        @Test
        @DisplayName("이미 처리된 요청은 취소할 수 없다")
        void cancelRequest_alreadyProcessed() {
            // given - 이미 ACCEPTED 상태
            QuestionRequest acceptedRequest = QuestionRequest.builder()
                    .id(REQUEST_ID)
                    .requesterId(REQUESTER_ID)
                    .receiverId(RECEIVER_ID)
                    .title("이미 수락된 요청")
                    .content("내용")
                    .status(Status.ACCEPTED)
                    .createdAt(LocalDateTime.now())
                    .build();

            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(acceptedRequest));

            // when & then
            assertThatThrownBy(() ->
                    questionService.cancelRequest(REQUEST_ID, REQUESTER_ID))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("이미 처리된 요청은 취소할 수 없습니다.");
        }
    }


    // ════════════════════════════════════════════════════════════════
    // 7. 질문 상세 조회 (getQuestionDetail)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("질문 상세 조회")
    class GetQuestionDetailTest {

        @Test
        @DisplayName("질문자가 질문 상세를 조회할 수 있다")
        void getQuestionDetail_asAsker() {
            // given
            given(questionRepo.findById(QUESTION_ID))
                    .willReturn(Optional.of(activeQuestion));
            given(answerRepo.findByQuestionIdOrderByCreatedAtAsc(QUESTION_ID))
                    .willReturn(List.of(mentorAnswer));

            // when
            QuestionDto.QuestionDetail result =
                    questionService.getQuestionDetail(QUESTION_ID, REQUESTER_ID);

            // then
            assertThat(result.getId()).isEqualTo(QUESTION_ID);
            assertThat(result.getTitle()).isEqualTo("스프링 질문입니다");
            assertThat(result.getAnswers()).hasSize(1);
            assertThat(result.getAnswers().get(0).getAuthorRole())
                    .isEqualTo(AuthorRole.MENTOR);
        }

        @Test
        @DisplayName("멘토도 질문 상세를 조회할 수 있다")
        void getQuestionDetail_asMentor() {
            // given
            given(questionRepo.findById(QUESTION_ID))
                    .willReturn(Optional.of(activeQuestion));
            given(answerRepo.findByQuestionIdOrderByCreatedAtAsc(QUESTION_ID))
                    .willReturn(List.of());

            // when - RECEIVER_ID (멘토) 가 조회
            QuestionDto.QuestionDetail result =
                    questionService.getQuestionDetail(QUESTION_ID, RECEIVER_ID);

            // then
            assertThat(result.getMentorId()).isEqualTo(RECEIVER_ID);
        }

        @Test
        @DisplayName("질문 참여자가 아닌 사람이 조회하면 예외가 발생한다")
        void getQuestionDetail_notParticipant() {
            // given
            given(questionRepo.findById(QUESTION_ID))
                    .willReturn(Optional.of(activeQuestion));

            // when & then
            assertThatThrownBy(() ->
                    questionService.getQuestionDetail(QUESTION_ID, 999L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("접근 권한이 없습니다.");
        }

        @Test
        @DisplayName("존재하지 않는 질문을 조회하면 예외가 발생한다")
        void getQuestionDetail_notFound() {
            // given
            given(questionRepo.findById(999L)).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() ->
                    questionService.getQuestionDetail(999L, REQUESTER_ID))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("존재하지 않는 질문입니다");
        }
    }


    // ════════════════════════════════════════════════════════════════
    // 8. 내 질문 목록 조회 (getMyQuestions*)  ← [신규] 기존 파일에 없던 섹션
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("내 질문 목록 조회")
    class GetMyQuestionsTest {

        @Test
        @DisplayName("질문자로서 참여한 질문 목록을 조회할 수 있다")
        void getMyQuestionsAsAsker_success() {
            // given
            given(questionRepo.findByUserIdAndStatusOrderByCreatedAtDesc(
                    REQUESTER_ID, QuestionStatus.ACTIVE))
                    .willReturn(List.of(activeQuestion));
            // answerRepo 는 answerCount 계산에 사용됩니다.
            given(answerRepo.findByQuestionIdOrderByCreatedAtAsc(QUESTION_ID))
                    .willReturn(List.of(mentorAnswer));

            // when
            List<QuestionDto.QuestionItem> result =
                    questionService.getMyQuestionsAsAsker(REQUESTER_ID);

            // then
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getAnswerCount()).isEqualTo(1);
            assertThat(result.get(0).getStatus()).isEqualTo(QuestionStatus.ACTIVE);
        }

        @Test
        @DisplayName("멘토로서 참여한 질문 목록을 조회할 수 있다")
        void getMyQuestionsAsMentor_success() {
            // given
            given(questionRepo.findByMentorIdAndStatusOrderByCreatedAtDesc(
                    RECEIVER_ID, QuestionStatus.ACTIVE))
                    .willReturn(List.of(activeQuestion));
            given(answerRepo.findByQuestionIdOrderByCreatedAtAsc(QUESTION_ID))
                    .willReturn(List.of());

            // when
            List<QuestionDto.QuestionItem> result =
                    questionService.getMyQuestionsAsMentor(RECEIVER_ID);

            // then
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getAnswerCount()).isEqualTo(0);  // 답변 없음
        }

        @Test
        @DisplayName("참여한 질문이 없으면 빈 목록을 반환한다")
        void getMyQuestionsAsAsker_empty() {
            // given
            given(questionRepo.findByUserIdAndStatusOrderByCreatedAtDesc(
                    REQUESTER_ID, QuestionStatus.ACTIVE))
                    .willReturn(List.of());

            // when
            List<QuestionDto.QuestionItem> result =
                    questionService.getMyQuestionsAsAsker(REQUESTER_ID);

            // then
            assertThat(result).isEmpty();
        }
    }


    // ════════════════════════════════════════════════════════════════
    // 9. 답변 작성 (writeAnswer)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("답변 작성")
    class WriteAnswerTest {

        @Test
        @DisplayName("멘토가 답변을 작성하면 MENTOR 역할로 저장된다")
        void writeAnswer_mentor() {
            // given
            given(questionRepo.findById(QUESTION_ID))
                    .willReturn(Optional.of(activeQuestion));
            given(answerRepo.save(any(Answer.class)))
                    .willReturn(mentorAnswer);

            AnswerDto.WriteRequest dto = mock(AnswerDto.WriteRequest.class);
            given(dto.getContent()).willReturn("@ManyToOne 을 사용하시면 됩니다!");

            // when
            AnswerDto.AnswerItem result =
                    questionService.writeAnswer(QUESTION_ID, RECEIVER_ID, dto);

            // then
            assertThat(result.getAuthorId()).isEqualTo(RECEIVER_ID);
            assertThat(result.getAuthorRole()).isEqualTo(AuthorRole.MENTOR);
            assertThat(result.getContent()).isEqualTo("@ManyToOne 을 사용하시면 됩니다!");
        }

        @Test
        @DisplayName("질문자가 답변을 작성하면 ASKER 역할로 저장된다")
        void writeAnswer_asker() {
            // given
            Answer askerAnswer = Answer.builder()
                    .id(31L)
                    .questionId(QUESTION_ID)
                    .authorId(REQUESTER_ID)
                    .authorRole(AuthorRole.ASKER)
                    .content("감사합니다! 해결됐어요.")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            given(questionRepo.findById(QUESTION_ID))
                    .willReturn(Optional.of(activeQuestion));
            given(answerRepo.save(any(Answer.class)))
                    .willReturn(askerAnswer);

            AnswerDto.WriteRequest dto = mock(AnswerDto.WriteRequest.class);
            given(dto.getContent()).willReturn("감사합니다! 해결됐어요.");

            // when
            AnswerDto.AnswerItem result =
                    questionService.writeAnswer(QUESTION_ID, REQUESTER_ID, dto);

            // then
            assertThat(result.getAuthorRole()).isEqualTo(AuthorRole.ASKER);
            assertThat(result.getContent()).isEqualTo("감사합니다! 해결됐어요.");
        }

        @Test
        @DisplayName("질문 참여자가 아닌 사람이 답변을 작성하면 예외가 발생한다")
        void writeAnswer_notParticipant() {
            // given
            given(questionRepo.findById(QUESTION_ID))
                    .willReturn(Optional.of(activeQuestion));

            AnswerDto.WriteRequest dto = mock(AnswerDto.WriteRequest.class);

            // when & then
            assertThatThrownBy(() ->
                    questionService.writeAnswer(QUESTION_ID, 999L, dto))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("접근 권한이 없습니다.");

            // 권한이 없으면 save 는 호출되면 안 됩니다.
            verify(answerRepo, never()).save(any());
        }
    }


    // ════════════════════════════════════════════════════════════════
    // 10. 답변 수정 (updateAnswer)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("답변 수정")
    class UpdateAnswerTest {

        @Test
        @DisplayName("본인이 작성한 답변을 수정할 수 있다")
        void updateAnswer_success() {
            // given
            given(answerRepo.findById(ANSWER_ID))
                    .willReturn(Optional.of(mentorAnswer));

            AnswerDto.WriteRequest dto = mock(AnswerDto.WriteRequest.class);
            given(dto.getContent()).willReturn("수정된 답변 내용입니다.");

            // when
            AnswerDto.AnswerItem result =
                    questionService.updateAnswer(ANSWER_ID, RECEIVER_ID, dto);

            // then - Answer.update() 가 호출되면 내부 content 가 바뀝니다.
            assertThat(result.getContent()).isEqualTo("수정된 답변 내용입니다.");
        }

        @Test
        @DisplayName("본인이 작성하지 않은 답변을 수정하면 예외가 발생한다")
        void updateAnswer_notAuthor() {
            // given
            given(answerRepo.findById(ANSWER_ID))
                    .willReturn(Optional.of(mentorAnswer));

            AnswerDto.WriteRequest dto = mock(AnswerDto.WriteRequest.class);

            // when & then - 999L 은 해당 답변의 작성자가 아닙니다.
            assertThatThrownBy(() ->
                    questionService.updateAnswer(ANSWER_ID, 999L, dto))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("수정 권한이 없습니다.");
        }

        @Test
        @DisplayName("존재하지 않는 답변을 수정하면 예외가 발생한다")
        void updateAnswer_notFound() {
            // given
            given(answerRepo.findById(999L)).willReturn(Optional.empty());

            AnswerDto.WriteRequest dto = mock(AnswerDto.WriteRequest.class);

            // when & then
            assertThatThrownBy(() ->
                    questionService.updateAnswer(999L, RECEIVER_ID, dto))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("존재하지 않는 답변입니다");
        }
    }


    // ════════════════════════════════════════════════════════════════
    // 11. 답변 삭제 (deleteAnswer)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("답변 삭제")
    class DeleteAnswerTest {

        @Test
        @DisplayName("본인이 작성한 답변을 삭제할 수 있다")
        void deleteAnswer_success() {
            // given
            given(answerRepo.findById(ANSWER_ID))
                    .willReturn(Optional.of(mentorAnswer));

            // when & then - 예외 없이 정상 실행되면 통과
            assertThatCode(() ->
                    questionService.deleteAnswer(ANSWER_ID, RECEIVER_ID))
                    .doesNotThrowAnyException();

            // answerRepo.delete() 가 한 번 호출됐는지 확인
            verify(answerRepo, times(1)).delete(mentorAnswer);
        }

        @Test
        @DisplayName("본인이 작성하지 않은 답변을 삭제하면 예외가 발생한다")
        void deleteAnswer_notAuthor() {
            // given
            given(answerRepo.findById(ANSWER_ID))
                    .willReturn(Optional.of(mentorAnswer));

            // when & then
            assertThatThrownBy(() ->
                    questionService.deleteAnswer(ANSWER_ID, 999L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("삭제 권한이 없습니다.");

            // 예외가 발생했으므로 delete 는 호출되면 안 됩니다.
            verify(answerRepo, never()).delete(any());
        }

        @Test
        @DisplayName("존재하지 않는 답변을 삭제하면 예외가 발생한다")
        void deleteAnswer_notFound() {
            // given
            given(answerRepo.findById(999L)).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() ->
                    questionService.deleteAnswer(999L, RECEIVER_ID))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("존재하지 않는 답변입니다");
        }
    }
}