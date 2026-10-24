CREATE TABLE "opencok_kingdom"."realm_authority" (
	"kingdomId" integer NOT NULL,
	"ownerEpoch" bigint NOT NULL,
	"instanceId" varchar(40) NOT NULL,
	"acquiredAt" bigint NOT NULL,
	CONSTRAINT "realm_authority_PRIMARY" PRIMARY KEY("kingdomId"),
	CONSTRAINT "realm_authority_kingdom_positive" CHECK ("opencok_kingdom"."realm_authority"."kingdomId" > 0),
	CONSTRAINT "realm_authority_epoch_positive" CHECK ("opencok_kingdom"."realm_authority"."ownerEpoch" > 0)
);

CREATE TABLE "opencok_kingdom"."resource_settlement" (
	"uid" varchar(40) NOT NULL,
	"fromTime" bigint NOT NULL,
	"toTime" bigint NOT NULL,
	"ownerEpoch" bigint NOT NULL,
	"foodBefore" bigint NOT NULL,
	"foodAfter" bigint NOT NULL,
	"boundBefore" bigint NOT NULL,
	"boundAfter" bigint NOT NULL,
	"starvingMillis" bigint NOT NULL,
	"troopChanges" jsonb NOT NULL,
	CONSTRAINT "resource_settlement_uid_fromTime_toTime_pk" PRIMARY KEY("uid","fromTime","toTime"),
	CONSTRAINT "resource_settlement_interval" CHECK ("opencok_kingdom"."resource_settlement"."toTime" > "opencok_kingdom"."resource_settlement"."fromTime"),
	CONSTRAINT "resource_settlement_epoch" CHECK ("opencok_kingdom"."resource_settlement"."ownerEpoch" > 0),
	CONSTRAINT "resource_settlement_starvation" CHECK ("opencok_kingdom"."resource_settlement"."starvingMillis" >= 0)
);
