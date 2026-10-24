CREATE TABLE "opencok_kingdom"."mail_update" (
	"toUser" varchar(40) NOT NULL,
	"mailUid" varchar(40) NOT NULL,
	"updateTime" bigint NOT NULL,
	CONSTRAINT "mail_update_PRIMARY" PRIMARY KEY("toUser","mailUid"),
	CONSTRAINT "mail_update_time_nonnegative" CHECK ("updateTime" >= 0)
);

CREATE INDEX "mail_update_owner_time" ON "opencok_kingdom"."mail_update" USING btree ("toUser","updateTime");