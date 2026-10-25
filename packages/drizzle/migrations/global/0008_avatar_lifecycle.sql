ALTER TABLE "opencok_chat"."chat_avatar_profile" ADD COLUMN "revision" bigint NOT NULL DEFAULT 0;
ALTER TABLE "opencok_chat"."chat_avatar_profile" DROP CONSTRAINT "chat_avatar_profile_sequence";
ALTER TABLE "opencok_chat"."chat_avatar_profile" ADD CONSTRAINT "chat_avatar_profile_sequence" CHECK ("sequence" BETWEEN 0 AND 999999);
