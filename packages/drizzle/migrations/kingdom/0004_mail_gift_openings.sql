CREATE TABLE "opencok_kingdom"."mail_gift_opening" (
	"mailUid" varchar(40) NOT NULL,
	"sendTime" bigint NOT NULL,
	"toUser" varchar(40) NOT NULL,
	"openedAt" bigint NOT NULL,
	CONSTRAINT "mail_gift_opening_PRIMARY" PRIMARY KEY("mailUid","sendTime"),
	CONSTRAINT "mail_gift_opening_time_nonnegative" CHECK ("openedAt" >= 0)
);

CREATE INDEX "mail_gift_opening_pending" ON "opencok_kingdom"."mail_gift_opening" USING btree ("openedAt","mailUid","sendTime");