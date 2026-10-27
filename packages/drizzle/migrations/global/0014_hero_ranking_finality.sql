CREATE TABLE "opencok_global"."hero_rank_period" (
	"id" varchar(32) NOT NULL,
	"type" integer NOT NULL,
	"eventId" varchar(200) NOT NULL,
	"endTime" bigint NOT NULL,
	"group" varchar(255) NOT NULL,
	"expectedRealms" varchar(2048) NOT NULL,
	"createdAt" bigint NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	"finalizedAt" bigint DEFAULT 0 NOT NULL,
	"kingdomRank" varchar(255),
	CONSTRAINT "hero_rank_period_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "hero_rank_period_bounds" CHECK ("type" BETWEEN 1 AND 4 AND "endTime" > 0 AND "createdAt" >= "endTime" AND "state" IN (0,1) AND (("state" = 0 AND "finalizedAt" = 0) OR ("state" = 1 AND "finalizedAt" >= "endTime")))
);

CREATE TABLE "opencok_global"."hero_rank_watermark" (
	"periodId" varchar(32) NOT NULL,
	"kingdomId" integer NOT NULL,
	"actId" varchar(40),
	"state" integer DEFAULT 0 NOT NULL,
	"digest" varchar(32) NOT NULL,
	"scoreCount" bigint DEFAULT 0 NOT NULL,
	"eligible" integer NOT NULL,
	"completedAt" bigint DEFAULT 0 NOT NULL,
	"total" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "hero_rank_watermark_PRIMARY" PRIMARY KEY("periodId","kingdomId"),
	CONSTRAINT "hero_rank_watermark_bounds" CHECK ("kingdomId" > 0 AND "state" IN (0,1) AND "scoreCount" >= 0 AND "scoreCount" <= 1000000 AND "eligible" IN (0,1) AND "completedAt" >= 0 AND ("actId" IS NOT NULL OR ("eligible" = 0 AND "scoreCount" = 0 AND "total" = 0)))
);

CREATE INDEX "hero_rank_period_pending" ON "opencok_global"."hero_rank_period" USING btree ("state","endTime");
CREATE INDEX "hero_rank_watermark_source" ON "opencok_global"."hero_rank_watermark" USING btree ("kingdomId","actId","state");
