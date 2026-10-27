CREATE TABLE "opencok_kingdom"."expedition_manifest" (
	"periodId" varchar(40) NOT NULL,
	"serverId" integer NOT NULL,
	"matchServerId" integer NOT NULL,
	"schedule" text NOT NULL,
	"startTime" bigint NOT NULL,
	"endTime" bigint NOT NULL,
	"recordedAt" bigint NOT NULL,
	CONSTRAINT "expedition_manifest_PRIMARY" PRIMARY KEY("periodId","serverId"),
	CONSTRAINT "expedition_manifest_bounds" CHECK ("serverId" > 0 AND "matchServerId" > 0 AND "serverId" <> "matchServerId" AND "startTime" >= 0 AND "endTime" > "startTime" AND "recordedAt" >= 0 AND octet_length("schedule") BETWEEN 1 AND 8192)
);

CREATE INDEX "expedition_manifest_end" ON "opencok_kingdom"."expedition_manifest" USING btree ("endTime");
INSERT INTO "opencok_kingdom"."expedition_manifest" ("periodId","serverId","matchServerId","schedule","startTime","endTime","recordedAt") SELECT "periodId","serverId","matchServerId","schedule","startTime","endTime",0 FROM "opencok_kingdom"."expedition_period" ON CONFLICT DO NOTHING;
