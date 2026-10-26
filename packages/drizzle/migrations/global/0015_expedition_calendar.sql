CREATE TABLE "opencok_global"."expedition_calendar" (
	"id" varchar(32) NOT NULL,
	"startTime" bigint NOT NULL,
	"endTime" bigint NOT NULL,
	"schedule" text NOT NULL,
	"expectedRealms" varchar(1535) NOT NULL,
	"createdAt" bigint NOT NULL,
	"cycle" integer NOT NULL,
	"state" integer NOT NULL,
	"sourceId" varchar(40),
	CONSTRAINT "expedition_calendar_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "expedition_calendar_bounds" CHECK ("startTime" >= 0 AND "endTime" > "startTime" AND "createdAt" >= "startTime" AND "createdAt" < "endTime" AND "cycle" > 0 AND "state" IN (0,1) AND octet_length("schedule") BETWEEN 1 AND 8192 AND length("expectedRealms") > 0)
);

CREATE INDEX "expedition_calendar_latest" ON "opencok_global"."expedition_calendar" USING btree ("endTime");
CREATE UNIQUE INDEX "expedition_calendar_active" ON "opencok_global"."expedition_calendar" USING btree ("state") WHERE "state" = 0;