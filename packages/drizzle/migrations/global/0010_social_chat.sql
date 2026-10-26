CREATE TABLE "opencok_chat"."chat_consumer" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"cursor" bigint DEFAULT 0 NOT NULL,
	"token" varchar(40) NOT NULL,
	"lease_until" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);

CREATE TABLE "opencok_chat"."chat_event" (
	"sequence" bigserial PRIMARY KEY NOT NULL,
	"id" varchar(40) NOT NULL,
	"kind" varchar(30) NOT NULL,
	"room" varchar(160) DEFAULT '' NOT NULL,
	"owner" varchar(40) NOT NULL,
	"target" varchar(40),
	"message" varchar(100),
	"data" jsonb,
	"created_at" bigint NOT NULL,
	"expires_at" bigint NOT NULL,
	CONSTRAINT "chat_event_id_unique" UNIQUE("id")
);

CREATE TABLE "opencok_chat"."chat_feed" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"owner" varchar(40) NOT NULL,
	"realm" integer NOT NULL,
	"alliance" varchar(40) DEFAULT '' NOT NULL,
	"parent" varchar(100),
	"type" integer NOT NULL,
	"body" jsonb NOT NULL,
	"created_at" bigint NOT NULL,
	"expires_at" bigint NOT NULL,
	"deleted_at" bigint
);

CREATE TABLE "opencok_chat"."chat_feed_notice" (
	"owner" varchar(40) NOT NULL,
	"feed" varchar(100) NOT NULL,
	"created_at" bigint NOT NULL,
	CONSTRAINT "chat_feed_notice_owner_feed_pk" PRIMARY KEY("owner","feed")
);

CREATE TABLE "opencok_chat"."chat_mailbox_intent" (
	"realm" integer NOT NULL,
	"owner" varchar(40) NOT NULL,
	"operation" varchar(40) NOT NULL,
	"effect" integer NOT NULL,
	"peer" varchar(40) NOT NULL,
	"type" integer NOT NULL,
	"action" varchar(10) NOT NULL,
	"cutoff" bigint NOT NULL,
	CONSTRAINT "chat_mailbox_intent_realm_operation_effect_type_pk" PRIMARY KEY("realm","operation","effect","type")
);

CREATE TABLE "opencok_chat"."chat_moderation" (
	"owner" varchar(40) PRIMARY KEY NOT NULL,
	"mute_until" bigint DEFAULT 0 NOT NULL,
	"notice_until" bigint DEFAULT 0 NOT NULL,
	"actor" varchar(40) NOT NULL,
	"reason" varchar(500) DEFAULT '' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"updated_at" bigint NOT NULL
);

CREATE TABLE "opencok_chat"."chat_operation" (
	"owner" varchar(40) NOT NULL,
	"operation_id" varchar(128) NOT NULL,
	"command" varchar(80) NOT NULL,
	"hash" varchar(64) NOT NULL,
	"response" "bytea" NOT NULL,
	"created_at" bigint NOT NULL,
	CONSTRAINT "chat_operation_owner_operation_id_pk" PRIMARY KEY("owner","operation_id")
);

CREATE TABLE "opencok_chat"."chat_owner_command" (
	"id" varchar(40) PRIMARY KEY NOT NULL,
	"actor" varchar(40) NOT NULL,
	"operation" varchar(128) NOT NULL,
	"owner" varchar(40) NOT NULL,
	"realm" integer NOT NULL,
	"kind" varchar(40) NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" bigint NOT NULL,
	"expires_at" bigint NOT NULL,
	"processed_at" bigint
);

CREATE TABLE "opencok_chat"."chat_private_member" (
	"room" varchar(40) NOT NULL,
	"owner" varchar(40) NOT NULL,
	"role" integer NOT NULL,
	"joined_at" bigint NOT NULL,
	"left_at" bigint,
	"read_sequence" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "chat_private_member_room_owner_pk" PRIMARY KEY("room","owner")
);

CREATE TABLE "opencok_chat"."chat_private_room" (
	"id" varchar(40) PRIMARY KEY NOT NULL,
	"owner" varchar(40) NOT NULL,
	"name" varchar(100) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" bigint NOT NULL,
	"deleted_at" bigint
);

