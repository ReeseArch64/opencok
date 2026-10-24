CREATE TABLE "opencok_kingdom"."mail_chat_read_intent" (
	"commandId" uuid NOT NULL,
	"effectIndex" integer NOT NULL,
	"ownerUid" varchar(40) NOT NULL,
	"others" varchar(40) NOT NULL,
	"chatTypes" varchar(4) NOT NULL,
	"requestedAt" bigint NOT NULL,
	CONSTRAINT "mail_chat_read_intent_PRIMARY" PRIMARY KEY("commandId","effectIndex"),
	CONSTRAINT "mail_chat_read_intent_effect_range" CHECK ("effectIndex" >= 0 AND "effectIndex" <= 1001),
	CONSTRAINT "mail_chat_read_intent_owner_nonempty" CHECK (length("ownerUid") > 0),
	CONSTRAINT "mail_chat_read_intent_types" CHECK ("chatTypes" IN ('1,20', '2', '3')),
	CONSTRAINT "mail_chat_read_intent_time_nonnegative" CHECK ("requestedAt" >= 0)
);

CREATE INDEX "mail_chat_read_intent_pending" ON "opencok_kingdom"."mail_chat_read_intent" USING btree ("requestedAt","commandId","effectIndex");
CREATE INDEX "mail_chat_read_intent_owner" ON "opencok_kingdom"."mail_chat_read_intent" USING btree ("ownerUid");