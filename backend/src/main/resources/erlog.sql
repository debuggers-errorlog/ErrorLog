CREATE DATABASE IF NOT EXISTS Errorlog
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

use Errorlog;

DROP TABLE IF EXISTS `images`;
DROP TABLE IF EXISTS `answers`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `comments`;
DROP TABLE IF EXISTS `likes`;
DROP TABLE IF EXISTS `post_tags`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `refresh_tokens`;
DROP TABLE IF EXISTS `subscription_settings`;
DROP TABLE IF EXISTS `subscriptions`;
DROP TABLE IF EXISTS `follows`;
DROP TABLE IF EXISTS `question_requests`;
DROP TABLE IF EXISTS `reports`;
DROP TABLE IF EXISTS `tags`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `nickname` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('ADMIN','USER') NOT NULL DEFAULT 'USER' COMMENT 'USER / ADMIN',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    `status` ENUM('ACTIVE', 'SUSPENDED', 'DELETED') NOT NULL DEFAULT 'ACTIVE',
    PRIMARY KEY (`id`),
    CONSTRAINT `UQ_USERS_EMAIL` UNIQUE (`email`),
    CONSTRAINT `UQ_USERS_NICKNAME` UNIQUE (`nickname`)
);

CREATE TABLE `tags` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `UQ_TAGS_NAME` UNIQUE (`name`)
);


CREATE TABLE `refresh_tokens` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `is_revoked` TINYINT(1) NOT NULL DEFAULT 0,
    `expires_at` DATETIME NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `UQ_REFRESH_TOKENS_TOKEN` UNIQUE (`token`),
    CONSTRAINT `FK_USERS_TO_REFRESH_TOKENS` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

CREATE TABLE `subscription_settings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `price` BIGINT NOT NULL DEFAULT 0,
    `description` TEXT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `UQ_SUB_SETTINGS_USER` UNIQUE (`user_id`),
    CONSTRAINT `FK_USERS_TO_SUBSCRIPTION_SETTINGS` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `subscriptions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `subscriber_id` BIGINT NOT NULL,
    `creator_id` BIGINT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `expired_at` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `UQ_SUBSCRIPTIONS` UNIQUE (`subscriber_id`, `creator_id`),
    CONSTRAINT `FK_USERS_TO_SUBSCRIPTIONS_SUB` FOREIGN KEY (`subscriber_id`) REFERENCES `users` (`id`),
    CONSTRAINT `FK_USERS_TO_SUBSCRIPTIONS_CREATOR` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `follows` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `follower_id` BIGINT NOT NULL,
    `following_id` BIGINT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `UQ_FOLLOWS` UNIQUE (`follower_id`, `following_id`),
    CONSTRAINT `FK_USERS_TO_FOLLOWS_FOLLOWER` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`),
    CONSTRAINT `FK_USERS_TO_FOLLOWS_FOLLOWING` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `question_requests` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `requester_id` BIGINT NOT NULL,
    `receiver_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `status` ENUM('PENDING','ACCEPTED','REJECTED','CANCELLED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_USERS_TO_QUESTION_REQUESTS_REQ` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`),
    CONSTRAINT `FK_USERS_TO_QUESTION_REQUESTS_REC` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `reports` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `reporter_id` BIGINT NOT NULL,
    `target_id` BIGINT NOT NULL,
    `reason_category` VARCHAR(50) NOT NULL,
    `reason_detail` TEXT NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `UQ_REPORTS` UNIQUE (`reporter_id`, `target_id`),
    CONSTRAINT `FK_USERS_TO_REPORTS_REPORTER` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`),
    CONSTRAINT `FK_USERS_TO_REPORTS_TARGET` FOREIGN KEY (`target_id`) REFERENCES `users` (`id`)
);


CREATE TABLE `posts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `visibility` ENUM('PUBLIC','SUBSCRIBERS') NOT NULL DEFAULT 'PUBLIC',
    `status` ENUM('ACTIVE','DELETED','HIDDEN') NOT NULL DEFAULT 'ACTIVE',
    `view_count` INT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL COMMENT '삭제 시에만 기록',
    `hidden_at` DATETIME NULL COMMENT '숨김 처리 시에만 기록',
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_USERS_TO_POSTS` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    INDEX `idx_posts_created_at` (`created_at`)
);

CREATE TABLE `post_tags` (
    `post_id` BIGINT NOT NULL,
    `tag_id` BIGINT NOT NULL,
    PRIMARY KEY (`post_id`, `tag_id`),
    CONSTRAINT `FK_POSTS_TO_POST_TAGS` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
    CONSTRAINT `FK_TAGS_TO_POST_TAGS` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
);


CREATE TABLE `comments` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `post_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `parent_id` BIGINT NULL COMMENT '대댓글용, 최상위 댓글은 무조건 NULL',
    `status` ENUM('ACTIVE','DELETED','HIDDEN') NOT NULL DEFAULT 'ACTIVE',
    `content` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL COMMENT '삭제 시에만 기록',
    `hidden_at` DATETIME NULL COMMENT '숨김 처리 시에만 기록',
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_POSTS_TO_COMMENTS` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    CONSTRAINT `FK_USERS_TO_COMMENTS` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `FK_COMMENTS_TO_COMMENTS` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`)
);

CREATE TABLE `likes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `post_id` BIGINT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `UQ_LIKES` UNIQUE (`user_id`, `post_id`),
    CONSTRAINT `FK_USERS_TO_LIKES` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `FK_POSTS_TO_LIKES` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`)
);


CREATE TABLE `questions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `request_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `mentor_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `status` ENUM('ACTIVE','DELETED','HIDDEN') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL COMMENT '삭제 시에만 기록',
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_QUESTION_REQUESTS_TO_QUESTIONS` FOREIGN KEY (`request_id`) REFERENCES `question_requests` (`id`),
    CONSTRAINT `FK_USERS_TO_QUESTIONS_USER` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `FK_USERS_TO_QUESTIONS_MENTOR` FOREIGN KEY (`mentor_id`) REFERENCES `users` (`id`),
    INDEX `idx_questions_created_at` (`created_at`)
);


CREATE TABLE `answers` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `question_id` BIGINT NOT NULL,
    `author_id`   BIGINT NOT NULL,   -- 답변 작성자 (닉네임 표시용)
    `author_role` VARCHAR(10)  NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_QUESTIONS_TO_ANSWERS` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
);

CREATE TABLE IF NOT EXISTS `images` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `target_type` ENUM('POST', 'COMMENT', 'QUESTION', 'ANSWER') NOT NULL,
    `target_id` BIGINT NOT NULL,
    `image_path` VARCHAR(255) NOT NULL,
    `image_seq` INT NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_target` (`target_type`, `target_id`)
);