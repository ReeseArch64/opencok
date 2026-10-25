CREATE TABLE "opencok_kingdom"."expedition_period" (
	"serverId" integer NOT NULL,
	"periodId" varchar(40) NOT NULL,
	"matchServerId" integer NOT NULL,
	"schedule" varchar(8192) NOT NULL,
	"startTime" bigint NOT NULL,
	"endTime" bigint NOT NULL,
	"victoryTimes" integer DEFAULT 0 NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "expedition_period_PRIMARY" PRIMARY KEY("serverId"),
	CONSTRAINT "expedition_period_bounds" CHECK ("serverId" > 0 AND "matchServerId" > 0 AND "matchServerId" <> "serverId" AND "startTime" >= 0 AND "endTime" > "startTime" AND "victoryTimes" >= 0 AND "count" >= 0)
);

CREATE TABLE "opencok_kingdom"."expedition_progress" (
	"uid" varchar(40) NOT NULL,
	"periodId" varchar(40) NOT NULL,
	"stage" integer NOT NULL,
	"score" double precision DEFAULT 0 NOT NULL,
	"takeReward" varchar(500) DEFAULT '' NOT NULL,
	CONSTRAINT "expedition_progress_PRIMARY" PRIMARY KEY("uid","periodId","stage"),
	CONSTRAINT "expedition_progress_bounds" CHECK ("stage" BETWEEN 0 AND 8 AND "score" >= 0 AND "score" < 'Infinity'::float8)
);
