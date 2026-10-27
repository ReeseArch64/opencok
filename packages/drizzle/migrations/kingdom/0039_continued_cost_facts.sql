CREATE TABLE "opencok_kingdom"."continued_cost_fact" (
	"ownerUid" varchar(40) NOT NULL,
	"requestId" varchar(128) NOT NULL,
	"eventId" varchar(40) NOT NULL,
	"periodId" varchar(32) NOT NULL,
	"at" bigint NOT NULL,
	"amount" bigint NOT NULL,
	"paid" bigint NOT NULL,
	"free" bigint NOT NULL,
	"digest" varchar(64) NOT NULL,
	"createdAt" bigint NOT NULL,
	"counted" integer NOT NULL,
	CONSTRAINT "continued_cost_fact_PRIMARY" PRIMARY KEY("ownerUid","requestId","eventId"),
	CONSTRAINT "continued_cost_fact_bounds" CHECK ("at">0 AND "amount">0 AND "paid">=0 AND "free">=0 AND "createdAt">=0 AND "counted" IN (0,1))
);

CREATE TABLE "opencok_kingdom"."continued_cost_period" (
	"id" varchar(32) NOT NULL,
	"startTime" bigint NOT NULL,
	"endTime" bigint NOT NULL,
	"type" integer NOT NULL,
	"createdAt" bigint NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "continued_cost_period_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "continued_cost_period_bounds" CHECK ("startTime">0 AND "endTime">"startTime" AND "type" BETWEEN 1 AND 6 AND "createdAt">=0 AND "state" IN (0,1))
);

CREATE TABLE "opencok_kingdom"."continued_cost_score" (
	"periodId" varchar(32) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"total" bigint NOT NULL,
	"paid" bigint NOT NULL,
	"free" bigint NOT NULL,
	"lastAt" bigint NOT NULL,
	CONSTRAINT "continued_cost_score_PRIMARY" PRIMARY KEY("periodId","uid"),
	CONSTRAINT "continued_cost_score_bounds" CHECK ("total">0 AND "paid">=0 AND "free">=0 AND "lastAt">0)
);

CREATE INDEX "continued_cost_fact_period" ON "opencok_kingdom"."continued_cost_fact" USING btree ("periodId","ownerUid");
CREATE INDEX "continued_cost_period_end" ON "opencok_kingdom"."continued_cost_period" USING btree ("endTime");
CREATE INDEX "mutation_outbox_event_source" ON "opencok_kingdom"."mutation_outbox" USING btree ("kingdomId","eventType","createdAt");