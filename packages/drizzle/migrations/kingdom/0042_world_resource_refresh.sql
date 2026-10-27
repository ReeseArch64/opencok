CREATE TABLE "opencok_kingdom"."world_resource_runtime" (
	"worldId" integer NOT NULL,
	"groupStartedAt" bigint NOT NULL,
	"usedGroups" varchar(128) NOT NULL,
	"areaCursor" integer NOT NULL,
	"nextRefreshAt" bigint NOT NULL,
	CONSTRAINT "world_resource_runtime_PRIMARY" PRIMARY KEY("worldId"),
	CONSTRAINT "world_resource_runtime_bounds" CHECK ("worldId" = 0 AND "groupStartedAt" >= 0 AND "areaCursor" >= 0 AND "nextRefreshAt" >= 0 AND octet_length("usedGroups") BETWEEN 1 AND 128)
);
