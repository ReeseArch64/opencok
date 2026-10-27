CREATE TABLE "opencok_kingdom"."recharge_feedback_claim" (
	"uid" varchar(40) NOT NULL,
	"id" varchar(40) NOT NULL,
	"startTime" bigint NOT NULL,
	"endTime" bigint NOT NULL,
	"createdAt" bigint NOT NULL,
	CONSTRAINT "recharge_feedback_claim_PRIMARY" PRIMARY KEY("uid","id","startTime","endTime"),
	CONSTRAINT "recharge_feedback_claim_bounds" CHECK ("startTime" >= 0 AND "endTime" >= "startTime" AND "createdAt" >= 0)
);
