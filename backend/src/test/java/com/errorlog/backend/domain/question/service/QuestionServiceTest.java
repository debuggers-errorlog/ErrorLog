package com.errorlog.backend.domain.question.service;

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
import com.errorlog.backend.domain.question.repository.ImageRepository;
import com.errorlog.backend.domain.question.repository.QuestionRepository;
import com.errorlog.backend.domain.question.repository.QuestionRequestRepository;
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
 * - @Mock : 실제 DB 대신 가짜 객체를 사용합니다.
 * - @InjectMocks : 가짜 객체들을 QuestionService 에 자동으로 주입합니다.
 * - given / when / then 패턴으로 읽기 쉽게 작성했습니다.
 */

@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

    @Mock
    private QuestionRequestRepository requestRepo;

    @Mock
    private QuestionRepository questionRepo;

    @Mock
    private AnswerRepository answerRepo;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ImageRepository imageRepository;

    @InjectMocks
    private QuestionService questionService;

    // ── 공통 테스트 데이터 ────────────────────────────────────────────
    private final Long REQUESTER_ID = 1L;   // 질문자 ID
    private final Long RECEIVER_ID  = 2L;   // 답변자(멘토) ID
    private final Long REQUEST_ID   = 10L;  // 질문 요청 ID
    private final Long QUESTION_ID  = 20L;  // 질문 ID
    private final Long ANSWER_ID    = 30L;  // 답변 ID

    private QuestionRequest pendingRequest;
    private Question activeQuestion;
    private Answer mentorAnswer;

    @BeforeEach
    void setUp() {
        // 테스트마다 초기화되는 공통 데이터
        lenient().when(userRepository.findById(any(Long.class)))
                .thenReturn(Optional.empty());

        pendingRequest = QuestionRequest.builder()
                .id(REQUEST_ID)
                .requesterId(REQUESTER_ID)
                .receiverId(RECEIVER_ID)
                .title("스프링 질문입니다")
                .content("JPA 연관관계 설정이 헷갈려요")
                .status(Status.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

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
    // 1. 질문 요청 (sendRequest)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("질문 요청 보내기")
    class SendRequest {

        @Test
        @DisplayName("정상적으로 질문 요청을 보낼 수 있다")
        void sendRequest_success() {
            // given - 저장 시 pendingRequest 를 반환하도록 설정
            given(requestRepo.save(any(QuestionRequest.class)))
                    .willReturn(pendingRequest);

            QuestionRequestDto.SendRequest dto = mock(QuestionRequestDto.SendRequest.class);
            given(dto.getReceiverId()).willReturn(RECEIVER_ID);
            given(dto.getTitle()).willReturn("스프링 질문입니다");
            given(dto.getContent()).willReturn("JPA 연관관계 설정이 헷갈려요");

            // when - 실제 메서드 호출
            QuestionRequestDto.RequestItem result =
                    questionService.sendRequest(REQUESTER_ID, dto);

            // then - 결과 검증
            assertThat(result.getId()).isEqualTo(REQUEST_ID);
            assertThat(result.getRequesterId()).isEqualTo(REQUESTER_ID);
            assertThat(result.getReceiverId()).isEqualTo(RECEIVER_ID);
            assertThat(result.getStatus()).isEqualTo(Status.PENDING);
            assertThat(result.getTitle()).isEqualTo("스프링 질문입니다");

            // save 가 1번 호출됐는지 확인
            verify(requestRepo, times(1)).save(any(QuestionRequest.class));
        }
    }

    // ════════════════════════════════════════════════════════════════
    // 2. 보낸 요청 목록 / 받은 요청 목록
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("요청 목록 조회")
    class GetRequests {

        @Test
        @DisplayName("내가 보낸 요청 목록을 조회할 수 있다")
        void getSentRequests_success() {
            given(requestRepo.findByRequesterIdOrderByCreatedAtDesc(REQUESTER_ID))
                    .willReturn(List.of(pendingRequest));

            List<QuestionRequestDto.RequestItem> result =
                    questionService.getSentRequests(REQUESTER_ID);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getTitle()).isEqualTo("스프링 질문입니다");
        }

        @Test
        @DisplayName("내가 받은 요청 목록을 조회할 수 있다")
        void getReceivedRequests_success() {
            given(requestRepo.findByReceiverIdOrderByCreatedAtDesc(RECEIVER_ID))
                    .willReturn(List.of(pendingRequest));

            List<QuestionRequestDto.RequestItem> result =
                    questionService.getReceivedRequests(RECEIVER_ID);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getReceiverId()).isEqualTo(RECEIVER_ID);
        }

        @Test
        @DisplayName("보낸 요청이 없으면 빈 목록을 반환한다")
        void getSentRequests_empty() {
            given(requestRepo.findByRequesterIdOrderByCreatedAtDesc(REQUESTER_ID))
                    .willReturn(List.of());

            List<QuestionRequestDto.RequestItem> result =
                    questionService.getSentRequests(REQUESTER_ID);

            assertThat(result).isEmpty();
        }
    }

    // ════════════════════════════════════════════════════════════════
    // 3. 요청 수락 (acceptRequest)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("요청 수락")
    class AcceptRequest {

        @Test
        @DisplayName("답변자가 요청을 수락하면 질문이 생성된다")
        void acceptRequest_success() {
            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));
            given(questionRepo.save(any(Question.class)))
                    .willReturn(activeQuestion);

            QuestionDto.AcceptRequest dto = mock(QuestionDto.AcceptRequest.class);
            given(dto.getTitle()).willReturn("스프링 질문입니다");
            given(dto.getContent()).willReturn("JPA 연관관계 설정이 헷갈려요");

            QuestionDto.QuestionDetail result =
                    questionService.acceptRequest(REQUEST_ID, RECEIVER_ID, dto);

            // 질문이 정상 생성됐는지 확인
            assertThat(result.getTitle()).isEqualTo("스프링 질문입니다");
            assertThat(result.getAskerId()).isEqualTo(REQUESTER_ID);
            assertThat(result.getMentorId()).isEqualTo(RECEIVER_ID);
            assertThat(result.getAnswers()).isEmpty();
        }

        @Test
        @DisplayName("수신자가 아닌 사람이 수락하면 예외가 발생한다")
        void acceptRequest_wrongMentor() {
            Long wrongUserId = 999L;

            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));

            QuestionDto.AcceptRequest dto = mock(QuestionDto.AcceptRequest.class);

            // 수신자가 아닌 사람이 수락 시도 → 예외 발생 확인
            assertThatThrownBy(() ->
                    questionService.acceptRequest(REQUEST_ID, wrongUserId, dto))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("해당 요청의 수신자가 아닙니다.");
        }

        @Test
        @DisplayName("이미 처리된 요청을 수락하면 예외가 발생한다")
        void acceptRequest_alreadyProcessed() {
            // ACCEPTED 상태로 변경
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

            QuestionDto.AcceptRequest dto = mock(QuestionDto.AcceptRequest.class);

            assertThatThrownBy(() ->
                    questionService.acceptRequest(REQUEST_ID, RECEIVER_ID, dto))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("이미 처리된 요청입니다.");
        }
    }

    // ════════════════════════════════════════════════════════════════
    // 4. 요청 거절 (rejectRequest)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("요청 거절")
    class RejectRequest {

        @Test
        @DisplayName("답변자가 요청을 거절할 수 있다")
        void rejectRequest_success() {
            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));

            // 예외 없이 정상 실행되는지 확인
            assertThatCode(() ->
                    questionService.rejectRequest(REQUEST_ID, RECEIVER_ID))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("수신자가 아닌 사람이 거절하면 예외가 발생한다")
        void rejectRequest_wrongUser() {
            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));

            assertThatThrownBy(() ->
                    questionService.rejectRequest(REQUEST_ID, 999L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("해당 요청의 수신자가 아닙니다.");
        }
    }

    // ════════════════════════════════════════════════════════════════
    // 5. 요청 취소 (cancelRequest)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("요청 취소")
    class CancelRequest {

        @Test
        @DisplayName("질문자가 자신의 요청을 취소할 수 있다")
        void cancelRequest_success() {
            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));

            assertThatCode(() ->
                    questionService.cancelRequest(REQUEST_ID, REQUESTER_ID))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("요청자가 아닌 사람이 취소하면 예외가 발생한다")
        void cancelRequest_wrongUser() {
            given(requestRepo.findById(REQUEST_ID))
                    .willReturn(Optional.of(pendingRequest));

            assertThatThrownBy(() ->
                    questionService.cancelRequest(REQUEST_ID, 999L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("해당 요청의 요청자가 아닙니다.");
        }
    }

    // ════════════════════════════════════════════════════════════════
    // 6. 질문 상세 조회 (getQuestionDetail)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("질문 상세 조회")
    class GetQuestionDetail {

        @Test
        @DisplayName("질문자가 질문 상세를 조회할 수 있다")
        void getQuestionDetail_asAsker() {
            given(questionRepo.findById(QUESTION_ID))
                    .willReturn(Optional.of(activeQuestion));
            given(answerRepo.findByQuestionIdOrderByCreatedAtAsc(QUESTION_ID))
                    .willReturn(List.of(mentorAnswer));

            QuestionDto.QuestionDetail result =
                    questionService.getQuestionDetail(QUESTION_ID, REQUESTER_ID);

            assertThat(result.getId()).isEqualTo(QUESTION_ID);
            assertThat(result.getTitle()).isEqualTo("스프링 질문입니다");
            assertThat(result.getAnswers()).hasSize(1);
            assertThat(result.getAnswers().get(0).getAuthorRole())
                    .isEqualTo(AuthorRole.MENTOR);
        }

        @Test
        @DisplayName("질문 참여자가 아닌 사람이 조회하면 예외가 발생한다")
        void getQuestionDetail_notParticipant() {
            given(questionRepo.findById(QUESTION_ID))
                    .willReturn(Optional.of(activeQuestion));

            assertThatThrownBy(() ->
                    questionService.getQuestionDetail(QUESTION_ID, 999L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("접근 권한이 없습니다.");
        }

        @Test
        @DisplayName("존재하지 않는 질문을 조회하면 예외가 발생한다")
        void getQuestionDetail_notFound() {
            given(questionRepo.findById(999L))
                    .willReturn(Optional.empty());

            assertThatThrownBy(() ->
                    questionService.getQuestionDetail(999L, REQUESTER_ID))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("존재하지 않는 질문입니다");
        }
    }

    // ════════════════════════════════════════════════════════════════
    // 7. 답변 작성 (writeAnswer)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("답변 작성")
    class WriteAnswer {

        @Test
        @DisplayName("멘토가 답변을 작성하면 MENTOR 역할로 저장된다")
        void writeAnswer_mentor() {
            given(questionRepo.findById(QUESTION_ID))
                    .willReturn(Optional.of(activeQuestion));
            given(answerRepo.save(any(Answer.class)))
                    .willReturn(mentorAnswer);

            AnswerDto.WriteRequest dto = mock(AnswerDto.WriteRequest.class);
            given(dto.getContent()).willReturn("@ManyToOne 을 사용하시면 됩니다!");

            AnswerDto.AnswerItem result =
                    questionService.writeAnswer(QUESTION_ID, RECEIVER_ID, dto);

            assertThat(result.getAuthorId()).isEqualTo(RECEIVER_ID);
            assertThat(result.getAuthorRole()).isEqualTo(AuthorRole.MENTOR);
            assertThat(result.getContent()).isEqualTo("@ManyToOne 을 사용하시면 됩니다!");
        }

        @Test
        @DisplayName("질문자가 답변을 작성하면 ASKER 역할로 저장된다")
        void writeAnswer_asker() {
            Answer askerAnswer = Answer.builder()
                    .id(31L)
                    .questionId(QUESTION_ID)
                    .authorId(REQUESTER_ID)
                    .authorRole(AuthorRole.ASKER)
                    .content("감사합니다!")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            given(questionRepo.findById(QUESTION_ID))
                    .willReturn(Optional.of(activeQuestion));
            given(answerRepo.save(any(Answer.class)))
                    .willReturn(askerAnswer);

            AnswerDto.WriteRequest dto = mock(AnswerDto.WriteRequest.class);
            given(dto.getContent()).willReturn("감사합니다!");

            AnswerDto.AnswerItem result =
                    questionService.writeAnswer(QUESTION_ID, REQUESTER_ID, dto);

            assertThat(result.getAuthorRole()).isEqualTo(AuthorRole.ASKER);
        }

        @Test
        @DisplayName("질문 참여자가 아닌 사람이 답변을 작성하면 예외가 발생한다")
        void writeAnswer_notParticipant() {
            given(questionRepo.findById(QUESTION_ID))
                    .willReturn(Optional.of(activeQuestion));

            AnswerDto.WriteRequest dto = mock(AnswerDto.WriteRequest.class);

            assertThatThrownBy(() ->
                    questionService.writeAnswer(QUESTION_ID, 999L, dto))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("접근 권한이 없습니다.");
        }
    }

    // ════════════════════════════════════════════════════════════════
    // 8. 답변 수정 (updateAnswer)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("답변 수정")
    class UpdateAnswer {

        @Test
        @DisplayName("본인이 작성한 답변을 수정할 수 있다")
        void updateAnswer_success() {
            given(answerRepo.findById(ANSWER_ID))
                    .willReturn(Optional.of(mentorAnswer));

            AnswerDto.WriteRequest dto = mock(AnswerDto.WriteRequest.class);
            given(dto.getContent()).willReturn("수정된 답변 내용입니다.");

            AnswerDto.AnswerItem result =
                    questionService.updateAnswer(ANSWER_ID, RECEIVER_ID, dto);

            assertThat(result.getContent()).isEqualTo("수정된 답변 내용입니다.");
        }

        @Test
        @DisplayName("본인이 작성하지 않은 답변을 수정하면 예외가 발생한다")
        void updateAnswer_notAuthor() {
            given(answerRepo.findById(ANSWER_ID))
                    .willReturn(Optional.of(mentorAnswer));

            AnswerDto.WriteRequest dto = mock(AnswerDto.WriteRequest.class);

            assertThatThrownBy(() ->
                    questionService.updateAnswer(ANSWER_ID, 999L, dto))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("수정 권한이 없습니다.");
        }
    }

    // ════════════════════════════════════════════════════════════════
    // 9. 답변 삭제 (deleteAnswer)
    // ════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("답변 삭제")
    class DeleteAnswer {

        @Test
        @DisplayName("본인이 작성한 답변을 삭제할 수 있다")
        void deleteAnswer_success() {
            given(answerRepo.findById(ANSWER_ID))
                    .willReturn(Optional.of(mentorAnswer));

            assertThatCode(() ->
                    questionService.deleteAnswer(ANSWER_ID, RECEIVER_ID))
                    .doesNotThrowAnyException();

            // delete 가 1번 호출됐는지 확인
            verify(answerRepo, times(1)).delete(mentorAnswer);
        }

        @Test
        @DisplayName("본인이 작성하지 않은 답변을 삭제하면 예외가 발생한다")
        void deleteAnswer_notAuthor() {
            given(answerRepo.findById(ANSWER_ID))
                    .willReturn(Optional.of(mentorAnswer));

            assertThatThrownBy(() ->
                    questionService.deleteAnswer(ANSWER_ID, 999L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("삭제 권한이 없습니다.");
        }

        @Test
        @DisplayName("존재하지 않는 답변을 삭제하면 예외가 발생한다")
        void deleteAnswer_notFound() {
            given(answerRepo.findById(999L))
                    .willReturn(Optional.empty());

            assertThatThrownBy(() ->
                    questionService.deleteAnswer(999L, RECEIVER_ID))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("존재하지 않는 답변입니다");
        }
    }
}
