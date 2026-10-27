CREATE TABLE "opencok_kingdom"."vip_box_history" (
	"id" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"name" varchar(40) NOT NULL,
	"itemId" varchar(40) NOT NULL,
	"count" integer NOT NULL,
	"createdAt" bigint NOT NULL,
	CONSTRAINT "vip_box_history_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "vip_box_history_bounds" CHECK ("count" > 0 AND "createdAt" >= 0)
);

CREATE INDEX "vip_box_history_recent" ON "opencok_kingdom"."vip_box_history" USING btree ("createdAt","id");