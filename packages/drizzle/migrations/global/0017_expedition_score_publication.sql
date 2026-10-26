CREATE TABLE "opencok_global"."expedition_score" (
	"periodId" varchar(40) NOT NULL,
	"stage" integer NOT NULL,
	"member" varchar(40) NOT NULL,
	"kingdomId" integer NOT NULL,
	"opponent" integer NOT NULL,
	"allianceId" varchar(40) NOT NULL,
	"score" double precision NOT NULL,
	"metadata" text,
	"ownerEpoch" bigint NOT NULL,
	"sequence" bigint NOT NULL,
	"observedAt" bigint NOT NULL,
	"endTime" bigint NOT NULL,
	CONSTRAINT "expedition_score_PRIMARY" PRIMARY KEY("periodId","stage","member"),
	CONSTRAINT "expedition_score_bounds" CHECK ("stage" BETWEEN 0 AND 8 AND "kingdomId" > 0 AND "opponent" > 0 AND "opponent" <> "kingdomId" AND "score" >= 0 AND "score" < 'Infinity'::double precision AND "ownerEpoch" > 0 AND "sequence" > 0 AND "observedAt" >= 0 AND "endTime" > 0 AND ("metadata" IS NULL OR octet_length("metadata") <= 8192))
);

CREATE TABLE "opencok_global"."expedition_score_owner" (
	"kingdomId" integer NOT NULL,
	"ownerEpoch" bigint NOT NULL,
	"instanceId" varchar(40) NOT NULL,
	"sequence" bigint NOT NULL,
	CONSTRAINT "expedition_score_owner_PRIMARY" PRIMARY KEY("kingdomId"),
	CONSTRAINT "expedition_score_owner_bounds" CHECK ("kingdomId" > 0 AND "ownerEpoch" > 0 AND "sequence" >= 0)
);

CREATE INDEX "expedition_score_end" ON "opencok_global"."expedition_score" USING btree ("endTime");
CREATE INDEX "expedition_score_realm" ON "opencok_global"."expedition_score" USING btree ("kingdomId","periodId","stage");
