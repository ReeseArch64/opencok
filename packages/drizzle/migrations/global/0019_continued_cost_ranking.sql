CREATE TABLE "opencok_global"."continued_cost_rank_owner" (
	"kingdomId" integer NOT NULL,
	"ownerEpoch" bigint NOT NULL,
	"instanceId" varchar(40) NOT NULL,
	"sequence" bigint NOT NULL,
	CONSTRAINT "continued_cost_rank_owner_PRIMARY" PRIMARY KEY("kingdomId"),
	CONSTRAINT "continued_cost_rank_owner_bounds" CHECK ("kingdomId">0 AND "ownerEpoch">0 AND "sequence">=0)
);

CREATE TABLE "opencok_global"."continued_cost_rank_period" (
	"id" varchar(32) NOT NULL,
	"startTime" bigint NOT NULL,
	"endTime" bigint NOT NULL,
	"type" integer NOT NULL,
	"rewards" text NOT NULL,
	"expectedRealms" varchar(2048) NOT NULL,
	"createdAt" bigint NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	"finalizedAt" bigint DEFAULT 0 NOT NULL,
	"revision" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "continued_cost_rank_period_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "continued_cost_rank_period_bounds" CHECK ("startTime">0 AND "endTime">"startTime" AND "type" BETWEEN 1 AND 6 AND "createdAt">=0 AND "state" IN (0,1) AND "finalizedAt">=0 AND "revision">=0 AND octet_length("rewards")<=8192)
);

CREATE TABLE "opencok_global"."continued_cost_rank_score" (
	"periodId" varchar(32) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"kingdomId" integer NOT NULL,
	"score" bigint NOT NULL,
	"paid" bigint NOT NULL,
	"free" bigint NOT NULL,
	"lastAt" bigint NOT NULL,
	"metadata" text NOT NULL,
	"ownerEpoch" bigint NOT NULL,
	"sequence" bigint NOT NULL,
	"observedAt" bigint NOT NULL,
	CONSTRAINT "continued_cost_rank_score_PRIMARY" PRIMARY KEY("periodId","uid"),
	CONSTRAINT "continued_cost_rank_score_bounds" CHECK ("kingdomId">0 AND "score">0 AND "paid">=0 AND "free">=0 AND "lastAt">0 AND "ownerEpoch">0 AND "sequence">0 AND "observedAt">=0 AND octet_length("metadata")<=8192)
);

CREATE INDEX "continued_cost_rank_period_end" ON "opencok_global"."continued_cost_rank_period" USING btree ("endTime");
CREATE INDEX "continued_cost_rank_score_realm" ON "opencok_global"."continued_cost_rank_score" USING btree ("kingdomId","periodId");
