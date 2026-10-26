CREATE TABLE "opencok_global"."continued_cost_rank_watermark" (
	"periodId" varchar(32) NOT NULL,
	"kingdomId" integer NOT NULL,
	"digest" varchar(64) NOT NULL,
	"scoreCount" integer NOT NULL,
	"completedAt" bigint NOT NULL,
	CONSTRAINT "continued_cost_rank_watermark_PRIMARY" PRIMARY KEY("periodId","kingdomId"),
	CONSTRAINT "continued_cost_rank_watermark_bounds" CHECK ("kingdomId">0 AND "scoreCount" BETWEEN 0 AND 100 AND "completedAt">=0)
);
