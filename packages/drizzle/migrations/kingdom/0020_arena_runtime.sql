CREATE TABLE "opencok_kingdom"."arena_registration" (
	"uid" varchar(40) NOT NULL,
	"rankScore" integer NOT NULL,
	"state" integer NOT NULL,
	"fightServerId" integer NOT NULL,
	"worldId" integer NOT NULL,
	"version" integer NOT NULL,
	"time" bigint NOT NULL,
	"totalWinCount" integer NOT NULL,
	"totalLoseCount" integer NOT NULL,
	"serialWinCount" integer NOT NULL,
	"applicationId" varchar(40) NOT NULL,
	CONSTRAINT "arena_registration_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "arena_registration_bounds" CHECK ("state" IN (0, 1, 2, 3) AND "rankScore" >= 0 AND "fightServerId" >= 0 AND "worldId" >= 0 AND "version" >= 0 AND "time" >= 0 AND "totalWinCount" >= 0 AND "totalLoseCount" >= 0 AND "serialWinCount" >= 0)
);

CREATE TABLE "opencok_kingdom"."user_arena_army" (
	"uid" varchar(40) NOT NULL,
	"armyId" varchar(40) NOT NULL,
	"free" integer NOT NULL,
	CONSTRAINT "user_arena_army_PRIMARY" PRIMARY KEY("uid","armyId"),
	CONSTRAINT "user_arena_army_quantity" CHECK ("free" >= 0)
);

CREATE INDEX "arena_registration_pending" ON "opencok_kingdom"."arena_registration" USING btree ("state","time","uid");