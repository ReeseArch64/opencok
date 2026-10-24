CREATE TABLE "opencok_kingdom"."avatar_version_update" (
	"operationId" varchar(32) NOT NULL,
	"ownerUid" varchar(20) NOT NULL,
	"picVer" integer NOT NULL,
	"committedAt" bigint NOT NULL,
	"nextUpdateTime" bigint,
	"effects" text NOT NULL,
	"pendingEffects" integer NOT NULL,
	CONSTRAINT "avatar_version_update_PRIMARY" PRIMARY KEY("operationId"),
	CONSTRAINT "avatar_version_update_id" CHECK ("operationId" ~ '^[a-f0-9]{32}$'),
	CONSTRAINT "avatar_version_update_owner" CHECK ("ownerUid" ~ '^[0-9]{1,20}$'),
	CONSTRAINT "avatar_version_update_version" CHECK ("picVer" > 0 AND "picVer" % 1000000 BETWEEN 1 AND 999999),
	CONSTRAINT "avatar_version_update_time" CHECK ("committedAt" >= 0),
	CONSTRAINT "avatar_version_update_effects_size" CHECK (octet_length("effects") <= 65535),
	CONSTRAINT "avatar_version_update_pending_range" CHECK ("pendingEffects" BETWEEN 0 AND 7)
);

CREATE INDEX "avatar_version_update_pending" ON "opencok_kingdom"."avatar_version_update" USING btree ("pendingEffects","ownerUid","operationId");