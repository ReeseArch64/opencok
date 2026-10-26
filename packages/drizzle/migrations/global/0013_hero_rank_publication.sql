CREATE TABLE "opencok_global"."hero_rank_owner" (
	"kingdomId" integer NOT NULL,
	"ownerEpoch" bigint NOT NULL,
	"instanceId" varchar(36) NOT NULL,
	"sequence" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "hero_rank_owner_PRIMARY" PRIMARY KEY("kingdomId"),
	CONSTRAINT "hero_rank_owner_bounds" CHECK ("kingdomId" > 0 AND "ownerEpoch" > 0 AND "sequence" >= 0)
);

CREATE TABLE "opencok_global"."hero_rank_score" (
	"rankKey" varchar(400) NOT NULL,
	"member" varchar(40) NOT NULL,
	"kingdomId" integer NOT NULL,
	"actId" varchar(40) NOT NULL,
	"eventId" varchar(200) NOT NULL,
	"type" integer NOT NULL,
	"level" integer NOT NULL,
	"endTime" bigint NOT NULL,
	"score" integer NOT NULL,
	"metadata" text,
	"ownerEpoch" bigint NOT NULL,
	"sequence" bigint NOT NULL,
	"observedAt" bigint NOT NULL,
	CONSTRAINT "hero_rank_score_PRIMARY" PRIMARY KEY("rankKey","member"),
	CONSTRAINT "hero_rank_score_bounds" CHECK ("kingdomId" > 0 AND "type" BETWEEN 1 AND 4 AND "level" BETWEEN 0 AND 4095 AND "endTime" > 0 AND "ownerEpoch" > 0 AND "sequence" > 0 AND "observedAt" >= 0 AND ("metadata" IS NULL OR octet_length("metadata") <= 8192))
);

CREATE INDEX "hero_rank_score_period" ON "opencok_global"."hero_rank_score" USING btree ("endTime","kingdomId","rankKey","member");
