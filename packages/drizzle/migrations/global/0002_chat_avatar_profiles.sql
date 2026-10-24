CREATE TABLE "opencok_chat"."chat_avatar_profile" (
	"owner_uid" varchar(20) NOT NULL,
	"kingdom_id" integer NOT NULL,
	"sequence" integer NOT NULL,
	"pic_ver" integer NOT NULL,
	"committed_at" bigint NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"platform" varchar(255) NOT NULL,
	CONSTRAINT "chat_avatar_profile_PRIMARY" PRIMARY KEY("owner_uid","kingdom_id"),
	CONSTRAINT "chat_avatar_profile_owner" CHECK ("owner_uid" ~ '^[0-9]{1,20}$'),
	CONSTRAINT "chat_avatar_profile_kingdom" CHECK ("kingdom_id" > 0),
	CONSTRAINT "chat_avatar_profile_sequence" CHECK ("sequence" BETWEEN 1 AND 999999),
	CONSTRAINT "chat_avatar_profile_version" CHECK ("pic_ver" >= 0 AND "pic_ver" % 1000000 = "sequence"),
	CONSTRAINT "chat_avatar_profile_time" CHECK ("committed_at" BETWEEN 0 AND 9007199254740991)
);
