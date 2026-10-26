CREATE TABLE "opencok_global"."expedition_stage_period" (
	"periodId" varchar(40) NOT NULL,
	"stage" integer NOT NULL,
	"leader" integer NOT NULL,
	"opponent" integer NOT NULL,
	"startTime" bigint NOT NULL,
	"endTime" bigint NOT NULL,
	"state" integer NOT NULL,
	"createdAt" bigint NOT NULL,
	"finalizedAt" bigint NOT NULL,
	"winner" integer NOT NULL,
	"ranking" text,
	CONSTRAINT "expedition_stage_period_PRIMARY" PRIMARY KEY("periodId","stage","leader"),
	CONSTRAINT "expedition_stage_period_bounds" CHECK ("stage" BETWEEN 2 AND 8 AND "leader">0 AND "opponent">"leader" AND "startTime">=0 AND "endTime">"startTime" AND "createdAt">="endTime" AND "state" IN (0,1) AND "finalizedAt">=0 AND ("winner"=0 OR "winner" IN ("leader","opponent")))
);

CREATE TABLE "opencok_global"."expedition_stage_watermark" (
	"periodId" varchar(40) NOT NULL,
	"stage" integer NOT NULL,
	"kingdomId" integer NOT NULL,
	"opponent" integer NOT NULL,
	"digest" varchar(32) NOT NULL,
	"scoreCount" bigint NOT NULL,
	"total" double precision NOT NULL,
	"state" integer NOT NULL,
	"completedAt" bigint NOT NULL,
	CONSTRAINT "expedition_stage_watermark_PRIMARY" PRIMARY KEY("periodId","stage","kingdomId"),
	CONSTRAINT "expedition_stage_watermark_bounds" CHECK ("stage" BETWEEN 2 AND 8 AND "kingdomId">0 AND "opponent">0 AND "kingdomId"<>"opponent" AND "scoreCount">=0 AND "scoreCount"<=1000000 AND "total">=0 AND "total"<'Infinity'::double precision AND "state" IN (0,1) AND "completedAt">=0)
);

CREATE INDEX "expedition_stage_period_pending" ON "opencok_global"."expedition_stage_period" USING btree ("state","endTime");
