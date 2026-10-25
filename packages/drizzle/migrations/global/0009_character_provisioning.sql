CREATE TABLE "opencok_global"."character_provisioning" (
	"identityId" varchar(40) NOT NULL,
	"kingdomId" integer NOT NULL,
	"deviceUuid" varchar(100) NOT NULL,
	"gameUid" varchar(20) NOT NULL,
	"payload" varchar(4096) NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	"createdAt" bigint NOT NULL,
	"activatedAt" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "character_provisioning_PRIMARY" PRIMARY KEY("identityId","kingdomId"),
	CONSTRAINT "character_provisioning_state" CHECK ("state" IN (0, 1))
);

CREATE TABLE "opencok_global"."game_identity" (
	"id" varchar(40) NOT NULL,
	"issuer" varchar(255) NOT NULL,
	"subject" varchar(128) NOT NULL,
	"disabled" integer DEFAULT 0 NOT NULL,
	"createdAt" bigint NOT NULL,
	CONSTRAINT "game_identity_PRIMARY" PRIMARY KEY("id")
);

CREATE UNIQUE INDEX "character_provisioning_uid" ON "opencok_global"."character_provisioning" USING btree ("gameUid");
CREATE UNIQUE INDEX "character_provisioning_device" ON "opencok_global"."character_provisioning" USING btree ("kingdomId","deviceUuid");
CREATE UNIQUE INDEX "game_identity_provider" ON "opencok_global"."game_identity" USING btree ("issuer","subject");
