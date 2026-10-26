CREATE TABLE "opencok_global"."special_event_purchase" (
	"eventId" varchar(128) NOT NULL,
	"ownerUid" varchar(40) NOT NULL,
	"kingdomId" integer NOT NULL,
	"exchangeId" varchar(40) NOT NULL,
	"periodStart" bigint NOT NULL,
	"periodEnd" bigint NOT NULL,
	"reservedAt" bigint NOT NULL,
	"purchaseTime" bigint DEFAULT 0 NOT NULL,
	"purchaseDay" bigint NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	"deliveredAt" bigint DEFAULT 0 NOT NULL,
	"nextAttemptAt" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "special_event_purchase_PRIMARY" PRIMARY KEY("eventId"),
	CONSTRAINT "special_event_purchase_state" CHECK ("state" BETWEEN 0 AND 2 AND "kingdomId" > 0),
	CONSTRAINT "special_event_purchase_period" CHECK ("periodStart" >= 0 AND "periodEnd" >= "periodStart" AND "reservedAt" BETWEEN "periodStart" AND "periodEnd"),
	CONSTRAINT "special_event_purchase_payment" CHECK (("state" = 1 AND "purchaseTime" > 0 AND "purchaseTime" BETWEEN "periodStart" AND "periodEnd" AND "purchaseDay" = "purchaseTime" / 86400000) OR ("state" IN (0, 2) AND "purchaseTime" = 0 AND "deliveredAt" = 0 AND "purchaseDay" = "reservedAt" / 86400000)),
	CONSTRAINT "special_event_purchase_clock" CHECK ("purchaseTime" >= 0 AND "purchaseDay" >= 0 AND "deliveredAt" >= 0 AND "nextAttemptAt" >= 0)
);
CREATE UNIQUE INDEX "special_event_purchase_daily" ON "opencok_global"."special_event_purchase" USING btree ("ownerUid","kingdomId","exchangeId","purchaseDay") WHERE "state" < 2;
CREATE INDEX "special_event_purchase_stock" ON "opencok_global"."special_event_purchase" USING btree ("periodStart","exchangeId","state");
CREATE INDEX "special_event_purchase_delivery" ON "opencok_global"."special_event_purchase" USING btree ("kingdomId","state","deliveredAt","nextAttemptAt","eventId");
