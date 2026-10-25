CREATE TABLE "opencok_kingdom"."totem_activation" (
	"id" varchar(40) NOT NULL,
	"ownerUid" varchar(40) NOT NULL,
	"pointId" integer NOT NULL,
	"totemId" integer NOT NULL,
	"allianceId" varchar(40) NOT NULL,
	"startedAt" bigint NOT NULL,
	"dueAt" bigint NOT NULL,
	"status" integer NOT NULL,
	"payload" "bytea" NOT NULL,
	CONSTRAINT "totem_activation_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "totem_activation_bounds" CHECK ("pointId" > 0 AND "totemId" > 0 AND "startedAt" >= 0 AND "dueAt" >= "startedAt" AND "status" IN (0, 1, 2) AND octet_length("payload") <= 4096)
);

CREATE TABLE "opencok_kingdom"."totem_delivery" (
	"activationId" varchar(40) NOT NULL,
	"targetUid" varchar(40) NOT NULL,
	"stateId" integer NOT NULL,
	"appliedAt" bigint NOT NULL,
	CONSTRAINT "totem_delivery_PRIMARY" PRIMARY KEY("activationId","targetUid"),
	CONSTRAINT "totem_delivery_bounds" CHECK ("stateId" > 0 AND "appliedAt" >= 0)
);

CREATE INDEX "totem_activation_due" ON "opencok_kingdom"."totem_activation" USING btree ("status","dueAt","id");
CREATE INDEX "totem_activation_owner" ON "opencok_kingdom"."totem_activation" USING btree ("ownerUid","status");
CREATE INDEX "totem_delivery_pending" ON "opencok_kingdom"."totem_delivery" USING btree ("targetUid","appliedAt","activationId");