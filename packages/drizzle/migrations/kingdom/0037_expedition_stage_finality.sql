CREATE TABLE "opencok_kingdom"."expedition_stage_closure" (
	"periodId" varchar(40) NOT NULL,
	"stage" integer NOT NULL,
	"opponent" integer NOT NULL,
	"startTime" bigint NOT NULL,
	"endTime" bigint NOT NULL,
	"phase" integer NOT NULL,
	"cursor" varchar(40) NOT NULL,
	"processed" bigint NOT NULL,
	"scoreCount" bigint NOT NULL,
	"digest" varchar(32) NOT NULL,
	"total" double precision NOT NULL,
	"createdAt" bigint NOT NULL,
	"winner" integer NOT NULL,
	"finalizedAt" bigint NOT NULL,
	CONSTRAINT "expedition_stage_closure_PRIMARY" PRIMARY KEY("periodId","stage"),
	CONSTRAINT "expedition_stage_closure_bounds" CHECK ("stage" BETWEEN 2 AND 8 AND "opponent">0 AND "startTime">=0 AND "endTime">"startTime" AND "createdAt">="endTime" AND "phase" BETWEEN 0 AND 3 AND "processed">=0 AND "processed"<="scoreCount" AND "scoreCount"<=1000000 AND "total">=0 AND "total"<'Infinity'::double precision AND "winner">=0 AND "finalizedAt">=0)
);

CREATE TABLE "opencok_kingdom"."expedition_stage_member" (
	"periodId" varchar(40) NOT NULL,
	"stage" integer NOT NULL,
	"uid" varchar(40) NOT NULL,
	"score" double precision NOT NULL,
	"allianceId" varchar(40) NOT NULL,
	"takeReward" varchar(500) NOT NULL,
	"eligibility" text NOT NULL,
	"metadata" text,
	CONSTRAINT "expedition_stage_member_PRIMARY" PRIMARY KEY("periodId","stage","uid"),
	CONSTRAINT "expedition_stage_member_bounds" CHECK ("stage" BETWEEN 2 AND 8 AND "score">=0 AND "score"<'Infinity'::double precision AND octet_length("eligibility")<=65536 AND ("metadata" IS NULL OR octet_length("metadata")<=8192))
);

CREATE INDEX "expedition_stage_closure_pending" ON "opencok_kingdom"."expedition_stage_closure" USING btree ("phase","endTime");
