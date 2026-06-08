-- 1. 유저 데이터 (관리자 1명, 일반 유저 2명) 비밀번호 1234 통일
INSERT INTO `users` (`id`, `email`, `nickname`, `password`, `role`, `status`) VALUES
(1, 'admin@test.com', '최고관리자', '$2a$10$q820TvhJVwxz/vdxMK2F.OZRldQvAyPKfdGE/ASvlfkS5/XySFyQK', 'ADMIN', 'ACTIVE'),
(2, 'user1@test.com', '코딩하는코린이', '$2a$10$q820TvhJVwxz/vdxMK2F.OZRldQvAyPKfdGE/ASvlfkS5/XySFyQK', 'USER', 'ACTIVE'),
(3, 'user2@test.com', '김개발', '$2a$10$q820TvhJVwxz/vdxMK2F.OZRldQvAyPKfdGE/ASvlfkS5/XySFyQK', 'USER', 'ACTIVE');

-- 2. 태그 데이터
INSERT INTO `tags` (`id`, `name`) VALUES
(1, 'Spring Boot'),
(2, 'Spring Security');

-- 3. 리프레시 토큰 데이터 (일반 유저의 토큰)
INSERT INTO `refresh_tokens` (`user_id`, `token`, `is_revoked`, `expires_at`) VALUES
(2, 'mock_user_refresh_token_xyz789', 0, DATE_ADD(NOW(), INTERVAL 7 DAY));

-- 4. 구독 설정 데이터 (지식을 나누는 관리자의 멤버십 설정)
INSERT INTO `subscription_settings` (`user_id`, `price`, `description`) VALUES
(1, 4900, '관리자의 고급 에러 해결 노하우 및 1:1 답변 권한 프리미엄 패스'),
(2, 3900, '코딩하는코린이의 에러 해결 노하우 공유');

-- 4-1. 1:1 질문 단가 설정
INSERT INTO `question_settings` (`user_id`, `price`, `description`) VALUES
(1, 9900, '관리자 1:1 질문 — 에러 로그 분석 및 해결 방향 제시'),
(2, 5900, '코딩하는코린이 1:1 질문 — 코드 리뷰 및 디버깅 조언');

-- 5. 구독 내역 데이터 (일반 유저가 관리자를 구독)
INSERT INTO `subscriptions` (`subscriber_id`, `creator_id`, `expired_at`) VALUES
(2, 1, DATE_ADD(NOW(), INTERVAL 30 DAY));

-- 6. 팔로우 데이터 (일반 유저가 관리자를 팔로우)
INSERT INTO `follows` (`follower_id`, `following_id`) VALUES
(2, 1);

-- 7. 질문 요청 데이터 (일반 유저가 관리자 멘토에게 1:1 질문을 요청)
INSERT INTO `question_requests` (`id`, `requester_id`, `receiver_id`, `title`, `content`, `status`) VALUES
(1, 2, 1, '시큐리티 필터 체인 에러 건으로 요청드립니다.', '콘솔에 자꾸 AccessDenied가 뜨는데 조언이 필요합니다.', 'ACCEPTED');

-- 8. 게시글 데이터 (검색 메타 포함)
INSERT INTO `posts` (`id`, `user_id`, `title`, `content`, `troubleshooting_meta`, `visibility`, `status`) VALUES
(1, 2, '스프링 부트 컨텍스트 로드 에러 원인이 뭘까요?', '테스트 코드를 돌리는데 자꾸 Context 로드 실패가 뜹니다. 도와주세요!',
 JSON_OBJECT(
   'category', 'RUNTIME',
   'environment', JSON_OBJECT('framework', 'Spring Boot'),
   'error', JSON_OBJECT('type', 'ApplicationContext', 'message', 'Context load failed'),
   'symptom', '테스트 실행 시 ApplicationContext 로드 실패'
 ), 'PUBLIC', 'ACTIVE');

-- 9. 게시글 태그 매핑 데이터
INSERT INTO `post_tags` (`post_id`, `tag_id`) VALUES
(1, 1);

-- 10. 댓글 데이터 (관리자가 일반 유저의 글에 가이드를 주는 댓글 작성)
INSERT INTO `comments` (`id`, `post_id`, `user_id`, `parent_id`, `status`, `content`) VALUES
(1, 1, 1, NULL, 'ACTIVE', 'application.yml 파일의 프로필(Profile) 설정이나 DB 연결 정보를 먼저 확인해보세요.');

-- 11. 신고 데이터 (관리자가 모니터링 중 규칙 위반 글을 신고했다고 가정)
-- * CHECK 제약조건(대상 셋 중 하나만 입력) 만족
INSERT INTO `reports` (`reporter_id`, `reported_user_id`, `reported_post_id`, `reported_comment_id`, `reason_category`, `reason_detail`, `status`) VALUES
(1, NULL, 1, NULL, 'SPAM', '테스트용 도배성 글로 의심되어 일시 보류합니다.', 'PENDING');

-- 12. 좋아요 데이터 (관리자가 유저의 좋은 질문 글에 좋아요 클릭)
INSERT INTO `likes` (`user_id`, `post_id`) VALUES
(1, 1);

-- 13. 1:1 질문 데이터 (요청이 수락되어 생성된 일반 유저의 상세 질문)
INSERT INTO `questions` (`id`, `request_id`, `user_id`, `mentor_id`, `title`, `content`, `status`) VALUES
(1, 1, 2, 1, 'CustomFilter 순서 설정 문제', '혹시 커스텀 필터는 특정 필터 전후로만 등록해야 하나요?', 'ACTIVE');

-- 14. 답변 데이터 (멘토인 관리자가 작성한 최종 답변)
INSERT INTO `answers` (`id`, `question_id`, `author_id`, `author_role`, `content`) VALUES
(1, 1, 1, 'MENTOR', '네, 보통 UsernamePasswordAuthenticationFilter 전이나 후에 .addFilterBefore() 등을 사용해 정밀하게 제어합니다.');

-- 15. 이미지 데이터 (일반 유저의 게시글과 관리자의 답변에 들어간 이미지 예시)
INSERT INTO `images` (`target_type`, `target_id`, `image_path`, `image_seq`) VALUES
('POST', 1, '/uploads/posts/error_stacktrace.png', 1),
('ANSWER', 1, '/uploads/answers/security_architecture.png', 1);

-- 16. 결제 데이터 ( 추가된 3번 유저가 2번 유저 구독)
INSERT INTO `payments` (`user_id`, `target_id`, `payment_type`, `price`, `status`, `created_at`) VALUES
(3, 2, 'SUBSCRIPTION', 3900, 'PAID', NOW());

COMMIT;