CREATE TABLE "opencok_kingdom"."avatar_completion" (
	"ownerUid" varchar(20) NOT NULL,
	"sequence" integer NOT NULL,
	"hash" varchar(64) NOT NULL,
	"picVer" integer NOT NULL,
	"committedAt" bigint NOT NULL,
	"effects" text NOT NULL,
	"pendingEffects" integer NOT NULL,
	CONSTRAINT "avatar_completion_PRIMARY" PRIMARY KEY("ownerUid","sequence"),
	CONSTRAINT "avatar_completion_owner" CHECK ("ownerUid" ~ '^[0-9]{1,20}$'),
	CONSTRAINT "avatar_completion_sequence" CHECK ("sequence" >= 1 AND "sequence" <= 999999),
	CONSTRAINT "avatar_completion_hash" CHECK ("hash" ~ '^[a-f0-9]{64}$'),
	CONSTRAINT "avatar_completion_version" CHECK ("picVer" >= 0 AND "picVer" % 1000000 = "sequence"),
	CONSTRAINT "avatar_completion_time" CHECK ("committedAt" >= 0),
	CONSTRAINT "avatar_completion_effects_size" CHECK (octet_length("effects") <= 65535),
	CONSTRAINT "avatar_completion_pending_range" CHECK ("pendingEffects" >= 0 AND "pendingEffects" <= 7)
);

CREATE INDEX "avatar_completion_pending" ON "opencok_kingdom"."avatar_completion" USING btree ("pendingEffects","committedAt","ownerUid","sequence");