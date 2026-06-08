-- 기존 DB에 question_settings 테이블 추가
USE Errorlog;

CREATE TABLE IF NOT EXISTS `question_settings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `price` BIGINT NOT NULL DEFAULT 0,
    `description` TEXT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `UQ_QUESTION_SETTINGS_USER` UNIQUE (`user_id`),
    CONSTRAINT `FK_USERS_TO_QUESTION_SETTINGS` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

INSERT IGNORE INTO `question_settings` (`user_id`, `price`, `description`) VALUES
(1, 9900, '관리자 1:1 질문 — 에러 로그 분석 및 해결 방향 제시'),
(2, 5900, '코딩하는코린이 1:1 질문 — 코드 리뷰 및 디버깅 조언');
