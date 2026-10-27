CREATE TABLE "opencok_kingdom"."expedition_clock" (
	"serverId" integer NOT NULL,
	"periodId" varchar(40) NOT NULL,
	"stage" integer NOT NULL,
	"startTime" bigint NOT NULL,
	"endTime" bigint NOT NULL,
	"opponent" integer NOT NULL,
	"revision" bigint NOT NULL,
	"updatedAt" bigint NOT NULL,
	CONSTRAINT "expedition_clock_PRIMARY" PRIMARY KEY("serverId"),
	CONSTRAINT "expedition_clock_bounds" CHECK ("serverId" > 0 AND "stage" BETWEEN 0 AND 8 AND "startTime" >= 0 AND "endTime" > "startTime" AND "opponent" >= 0 AND "opponent" <> "serverId" AND ("stage" < 2 OR "opponent" > 0) AND "revision" > 0 AND "updatedAt" >= 0)
);
