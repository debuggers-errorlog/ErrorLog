-- =============================================================================
-- ErrorLog 시연용 시드 데이터
-- =============================================================================
-- 실행 순서:
--   1) backend/sql/erlog.sql        (스키마 생성)
--   2) backend/sql/demo_data.sql    (이 파일 — erlog_data.sql 대신 사용)
--
-- 공통 비밀번호: 1234
--
-- 시연 추천 계정
--   코딩하는코린이  user1@test.com  — 구독자·질문자 (메인 시연용)
--   김개발          user2@test.com  — 크리에이터·멘토 (수락/답변 시연)
--   최고관리자      admin@test.com  — 프리미엄 글·관리자
-- =============================================================================

USE Errorlog;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `images`;
TRUNCATE TABLE `answers`;
TRUNCATE TABLE `questions`;
TRUNCATE TABLE `reports`;
TRUNCATE TABLE `comments`;
TRUNCATE TABLE `likes`;
TRUNCATE TABLE `post_tags`;
TRUNCATE TABLE `posts`;
TRUNCATE TABLE `payments`;
TRUNCATE TABLE `question_requests`;
TRUNCATE TABLE `subscriptions`;
TRUNCATE TABLE `follows`;
TRUNCATE TABLE `subscription_settings`;
TRUNCATE TABLE `question_settings`;
TRUNCATE TABLE `refresh_tokens`;
TRUNCATE TABLE `tags`;
TRUNCATE TABLE `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- bcrypt hash for password "1234"
SET @PWD = '$2a$10$q820TvhJVwxz/vdxMK2F.OZRldQvAyPKfdGE/ASvlfkS5/XySFyQK';

-- ── 1. 사용자 ────────────────────────────────────────────────────────────────
INSERT INTO `users` (`id`, `email`, `nickname`, `password`, `role`, `status`, `bio`, `link`, `created_at`) VALUES
(1, 'admin@test.com',   '최고관리자',    @PWD, 'ADMIN', 'ACTIVE', '스프링 시큐리티·인증 인프라 10년차. 에러 로그 읽는 법부터 실전 트러블슈팅까지.', 'https://github.com/errorlog-admin', DATE_SUB(NOW(), INTERVAL 180 DAY)),
(2, 'user1@test.com',   '코딩하는코린이', @PWD, 'USER',  'ACTIVE', '백엔드 입문 6개월차. 막히는 에러 올리고 같이 풀어요.', 'https://github.com/coding-korini', DATE_SUB(NOW(), INTERVAL 90 DAY)),
(3, 'user2@test.com',   '김개발',        @PWD, 'USER',  'ACTIVE', 'Spring Boot·JPA 전문. 구독자 전용 심화 글과 1:1 질문 받습니다.', 'https://github.com/kimdev', DATE_SUB(NOW(), INTERVAL 120 DAY)),
(4, 'user3@test.com',   '백엔드마스터',   @PWD, 'USER',  'ACTIVE', 'MSA·API 설계·네트워크 트러블슈팅 위주로 글 씁니다.', 'https://github.com/backend-master', DATE_SUB(NOW(), INTERVAL 60 DAY)),
(5, 'user4@test.com',   '프론트지니',     @PWD, 'USER',  'ACTIVE', 'React + Spring 풀스택 주니어. CORS·연동 이슈 정리 중.', NULL, DATE_SUB(NOW(), INTERVAL 45 DAY)),
(6, 'user5@test.com',   '디비탐정',       @PWD, 'USER',  'ACTIVE', 'MySQL 실행 계획·인덱스 튜닝에 집착하는 DBA 지망생.', 'https://github.com/dbi-detective', DATE_SUB(NOW(), INTERVAL 30 DAY));

-- ── 2. 태그 ──────────────────────────────────────────────────────────────────
INSERT INTO `tags` (`id`, `name`) VALUES
(1, 'Spring Boot'),
(2, 'Spring Security'),
(3, 'JPA'),
(4, 'React'),
(5, 'MySQL'),
(6, 'Docker'),
(7, 'Redis'),
(8, 'TypeScript');

-- ── 3. 구독·질문 단가 설정 (크리에이터 3명) ───────────────────────────────────
INSERT INTO `subscription_settings` (`user_id`, `price`, `description`) VALUES
(1, 4900, '시큐리티·인증 심화 글 열람 + 월 1회 코드 리뷰 우선권'),
(3, 3900, 'JPA·트랜잭션 실전 패턴 + 구독자 전용 트러블슈팅 노트'),
(4, 2900, 'API·네트워크 에러 해결 아카이브');

INSERT INTO `question_settings` (`user_id`, `price`, `description`) VALUES
(1, 9900,  '에러 스택트레이스 분석 + 재현 시나리오·해결 방향 제시 (24시간 내 1차 답변)'),
(3, 5900,  'Spring/JPA 코드 스니펫 기반 디버깅 조언 (필요 시 리팩터링 제안)'),
(4, 4500,  'API·인프라 연동 이슈 1:1 상담');

-- ── 4. 팔로우 (코딩하는코린이 id=2 는 미팔로우 — 시연에서 팔로우·구독 라이브 진행) ──
INSERT INTO `follows` (`follower_id`, `following_id`, `created_at`) VALUES
(3, 1, DATE_SUB(NOW(), INTERVAL 40 DAY)),
(4, 3, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(5, 3, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(5, 4, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(6, 1, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(6, 3, DATE_SUB(NOW(), INTERVAL 8 DAY));

-- ── 5. 구독 (코딩하는코린이 id=2 는 미구독 — 시연에서 구독 결제 라이브 진행) ──
INSERT INTO `subscriptions` (`subscriber_id`, `creator_id`, `expired_at`, `created_at`) VALUES
(5, 3, DATE_ADD(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
(6, 1, DATE_ADD(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY)),
(4, 3, DATE_ADD(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

-- ── 6. 게시글 ────────────────────────────────────────────────────────────────
INSERT INTO `posts` (`id`, `user_id`, `title`, `content`, `troubleshooting_meta`, `visibility`, `status`, `view_count`, `created_at`) VALUES
(1, 2, '스프링 부트 테스트에서 ApplicationContext 로드 실패',
'JUnit5로 `@SpringBootTest`를 돌리면 아래처럼 Context 로드가 실패합니다.\n\n```\njava.lang.IllegalStateException: Failed to load ApplicationContext\n```\n\n`application-test.yml`에 H2 설정을 넣었는데도 동일합니다. 프로필 지정 방법이 잘못된 걸까요?',
JSON_OBJECT('category','RUNTIME','environment',JSON_OBJECT('framework','Spring Boot'),'error',JSON_OBJECT('type','ApplicationContext','message','Failed to load ApplicationContext'),'symptom','테스트 실행 시 Context 로드 실패'),
'PUBLIC', 'ACTIVE', 342, DATE_SUB(NOW(), INTERVAL 14 DAY)),

(2, 3, 'JPA N+1 쿼리 — @EntityGraph vs fetch join 비교',
'목록 API에서 연관 엔티티를 함께 내려주다 보니 쿼리가 1+N으로 폭발했습니다.\n\n`@EntityGraph`와 `join fetch` 중 어떤 기준으로 고르면 좋을지, 실제 Before/After 쿼리 로그를 붙여 정리했습니다.',
JSON_OBJECT('category','DATABASE','environment',JSON_OBJECT('framework','Spring Boot'),'error',JSON_OBJECT('type','N+1 Query','message','select count(*) executed 47 times'),'symptom','목록 조회 시 연관 엔티티 쿼리 과다 발생'),
'PUBLIC', 'ACTIVE', 518, DATE_SUB(NOW(), INTERVAL 12 DAY)),

(3, 1, '[구독자 전용] JWT 필터 체인 실전 배치 가이드',
'`SecurityFilterChain`에서 커스텀 필터 위치를 잘못 두면 401/403이 랜덤처럼 보입니다.\n\n1. `OncePerRequestFilter` 상속 시 주의점\n2. `addFilterBefore` / `addFilterAfter` 선택 기준\n3. permitAll과 authenticated 경계에서 흔한 실수\n\n실제 프로젝트 설정 예시와 함께 단계별로 정리했습니다.',
JSON_OBJECT('category','SECURITY','environment',JSON_OBJECT('framework','Spring Security'),'error',JSON_OBJECT('type','AccessDeniedException','message','Access is denied'),'symptom','인증된 사용자인데 특정 API만 403'),
'SUBSCRIBERS', 'ACTIVE', 891, DATE_SUB(NOW(), INTERVAL 9 DAY)),

(4, 1, 'NullPointerException — Optional 체이닝 전에 의심할 것들',
'NPE 스택트레이스만 보고 Optional부터 감싸면 근본 원인을 놓치기 쉽습니다.\n\n- DTO 매핑 누락\n- 프록시 초기화 전 접근\n- 캐시/비동기 경계에서의 null 전파\n\n재현 가능한 최소 예제 3가지를 정리했습니다.',
JSON_OBJECT('category','RUNTIME','environment',JSON_OBJECT('framework','Spring Boot'),'error',JSON_OBJECT('type','NullPointerException','message','Cannot invoke method because object is null'),'symptom','특정 API 응답 직전 NPE'),
'PUBLIC', 'ACTIVE', 276, DATE_SUB(NOW(), INTERVAL 8 DAY)),

(5, 4, 'CORS preflight는 통과하는데 실제 POST만 실패할 때',
'브라우저 콘솔에 CORS 에러가 안 보이는데 POST만 403/401이 납니다.\n\n`allowedOrigins`와 `allowCredentials` 조합, 그리고 시큐리티 필터에서 OPTIONS 처리 여부를 체크리스트로 정리했습니다.',
JSON_OBJECT('category','NETWORK','environment',JSON_OBJECT('framework','Spring Boot'),'error',JSON_OBJECT('type','CORS','message','Response to preflight request doesn''t pass'),'symptom','프론트에서 POST만 실패'),
'PUBLIC', 'ACTIVE', 403, DATE_SUB(NOW(), INTERVAL 7 DAY)),

(6, 3, 'Gradle dependency conflict — spring-boot 3.x 마이그레이션',
'`./gradlew dependencies` 결과에서 jakarta/javax 충돌이 보일 때 정리 순서를 기록했습니다.\n\nBOM import 위치, `enforcedPlatform` 사용 여부, 제외(exclude) 전략을 비교합니다.',
JSON_OBJECT('category','BUILD','environment',JSON_OBJECT('framework','Gradle'),'error',JSON_OBJECT('type','DependencyConflict','message','NoSuchMethodError at runtime'),'symptom','빌드는 성공하지만 런타임 NoSuchMethodError'),
'PUBLIC', 'ACTIVE', 198, DATE_SUB(NOW(), INTERVAL 6 DAY)),

(7, 5, 'React 18 hydration mismatch — 서버/클라이언트 HTML 불일치',
'Next가 아닌 CRA+Spring 조합에서 초기 렌더 직후 hydration warning이 납니다.\n\n날짜 포맷, 랜덤 키, 브라우저 전용 API 사용 위치를 점검한 체크리스트입니다.',
JSON_OBJECT('category','RUNTIME','environment',JSON_OBJECT('framework','React'),'error',JSON_OBJECT('type','HydrationError','message','Text content does not match server-rendered HTML'),'symptom','첫 렌더 후 콘솔 hydration 경고'),
'PUBLIC', 'ACTIVE', 167, DATE_SUB(NOW(), INTERVAL 5 DAY)),

(8, 6, 'MySQL slow query — 복합 인덱스 순서가 결과를 바꾼 사례',
'`type: ALL`이 뜨던 쿼리에 (status, created_at) vs (created_at, status) 인덱스를 각각 적용해 비교했습니다.\n\n실행 계획 캡처와 rows examined 수치를 함께 남깁니다.',
JSON_OBJECT('category','DATABASE','environment',JSON_OBJECT('framework','MySQL'),'error',JSON_OBJECT('type','SlowQuery','message','Query took 3.2s'),'symptom','목록 API 응답 3초 이상'),
'PUBLIC', 'ACTIVE', 445, DATE_SUB(NOW(), INTERVAL 4 DAY)),

(9, 1, '[구독자 전용] Kubernetes 롤아웃 실패 시 롤백 플레이북',
'배포 직후 readiness probe 실패로 파드가 Ready 0/N 상태에 머무는 경우 대응 절차입니다.\n\n`kubectl rollout undo`, 이미지 태그 고정, ConfigMap 버전 분리까지 실무 순서로 정리했습니다.',
JSON_OBJECT('category','DEPLOY','environment',JSON_OBJECT('framework','Kubernetes'),'error',JSON_OBJECT('type','RolloutFailed','message','deployment exceeded its progress deadline'),'symptom','배포 후 서비스 불가'),
'SUBSCRIBERS', 'ACTIVE', 623, DATE_SUB(NOW(), INTERVAL 3 DAY)),

(10, 4, 'application.yml 프로필이 dev가 아닌 local을 읽는 이유',
'`spring.profiles.active`를 IDE와 jar 실행에서 다르게 넘기면 DB URL이 엇갈립니다.\n\nIntelliJ Run Config, `SPRING_PROFILES_ACTIVE`, `application-{profile}.yml` 우선순위를 표로 정리했습니다.',
JSON_OBJECT('category','CONFIG','environment',JSON_OBJECT('framework','Spring Boot'),'error',JSON_OBJECT('type','ConfigError','message','Failed to configure DataSource'),'symptom','로컬/서버 DB 설정 뒤바뀜'),
'PUBLIC', 'ACTIVE', 231, DATE_SUB(NOW(), INTERVAL 2 DAY)),

(11, 2, 'Spring Security 6에서 CSRF 토큰이 안 붙는 경우',
'폼 로그인은 되는데 POST API에 CSRF 403이 납니다.\n\n`CookieCsrfTokenRepository`와 SPA fetch 헤더 설정, `ignoringRequestMatchers` 범위를 정리했습니다.',
JSON_OBJECT('category','SECURITY','environment',JSON_OBJECT('framework','Spring Security'),'error',JSON_OBJECT('type','CsrfException','message','Invalid CSRF token'),'symptom','POST 요청만 403 Forbidden'),
'PUBLIC', 'ACTIVE', 189, DATE_SUB(NOW(), INTERVAL 1 DAY)),

(12, 3, '[구독자 전용] JVM Heap 튜닝 — GC 로그로 읽는 병목',
'G1 GC 로그에서 pause가 길어지는 패턴을 캡처하고, `-Xms/-Xmx` 고정과 메타스페이스 설정 변경 전후를 비교했습니다.',
JSON_OBJECT('category','PERFORMANCE','environment',JSON_OBJECT('framework','JVM'),'error',JSON_OBJECT('type','OutOfMemoryError','message','Java heap space'),'symptom','피크 시간대 응답 지연·OOM'),
'SUBSCRIBERS', 'ACTIVE', 367, DATE_SUB(NOW(), INTERVAL 18 HOUR));

-- ── 7. 게시글 태그 ───────────────────────────────────────────────────────────
INSERT INTO `post_tags` (`post_id`, `tag_id`) VALUES
(1,1),(2,1),(2,3),(3,2),(4,1),(5,1),(6,1),(7,4),(7,8),(8,5),(9,6),(10,1),(11,2),(12,1),(12,7);

-- ── 8. 댓글 (대댓글 1건 포함) ───────────────────────────────────────────────
INSERT INTO `comments` (`id`, `post_id`, `user_id`, `parent_id`, `status`, `content`, `created_at`) VALUES
(1,  1, 1, NULL, 'ACTIVE', '테스트 프로필을 `@ActiveProfiles("test")`로 명시했는지 먼저 확인해보세요. IDE 실행 설정에도 profile이 빠져 있는 경우가 많습니다.', DATE_SUB(NOW(), INTERVAL 13 DAY)),
(2,  1, 3, NULL, 'ACTIVE', 'H2 URL에 `MODE=MySQL` 넣었는데도 실패하면 `@DataJpaTest`와 `@SpringBootTest` 범위가 다른지도 봐주세요.', DATE_SUB(NOW(), INTERVAL 13 DAY)),
(3,  1, 2, 2,    'ACTIVE', '맞아요! `@DataJpaTest`만 분리하니까 해결됐습니다. 감사합니다.', DATE_SUB(NOW(), INTERVAL 12 DAY)),
(4,  2, 6, NULL, 'ACTIVE', 'fetch join은 페이징과 같이 쓰기 어려운 경우가 있어서 EntityGraph가 더 안전했던 적이 많아요.', DATE_SUB(NOW(), INTERVAL 11 DAY)),
(5,  2, 4, NULL, 'ACTIVE', 'Querydsl Projections로 DTO 직조회하는 방법도 후속 글 부탁드려요!', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(6,  5, 5, NULL, 'ACTIVE', '저도 credentials true일 때 allowedOrigin `*` 막혀서 헤더 설정 바꿨습니다.', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(7,  8, 3, NULL, 'ACTIVE', '카디널리티 낮은 컬럼을 인덱스 앞에 두는 게 보통 유리합니다. 좋은 비교네요.', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(8, 11, 1, NULL, 'ACTIVE', 'SPA면 CSRF를 비활성화하기보다 토큰 API(`/csrf`)로 받아 헤더에 넣는 쪽을 권장합니다.', DATE_SUB(NOW(), INTERVAL 20 HOUR));

-- ── 9. 좋아요 ────────────────────────────────────────────────────────────────
INSERT INTO `likes` (`user_id`, `post_id`, `created_at`) VALUES
(1,1,DATE_SUB(NOW(), INTERVAL 13 DAY)),(3,1,DATE_SUB(NOW(), INTERVAL 12 DAY)),(6,1,DATE_SUB(NOW(), INTERVAL 11 DAY)),
(2,2,DATE_SUB(NOW(), INTERVAL 11 DAY)),(4,2,DATE_SUB(NOW(), INTERVAL 10 DAY)),(5,2,DATE_SUB(NOW(), INTERVAL 9 DAY)),(6,2,DATE_SUB(NOW(), INTERVAL 8 DAY)),
(2,3,DATE_SUB(NOW(), INTERVAL 8 DAY)),(6,3,DATE_SUB(NOW(), INTERVAL 7 DAY)),
(3,4,DATE_SUB(NOW(), INTERVAL 7 DAY)),(5,4,DATE_SUB(NOW(), INTERVAL 6 DAY)),
(2,5,DATE_SUB(NOW(), INTERVAL 6 DAY)),(5,5,DATE_SUB(NOW(), INTERVAL 5 DAY)),
(4,8,DATE_SUB(NOW(), INTERVAL 3 DAY)),(2,8,DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2,11,DATE_SUB(NOW(), INTERVAL 1 DAY)),(1,11,DATE_SUB(NOW(), INTERVAL 20 HOUR)),
(2,12,DATE_SUB(NOW(), INTERVAL 12 HOUR)),(5,12,DATE_SUB(NOW(), INTERVAL 10 HOUR));

-- ── 10. 질문 요청 (다양한 상태) ─────────────────────────────────────────────
INSERT INTO `question_requests` (`id`, `requester_id`, `receiver_id`, `title`, `content`, `status`, `created_at`) VALUES
(1, 2, 1, '시큐리티 필터 체인에서 AccessDenied 원인 분석 요청',
 '관리자 API는 403, 일반 API는 200입니다. 필터 순서 로그 첨부했습니다. 어느 지점부터 보면 좋을까요?', 'ACCEPTED', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(2, 2, 3, 'JPA cascade 설정 때문에 삭제가 전파되는 문제',
 '@OneToMany cascade=ALL 때문에 부모 삭제 시 자식까지 지워집니다. 안전한 설정 조합이 궁금합니다.', 'PENDING', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 6, 3, '트랜잭션 readOnly인데 update 쿼리가 나가는 이유',
 '서비스 클래스에 @Transactional(readOnly=true)인데 로그에 update가 찍힙니다.', 'ACCEPTED', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(4, 5, 1, 'OAuth2 로그인 후 세션이 바로 만료됩니다',
 '구글 로그인은 성공하는데 첫 API 호출부터 401입니다.', 'REJECTED', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 2, 3, 'Querydsl 페이징 + fetch join 동시 적용 문의',
 '중복 페이징 이슈가 있어서 일단 보류하려고 취소합니다.', 'CANCELLED', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(6, 6, 1, 'Redis 세션 직렬화 오류 (SerializationException)',
 '세션에 넣은 DTO 직렬화가 실패합니다. Jackson 모듈 설정 조언 부탁드려요.', 'PENDING', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- ── 11. 1:1 질문 (수락된 건) ─────────────────────────────────────────────────
INSERT INTO `questions` (`id`, `request_id`, `user_id`, `mentor_id`, `title`, `content`, `status`, `created_at`) VALUES
(1, 1, 2, 1, 'CustomFilter 위치와 AccessDenied 로그 해석',
 '필터 체인 로그를 붙였습니다. UsernamePasswordAuthenticationFilter 앞에 둔 커스텀 필터가 원인일까요?', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 3, 6, 3, 'readOnly 트랜잭션인데 update 쿼리 발생',
 '서비스 진입/종료 로그와 함께 캡처했습니다. OSIV 영향일까요?', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- ── 12. 답변 (채팅처럼 여러 턴) ───────────────────────────────────────────────
INSERT INTO `answers` (`id`, `question_id`, `author_id`, `author_role`, `content`, `created_at`) VALUES
(1, 1, 1, 'MENTOR', '로그상으로는 인증은 됐는데 authorization 단계에서 막힙니다. `@PreAuthorize`와 URL 패턴 우선순위를 먼저 비교해보세요.', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 1, 2, 'ASKER',  'URL 패턴은 permitAll인데 메서드 보안만 authenticated네요. 메서드 쪽을 수정하면 될까요?', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(3, 1, 1, 'MENTOR', '네. `requestMatchers`와 `@EnableMethodSecurity`가 동시에 있으면 더 제한적인 쪽이 적용되는 경우가 많습니다.', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(4, 1, 2, 'ASKER',  '메서드 보안 조정 후 해결됐습니다. 감사합니다!', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 2, 3, 'MENTOR', 'OSIV가 켜져 있으면 readOnly여도 영속성 컨텍스트 flush 시점에 update가 나갈 수 있어요. `spring.jpa.open-in-view=false`로 재현해보세요.', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(6, 2, 6, 'ASKER',  'false로 바꾸니 update가 사라졌습니다. Lazy 로딩은 DTO 조회로 바꿀게요.', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- ── 13. 결제 내역 (코린이 구독 결제는 시연 중 생성 — 질문 결제만 사전 데이터) ──
INSERT INTO `payments` (`user_id`, `target_id`, `payment_type`, `price`, `status`, `created_at`) VALUES
(5, 3, 'SUBSCRIPTION', 3900, 'PAID', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(6, 1, 'SUBSCRIPTION', 4900, 'PAID', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(2, 1, 'QUESTION',     9900, 'PAID', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(6, 2, 'QUESTION',     5900, 'PAID', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- ── 14. 신고 (관리자 화면용 1건) ─────────────────────────────────────────────
INSERT INTO `reports` (`reporter_id`, `reported_post_id`, `reason_category`, `reason_detail`, `status`, `created_at`) VALUES
(1, 7, 'SPAM', '외부 홍보 링크가 본문 하단에 다수 포함되어 있어 검토 요청드립니다.', 'PENDING', DATE_SUB(NOW(), INTERVAL 2 DAY));

COMMIT;

-- =============================================================================
-- 시연 시나리오 힌트 (코딩하는코린이 = 미구독·미팔로우 시작)
-- =============================================================================
-- [비로그인] 홈 피드 → 최고관리자 구독자 전용 글 → 잠금 배너 확인
-- [코딩하는코린이 로그인] 동일 글 → 여전히 잠금 → 구독하기 → 결제 → 본문 열림 ★
-- [김개발 글] 팔로우 → 질문하기 (또는 보낸 요청 #2 PENDING 확인)
-- [구독 관리] 라이브 구독 후 목록에 최고관리자 표시
-- [김개발 로그인] 받은 요청 #2 수락 · 받은 질문 채팅 답변
-- [코딩하는코린이] 보낸 질문 #1 — 과거 질문 채팅은 유지 (구독과 무관)
-- =============================================================================
