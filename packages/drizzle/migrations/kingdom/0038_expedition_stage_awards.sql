CREATE TABLE "opencok_kingdom"."expedition_stage_award" (
	"id" varchar(32) NOT NULL,
	"periodId" varchar(40) NOT NULL,
	"stage" integer NOT NULL,
	"ownerUid" varchar(40) NOT NULL,
	"payload" text NOT NULL,
	"createdAt" bigint NOT NULL,
	"deliveredAt" bigint DEFAULT 0 NOT NULL,
	"nextAttemptAt" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "expedition_stage_award_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "expedition_stage_award_bounds" CHECK ("stage" BETWEEN 2 AND 8 AND "createdAt">=0 AND "deliveredAt">=0 AND "nextAttemptAt">=0 AND octet_length("payload") BETWEEN 1 AND 1048576)
);

ALTER TABLE "opencok_kingdom"."expedition_stage_closure" ADD COLUMN "awardCursor" varchar(40) DEFAULT '' NOT NULL;
ALTER TABLE "opencok_kingdom"."expedition_stage_closure" ADD COLUMN "history" text;
CREATE INDEX "expedition_stage_award_pending" ON "opencok_kingdom"."expedition_stage_award" USING btree ("deliveredAt","nextAttemptAt","createdAt");