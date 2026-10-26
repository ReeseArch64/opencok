CREATE TABLE "opencok_kingdom"."continued_cost_closure" (
	"periodId" varchar(32) NOT NULL,
	"snapshot" text NOT NULL,
	"digest" varchar(64) NOT NULL,
	"scoreCount" integer NOT NULL,
	"createdAt" bigint NOT NULL,
	"phase" integer DEFAULT 0 NOT NULL,
	"finalizedAt" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "continued_cost_closure_PRIMARY" PRIMARY KEY("periodId"),
	CONSTRAINT "continued_cost_closure_bounds" CHECK ("scoreCount" BETWEEN 0 AND 100 AND "createdAt">=0 AND "phase" BETWEEN 0 AND 2 AND "finalizedAt">=0 AND octet_length("snapshot")<=1048576)
);
