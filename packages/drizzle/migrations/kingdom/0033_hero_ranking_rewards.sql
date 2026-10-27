CREATE TABLE "opencok_kingdom"."hero_rank_award" (
	"id" varchar(32) NOT NULL,
	"ownerUid" varchar(40) NOT NULL,
	"periodId" varchar(32) NOT NULL,
	"actId" varchar(40) NOT NULL,
	"member" varchar(40) NOT NULL,
	"type" integer NOT NULL,
	"rank" integer NOT NULL,
	"level" integer NOT NULL,
	"rewardId" varchar(255),
	"pinnedReward" text,
	"sender" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"contents" "bytea" NOT NULL,
	"createdAt" bigint NOT NULL,
	"deliveredAt" bigint DEFAULT 0 NOT NULL,
	"nextAttemptAt" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "hero_rank_award_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "hero_rank_award_bounds" CHECK ("type" BETWEEN 1 AND 4 AND "rank" BETWEEN 1 AND 5000 AND "level" BETWEEN 0 AND 4095 AND "createdAt" >= 0 AND ("deliveredAt" = 0 OR "deliveredAt" >= "createdAt") AND "nextAttemptAt" >= 0 AND octet_length("contents") <= 40000 AND ("pinnedReward" IS NULL OR octet_length("pinnedReward") <= 65535))
);

ALTER TABLE "opencok_kingdom"."hero_rank_closure" ADD COLUMN "awardCursor" varchar(40) DEFAULT '' NOT NULL;
CREATE INDEX "hero_rank_award_pending" ON "opencok_kingdom"."hero_rank_award" USING btree ("deliveredAt","nextAttemptAt","createdAt","id");