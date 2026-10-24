CREATE TABLE "opencok_global"."nickname_change_receipt" (
	"operationId" uuid NOT NULL,
	"ownerUid" varchar(40) NOT NULL,
	"kingdomId" integer NOT NULL,
	"newName" varchar(200) NOT NULL,
	"committedAt" bigint NOT NULL,
	CONSTRAINT "nickname_change_receipt_PRIMARY" PRIMARY KEY("operationId"),
	CONSTRAINT "nickname_change_receipt_owner" CHECK (length("ownerUid") > 0),
	CONSTRAINT "nickname_change_receipt_realm" CHECK ("kingdomId" > 0),
	CONSTRAINT "nickname_change_receipt_name" CHECK (length("newName") > 0),
	CONSTRAINT "nickname_change_receipt_time" CHECK ("committedAt" >= 0)
);
