CREATE TABLE "opencok_kingdom"."continued_cost_rank_award" (
	"id" varchar(32) NOT NULL,
	"periodId" varchar(32) NOT NULL,
	"ownerUid" varchar(40) NOT NULL,
	"rank" integer NOT NULL,
	"payload" text NOT NULL,
	"createdAt" bigint NOT NULL,
	"deliveredAt" bigint DEFAULT 0 NOT NULL,
	"nextAttemptAt" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "continued_cost_rank_award_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "continued_cost_rank_award_bounds" CHECK ("rank" BETWEEN 1 AND 100 AND "createdAt">=0 AND "deliveredAt">=0 AND "nextAttemptAt">=0 AND octet_length("payload") BETWEEN 1 AND 65536)
);

ALTER TABLE "opencok_kingdom"."continued_cost_closure" ADD COLUMN "awardCursor" integer DEFAULT 0 NOT NULL;
ALTER TABLE "opencok_kingdom"."continued_cost_closure" ADD COLUMN "awardedAt" bigint DEFAULT 0 NOT NULL;
CREATE UNIQUE INDEX "continued_cost_rank_award_recipient" ON "opencok_kingdom"."continued_cost_rank_award" USING btree ("periodId","ownerUid");
CREATE INDEX "continued_cost_rank_award_pending" ON "opencok_kingdom"."continued_cost_rank_award" USING btree ("deliveredAt","nextAttemptAt","createdAt");
ALTER TABLE "opencok_kingdom"."continued_cost_closure" ADD CONSTRAINT "continued_cost_closure_awards" CHECK ("awardCursor" BETWEEN 0 AND 100 AND "awardedAt">=0);