CREATE TABLE "opencok_chat"."chat_relation" (
	"owner" varchar(40) NOT NULL,
	"other" varchar(40) NOT NULL,
	"kind" varchar(16) NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"id" varchar(40) DEFAULT '' NOT NULL,
	"facebook_id" varchar(80),
	"facebook_name" varchar(100),
	"created_at" bigint NOT NULL,
	CONSTRAINT "chat_relation_owner_other_kind_pk" PRIMARY KEY("owner","other","kind"),
	CONSTRAINT "chat_relation_kind" CHECK ("opencok_chat"."chat_relation"."kind" in ('contact','block','facebook'))
);

CREATE TABLE "opencok_chat"."chat_report" (
	"id" varchar(40) PRIMARY KEY NOT NULL,
	"owner" varchar(40) NOT NULL,
	"target" varchar(40) NOT NULL,
	"message" varchar(100),
	"reason" varchar(2000) NOT NULL,
	"created_at" bigint NOT NULL,
	"expires_at" bigint NOT NULL
);

CREATE TABLE "opencok_chat"."chat_social_import" (
	"owner" varchar(40) PRIMARY KEY NOT NULL,
	"realm" integer NOT NULL,
	"created_at" bigint NOT NULL
);

ALTER TABLE "opencok_chat"."chat_message" ALTER COLUMN "body" DROP NOT NULL;
ALTER TABLE "opencok_chat"."chat_mailbox_message" ADD COLUMN "sender_uid" varchar(40);
ALTER TABLE "opencok_chat"."chat_mailbox_message" ADD COLUMN "expires_at" bigint;
ALTER TABLE "opencok_chat"."chat_message" ADD COLUMN "body_hash" varchar(64);
ALTER TABLE "opencok_chat"."chat_message" ADD COLUMN "archive_at" text;
ALTER TABLE "opencok_chat"."chat_message" ADD COLUMN "post_type" integer DEFAULT 0 NOT NULL;
ALTER TABLE "opencok_chat"."chat_message" ADD COLUMN "version" integer DEFAULT 1 NOT NULL;
ALTER TABLE "opencok_chat"."chat_message" ADD COLUMN "deleted_at" text;
CREATE INDEX "chat_event_expiry" ON "opencok_chat"."chat_event" USING btree ("expires_at");
CREATE INDEX "chat_feed_alliance" ON "opencok_chat"."chat_feed" USING btree ("realm","alliance","created_at");
CREATE INDEX "chat_feed_owner" ON "opencok_chat"."chat_feed" USING btree ("owner","created_at");
CREATE INDEX "chat_feed_expiry" ON "opencok_chat"."chat_feed" USING btree ("expires_at");
CREATE INDEX "chat_mailbox_intent_owner" ON "opencok_chat"."chat_mailbox_intent" USING btree ("realm","owner","type","cutoff");
CREATE UNIQUE INDEX "chat_owner_command_receipt" ON "opencok_chat"."chat_owner_command" USING btree ("actor","operation");
CREATE INDEX "chat_owner_command_pending" ON "opencok_chat"."chat_owner_command" USING btree ("realm","processed_at","created_at");
CREATE INDEX "chat_private_member_owner" ON "opencok_chat"."chat_private_member" USING btree ("owner","left_at");
CREATE INDEX "chat_relation_other" ON "opencok_chat"."chat_relation" USING btree ("other","kind");
CREATE INDEX "chat_report_expiry" ON "opencok_chat"."chat_report" USING btree ("expires_at");
UPDATE "opencok_chat"."chat_message"
SET "archive_at" = to_char("created_at"::timestamp + interval '24 hours', 'YYYY-MM-DD HH24:MI:SS.MS'),
    "expires_at" = to_char("created_at"::timestamp + interval '168 hours', 'YYYY-MM-DD HH24:MI:SS.MS')
WHERE "room_key" = 'global_public' OR left("room_key",9) = 'alliance_';
UPDATE "opencok_chat"."chat_mailbox_message" SET "expires_at" = "created_at" + 2592000000 WHERE "expires_at" IS NULL;
