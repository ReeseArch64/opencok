CREATE TABLE "opencok_global"."hero_match_period" (
	"id" varchar(32) NOT NULL,
	"definition" varchar(100) NOT NULL,
	"startTime" bigint NOT NULL,
	"endTime" bigint NOT NULL,
	"admissionEnd" bigint NOT NULL,
	"groupSize" integer NOT NULL,
	"matchSize" integer NOT NULL,
	"matchedAt" bigint DEFAULT 0 NOT NULL,
	"createdAt" bigint NOT NULL,
	CONSTRAINT "hero_match_period_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "hero_match_period_bounds" CHECK ("startTime" >= 0 AND "createdAt" >= "startTime" AND "admissionEnd" > "createdAt" AND "endTime" > "admissionEnd" AND "groupSize" BETWEEN 1 AND 128 AND "matchSize" BETWEEN 1 AND 16 AND "matchSize" <= "groupSize" AND ("matchedAt" = 0 OR ("matchedAt" >= "admissionEnd" AND "matchedAt" < "endTime")))
);

CREATE TABLE "opencok_global"."hero_match_realm" (
	"periodId" varchar(32) NOT NULL,
	"kingdomId" integer NOT NULL,
	"power" bigint NOT NULL,
	"shuffle" integer NOT NULL,
	"registeredAt" bigint NOT NULL,
	"serverGroup" varchar(255),
	"matchedAt" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "hero_match_realm_PRIMARY" PRIMARY KEY("periodId","kingdomId"),
	CONSTRAINT "hero_match_realm_bounds" CHECK ("kingdomId" > 0 AND "power" >= 0 AND "shuffle" >= 0 AND "registeredAt" >= 0 AND (("serverGroup" IS NULL AND "matchedAt" = 0) OR ("serverGroup" IS NOT NULL AND length("serverGroup") > 0 AND "matchedAt" >= "registeredAt")))
);
