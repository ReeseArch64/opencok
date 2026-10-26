CREATE TABLE "opencok_kingdom"."world_interest" (
	"ownerUid" varchar(40) NOT NULL,
	"worldId" integer NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"updatedAt" bigint NOT NULL,
	CONSTRAINT "world_interest_PRIMARY" PRIMARY KEY("ownerUid"),
	CONSTRAINT "world_interest_bounds" CHECK ("worldId" >= 0 AND "x" >= 0 AND "y" >= 0 AND "updatedAt" >= 0)
);

CREATE TABLE "opencok_kingdom"."world_march_checkpoint" (
	"id" varchar(40) NOT NULL,
	"ownerUid" varchar(40) NOT NULL,
	"version" integer NOT NULL,
	"status" integer NOT NULL,
	"dueAt" bigint NOT NULL,
	"payload" "bytea" NOT NULL,
	CONSTRAINT "world_march_checkpoint_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "world_march_checkpoint_bounds" CHECK ("version" >= 1 AND "status" IN (0, 1) AND "dueAt" >= 0 AND octet_length("payload") <= 65535)
);

CREATE INDEX "world_march_checkpoint_due" ON "opencok_kingdom"."world_march_checkpoint" USING btree ("status","dueAt","id");
CREATE INDEX "world_march_checkpoint_owner" ON "opencok_kingdom"."world_march_checkpoint" USING btree ("ownerUid");