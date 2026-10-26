CREATE TABLE "opencok_global"."expedition_match_batch" (
	"periodId" varchar(32) NOT NULL,
	"admissionStart" bigint NOT NULL,
	"admissionEnd" bigint NOT NULL,
	"configuration" text NOT NULL,
	"seed" varchar(32) NOT NULL,
	"createdAt" bigint NOT NULL,
	"matchedAt" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "expedition_match_batch_PRIMARY" PRIMARY KEY("periodId"),
	CONSTRAINT "expedition_match_batch_bounds" CHECK ("admissionStart" >= 0 AND "admissionEnd" > "admissionStart" AND "createdAt" >= "admissionStart" AND ("matchedAt" = 0 OR "matchedAt" >= "admissionEnd") AND octet_length("configuration") BETWEEN 1 AND 8192)
);

CREATE TABLE "opencok_global"."expedition_match_realm" (
	"periodId" varchar(32) NOT NULL,
	"kingdomId" integer NOT NULL,
	"statistics" text NOT NULL,
	"previousMatch" integer NOT NULL,
	"registeredAt" bigint NOT NULL,
	"opponent" integer DEFAULT 0 NOT NULL,
	"matchedAt" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "expedition_match_realm_PRIMARY" PRIMARY KEY("periodId","kingdomId"),
	CONSTRAINT "expedition_match_realm_bounds" CHECK ("kingdomId" > 0 AND "previousMatch" >= 0 AND "previousMatch" <> "kingdomId" AND "registeredAt" >= 0 AND "opponent" >= 0 AND "opponent" <> "kingdomId" AND ("matchedAt" = 0 OR "matchedAt" >= "registeredAt") AND octet_length("statistics") BETWEEN 1 AND 8192)
);

