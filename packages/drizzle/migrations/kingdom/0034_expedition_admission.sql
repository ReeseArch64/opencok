CREATE TABLE "opencok_kingdom"."expedition_admission" (
	"periodId" varchar(32) NOT NULL,
	"startTime" bigint NOT NULL,
	"endTime" bigint NOT NULL,
	"activityEnd" bigint NOT NULL,
	"statistics" text NOT NULL,
	"previousMatch" integer NOT NULL,
	"createdAt" bigint NOT NULL,
	"appliedAt" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "expedition_admission_PRIMARY" PRIMARY KEY("periodId"),
	CONSTRAINT "expedition_admission_bounds" CHECK ("startTime" >= 0 AND "endTime" > "startTime" AND "activityEnd" > "endTime" AND "previousMatch" >= 0 AND "createdAt" >= "startTime" AND "createdAt" < "endTime" AND ("appliedAt" = 0 OR "appliedAt" >= "endTime") AND octet_length("statistics") BETWEEN 1 AND 8192)
);

CREATE INDEX "expedition_admission_pending" ON "opencok_kingdom"."expedition_admission" USING btree ("appliedAt","activityEnd");