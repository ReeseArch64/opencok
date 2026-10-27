CREATE TABLE "opencok_kingdom"."hero_rank_closure" (
	"periodId" varchar(32) NOT NULL,
	"actId" varchar(40),
	"type" integer NOT NULL,
	"endTime" bigint NOT NULL,
	"group" varchar(255) NOT NULL,
	"eventId" varchar(200) NOT NULL,
	"eligible" integer NOT NULL,
	"phase" integer DEFAULT 0 NOT NULL,
	"cursor" varchar(40) DEFAULT '' NOT NULL,
	"processed" bigint DEFAULT 0 NOT NULL,
	"scoreCount" bigint NOT NULL,
	"digest" varchar(32) NOT NULL,
	"createdAt" bigint NOT NULL,
	"kingdomRank" varchar(255),
	CONSTRAINT "hero_rank_closure_PRIMARY" PRIMARY KEY("periodId"),
	CONSTRAINT "hero_rank_closure_bounds" CHECK ("type" BETWEEN 1 AND 4 AND "endTime" > 0 AND "createdAt" >= "endTime" AND "eligible" IN (0,1) AND "phase" BETWEEN 0 AND 3 AND "processed" >= 0 AND "processed" <= "scoreCount" AND "scoreCount" <= 1000000 AND ("actId" IS NOT NULL OR ("eligible" = 0 AND "scoreCount" = 0)))
);

CREATE INDEX "hero_rank_closure_pending" ON "opencok_kingdom"."hero_rank_closure" USING btree ("phase","endTime");
