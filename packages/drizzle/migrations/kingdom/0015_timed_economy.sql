CREATE TABLE "opencok_kingdom"."building_production" (
	"buildingId" varchar(40) NOT NULL,
	"ownerId" varchar(40) NOT NULL,
	"asset" varchar(32) NOT NULL,
	"settledAt" bigint NOT NULL,
	"amount" bigint NOT NULL,
	"remainder" bigint NOT NULL,
	"rates" varchar(32768) NOT NULL,
	CONSTRAINT "building_production_PRIMARY" PRIMARY KEY("buildingId"),
	CONSTRAINT "building_production_bounds" CHECK ("settledAt" >= 0 AND "amount" >= 0 AND "remainder" >= 0 AND "remainder" < 3600000000000)
);

CREATE TABLE "opencok_kingdom"."timed_activity" (
	"id" varchar(40) NOT NULL,
	"ownerId" varchar(40) NOT NULL,
	"queueId" varchar(40) NOT NULL,
	"type" integer NOT NULL,
	"itemId" varchar(255) NOT NULL,
	"startedAt" bigint NOT NULL,
	"dueAt" bigint NOT NULL,
	"version" integer NOT NULL,
	"status" integer NOT NULL,
	CONSTRAINT "timed_activity_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "timed_activity_state" CHECK ("status" IN (0, 1, 2) AND "version" >= 1 AND "dueAt" >= "startedAt")
);

CREATE INDEX "building_production_owner" ON "opencok_kingdom"."building_production" USING btree ("ownerId");
CREATE UNIQUE INDEX "timed_activity_running_queue" ON "opencok_kingdom"."timed_activity" USING btree ("queueId") WHERE "status" = 0;
CREATE INDEX "timed_activity_due" ON "opencok_kingdom"."timed_activity" USING btree ("status","dueAt");
CREATE INDEX "timed_activity_owner" ON "opencok_kingdom"."timed_activity" USING btree ("ownerId");