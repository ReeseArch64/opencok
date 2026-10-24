CREATE TABLE "opencok_kingdom"."nickname_change" (
	"operationId" uuid NOT NULL,
	"ownerUid" varchar(40) NOT NULL,
	"newName" varchar(200) NOT NULL,
	"previousName" varchar(255) NOT NULL,
	"state" varchar(16) NOT NULL,
	"payment" text NOT NULL,
	"responseGold" bigint,
	"failureCode" varchar(20),
	"pendingEffects" integer DEFAULT 0 NOT NULL,
	"createdAt" bigint NOT NULL,
	"updatedAt" bigint NOT NULL,
	CONSTRAINT "nickname_change_PRIMARY" PRIMARY KEY("operationId"),
	CONSTRAINT "nickname_change_state" CHECK ("state" IN ('prepared', 'committed', 'refunded')),
	CONSTRAINT "nickname_change_owner" CHECK (length("ownerUid") > 0),
	CONSTRAINT "nickname_change_name" CHECK (length("newName") > 0),
	CONSTRAINT "nickname_change_payment_bound" CHECK (octet_length("payment") <= 8192),
	CONSTRAINT "nickname_change_pending_range" CHECK ("pendingEffects" BETWEEN 0 AND 31),
	CONSTRAINT "nickname_change_time" CHECK ("createdAt" >= 0 AND "updatedAt" >= "createdAt")
);

CREATE UNIQUE INDEX "nickname_change_prepared_owner" ON "opencok_kingdom"."nickname_change" USING btree ("ownerUid") WHERE "opencok_kingdom"."nickname_change"."state" = 'prepared';
CREATE INDEX "nickname_change_pending" ON "opencok_kingdom"."nickname_change" USING btree ("state","pendingEffects","ownerUid","operationId");