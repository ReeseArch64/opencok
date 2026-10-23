-- Generated schema-only baseline. Original ROW_FORMAT=COMPACT becomes DYNAMIC, as in the legacy importer.
SET NAMES utf8mb4;
--> statement-breakpoint
CREATE TABLE `chat_session` (
  `token_hash` BINARY(32) NOT NULL,
  `uid` VARCHAR(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` DATETIME(3) NOT NULL,
  `expires_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`token_hash`),
  KEY `idx_session_uid_expiry` (`uid`, `expires_at`),
  KEY `idx_session_expiry` (`expires_at`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `chat_message` (
  `sequence_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `room_key` VARCHAR(160) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `sender_uid` VARCHAR(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `idempotency_key` VARBINARY(64) NOT NULL,
  `body` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` DATETIME(3) NOT NULL,
  `expires_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`sequence_id`),
  UNIQUE KEY `uq_sender_room_client` (`sender_uid`, `room_key`, `idempotency_key`),
  KEY `idx_room_sequence` (`room_key`, `sequence_id`),
  KEY `idx_message_expiry` (`expires_at`)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;
