CREATE TABLE "opencok_chat"."chat_mailbox_message" (
	"kingdom_id" integer NOT NULL,
	"owner_uid" varchar(40) NOT NULL,
	"message_id" varchar(100) NOT NULL,
	"peer_uid" varchar(40) NOT NULL,
	"chat_type" integer NOT NULL,
	"created_at" bigint NOT NULL,
	"body" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	CONSTRAINT "chat_mailbox_message_kingdom_id_owner_uid_message_id_pk" PRIMARY KEY("kingdom_id","owner_uid","message_id"),
	CONSTRAINT "chat_mailbox_message_type" CHECK ("chat_type" IN (1, 2, 3, 20)),
	CONSTRAINT "chat_mailbox_message_owner" CHECK ("kingdom_id" > 0 AND length("owner_uid") > 0 AND length("message_id") > 0)
);

CREATE TABLE "opencok_chat"."chat_mailbox_receipt" (
	"kingdom_id" integer NOT NULL,
	"operation_id" uuid NOT NULL,
	"effect_index" integer NOT NULL,
	"owner_uid" varchar(40) NOT NULL,
	"payload_hash" varchar(64) NOT NULL,
	"requested_at" bigint NOT NULL,
	CONSTRAINT "chat_mailbox_receipt_kingdom_id_operation_id_effect_index_pk" PRIMARY KEY("kingdom_id","operation_id","effect_index")
);

CREATE INDEX "chat_mailbox_message_conversation" ON "opencok_chat"."chat_mailbox_message" USING btree ("kingdom_id","owner_uid","peer_uid","chat_type","created_at");