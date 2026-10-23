CREATE SCHEMA "cokdb1";
--> statement-breakpoint
CREATE TABLE "cokdb1"."ability_page" (
	"uid" varchar(40) NOT NULL,
	"page" integer DEFAULT 0 NOT NULL,
	"ability" "bytea",
	CONSTRAINT "ability_page_PRIMARY" PRIMARY KEY("uid","page"),
	CONSTRAINT "ability_page_ability_length" CHECK (octet_length("ability") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."accept_fb_record" (
	"uid" varchar(255) NOT NULL,
	"uuid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	CONSTRAINT "accept_fb_record_PRIMARY" PRIMARY KEY("uid","uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."account_lock" (
	"uid" varchar(255) NOT NULL,
	"lastLoginIp" varchar(50),
	"lastDeviceId" varchar(255),
	"lockSwitch" smallint,
	"locked" smallint,
	"emailAddr" varchar(200),
	"password" varchar(20),
	"verifCode" varchar(4),
	"verifCodeTime" bigint,
	"todayTime" bigint,
	"passwordErrorNum" integer,
	"passwordErrorTime" bigint,
	CONSTRAINT "account_lock_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "account_lock_lockSwitch_range" CHECK ("lockSwitch" BETWEEN -128 AND 127),
	CONSTRAINT "account_lock_locked_range" CHECK ("locked" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_0" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2024_0_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_1" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2024_1_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_2" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2024_2_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_3" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2024_3_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_4" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2024_4_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_5" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2024_5_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_6" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2024_6_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_7" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2024_7_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_8" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2024_8_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_9" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2024_9_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_0" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2026_0_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_1" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2026_1_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_10" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2026_10_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_11" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2026_11_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_2" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2026_2_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_3" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2026_3_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_4" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2026_4_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_5" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2026_5_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_6" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2026_6_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_7" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2026_7_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_8" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2026_8_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_9" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2026_9_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_0" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2027_0_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_1" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2027_1_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_10" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2027_10_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_11" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2027_11_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_2" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2027_2_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_3" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2027_3_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_4" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2027_4_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_5" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2027_5_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_6" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2027_6_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_7" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2027_7_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_8" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2027_8_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_9" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"action_type" integer NOT NULL,
	"cost_type" varchar(255),
	"cost_value" varchar(255),
	"get_type" varchar(255),
	"get_value" varchar(255),
	"param1" varchar(255),
	"param2" varchar(255),
	"update_time" bigint NOT NULL,
	CONSTRAINT "action_cost_record_2027_9_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_record_pack" (
	"uid" varchar(255) NOT NULL,
	"type" integer NOT NULL,
	"type1" integer,
	"time" bigint NOT NULL,
	"powerDelta" bigint,
	"deadDelta" integer DEFAULT 0 NOT NULL,
	"armyDelta" integer DEFAULT 0 NOT NULL,
	"item" varchar(40),
	"param" varchar(1024),
	"gold" integer
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."activation" (
	"code" varchar(40) NOT NULL,
	"series" integer,
	"user" varchar(40),
	"state" integer DEFAULT 0,
	CONSTRAINT "activation_PRIMARY" PRIMARY KEY("code")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."activity" (
	"id" bigint NOT NULL,
	"name" varchar(40),
	"type" integer NOT NULL,
	"openTime" bigint,
	"startTime" bigint,
	"endTime" bigint,
	"info1" varchar(60),
	CONSTRAINT "activity_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "activity_id_range" CHECK ("id" >= 0 AND "id" <= 4294967295)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."activity_cost" (
	"uid" varchar(40) NOT NULL,
	"type" integer NOT NULL,
	"total" bigint,
	"para1" bigint,
	"para2" bigint,
	"lv" integer,
	"updateTime" bigint,
	"getLv" varchar(40),
	CONSTRAINT "activity_cost_PRIMARY" PRIMARY KEY("uid","type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."activity_cost_log" (
	"uid" varchar(40) NOT NULL,
	"userId" varchar(40),
	"type" integer,
	"total" bigint,
	"lv" integer,
	"time" bigint,
	CONSTRAINT "activity_cost_log_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."activity_group_buys" (
	"id" varchar(40) NOT NULL,
	"curRound" integer NOT NULL,
	"startTime" bigint,
	"endTime" bigint,
	"roundInfo" text,
	CONSTRAINT "activity_group_buys_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."activity_minstrel" (
	"uid" varchar(32) NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"listen" integer NOT NULL,
	"listentime" bigint,
	"share" integer,
	"sharetime" bigint,
	"reward" integer,
	"rewardtime" bigint,
	"resettime" bigint,
	CONSTRAINT "activity_minstrel_PRIMARY" PRIMARY KEY("uid","type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."activity_monster" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"id" integer NOT NULL,
	"flushTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "activity_monster_PRIMARY" PRIMARY KEY("uid","id","flushTime")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."activity_new" (
	"type" varchar(11) NOT NULL,
	"activityInfo" varchar(2000) DEFAULT '',
	CONSTRAINT "activity_new_PRIMARY" PRIMARY KEY("type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."ad_building_attachment" (
	"uuid" varchar(36) NOT NULL,
	"serverid" integer,
	"skillid" integer,
	"cdtime" bigint,
	"skillstate" integer,
	"donateresource" varchar(300)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."ad_mat" (
	"uid" varchar(40) NOT NULL,
	"matId" varchar(200) NOT NULL,
	CONSTRAINT "ad_mat_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."ad_reward" (
	"uid" varchar(40) NOT NULL,
	"type" varchar(40) NOT NULL,
	"device" varchar(255),
	"time" bigint,
	"state" integer,
	"location" varchar(40),
	"dplink_type" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "ad_reward_PRIMARY" PRIMARY KEY("uid","type","dplink_type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."admin" (
	"uid" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."admin_uid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar(20) NOT NULL,
	"passmd5" varchar(40) NOT NULL,
	"language" varchar(8) NOT NULL,
	"auth" text NOT NULL,
	"groupid" integer DEFAULT 0 NOT NULL,
	"addtime" bigint NOT NULL,
	"lastactive" bigint NOT NULL,
	"roleIds" varchar(100),
	"default_module_id" integer DEFAULT -1,
	CONSTRAINT "admin_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."affairs" (
	"uid" varchar(40) NOT NULL,
	"type" integer NOT NULL,
	"ownerId" varchar(40) NOT NULL,
	"affairId" varchar(20) NOT NULL,
	"contentsId" varchar(20) NOT NULL,
	"rewardTime" bigint NOT NULL,
	"rewardNum" integer NOT NULL,
	"opt" integer NOT NULL,
	CONSTRAINT "affairs_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."affairs_value" (
	"uid" varchar(40) NOT NULL,
	"people" integer DEFAULT 0 NOT NULL,
	"refreshTime" bigint NOT NULL,
	"leagueTime" bigint NOT NULL,
	CONSTRAINT "affairs_value_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance" (
	"uid" varchar(40) NOT NULL,
	"alliancename" varchar(40),
	"abbr" varchar(10),
	"abbrRename" integer DEFAULT 0,
	"intro" varchar(200),
	"announce" varchar(200),
	"icon" varchar(40),
	"language" varchar(40),
	"country" varchar(40),
	"curMember" integer DEFAULT 0,
	"maxMember" integer,
	"recruit" integer,
	"oldfightpower" integer,
	"giftlevel" integer DEFAULT 0,
	"alliancepoint" bigint,
	"reicon" integer DEFAULT 0,
	"rankone" varchar(10),
	"ranktwo" varchar(10),
	"rankthree" varchar(10),
	"rankfour" varchar(10),
	"rankfive" varchar(10),
	"createtime" bigint NOT NULL,
	"dau" integer DEFAULT 0,
	"rallyPoint" integer,
	"ally" varchar(255),
	"enemy" varchar(255),
	"other" varchar(255),
	"powerRestriction" bigint DEFAULT 0,
	"castleRestriction" integer DEFAULT 0,
	"camp" integer DEFAULT 0,
	"crossFightEnemy" varchar(255),
	"ckfThroneFightFlag" integer DEFAULT 0,
	"cdfIndex" integer,
	"cdfVersion" integer,
	"targetScience" varchar(255),
	"permission" varchar(255),
	"wood" bigint DEFAULT 0,
	"food" bigint DEFAULT 0,
	"iron" bigint DEFAULT 0,
	"stone" bigint DEFAULT 0,
	"sandstone" bigint DEFAULT 0,
	"diamond" bigint DEFAULT 0,
	"marble" bigint DEFAULT 0,
	"granite" bigint DEFAULT 0,
	"limestone" bigint DEFAULT 0,
	"donateItem" varchar(255),
	"bannerStyle" varchar(50) NOT NULL,
	"taskNum" integer DEFAULT 0,
	"taskLimit" varchar(255),
	"taskFlushTime" bigint DEFAULT 0,
	CONSTRAINT "alliance_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_apply" (
	"uid" varchar(40) NOT NULL,
	"userId" varchar(40),
	"allianceId" varchar(40),
	"message" "bytea",
	"type" integer,
	"applyTime" bigint DEFAULT 0,
	CONSTRAINT "alliance_apply_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "alliance_apply_message_length" CHECK (octet_length("message") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_battle_record" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"attAllianceId" varchar(40) DEFAULT '' NOT NULL,
	"defAllianceId" varchar(40) DEFAULT '' NOT NULL,
	"type" integer NOT NULL,
	"report" "bytea" NOT NULL,
	"timeStamp" bigint NOT NULL,
	CONSTRAINT "alliance_battle_record_PRIMARY" PRIMARY KEY("uuid"),
	CONSTRAINT "alliance_battle_record_report_length" CHECK (octet_length("report") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_battle_team" (
	"id" varchar(40) NOT NULL,
	"type" integer NOT NULL,
	"targetId" integer NOT NULL,
	"targetUid" varchar(40),
	"targetName" varchar(255),
	"targetPic" varchar(40),
	"targetAName" varchar(40),
	"targetAAbbr" varchar(40),
	"targetAIcon" varchar(40),
	"targetType" integer DEFAULT 0,
	"leaderUid" varchar(40) NOT NULL,
	"leaderName" varchar(40) NOT NULL,
	"leaderId" integer,
	"allianceId" varchar(40) NOT NULL,
	"allianceName" varchar(40),
	"allianceAbbr" varchar(40),
	"allianceIcon" varchar(40),
	"maxSoldiers" integer NOT NULL,
	"waitTime" bigint NOT NULL,
	"createTime" bigint NOT NULL,
	"worldId" integer DEFAULT 0 NOT NULL,
	"failBackItem" integer DEFAULT 0,
	"superTeam" integer DEFAULT 0,
	CONSTRAINT "alliance_battle_team_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_blacklist" (
	"allianceId" varchar(40) NOT NULL,
	"black" varchar(500),
	"white" varchar(500),
	CONSTRAINT "alliance_blacklist_PRIMARY" PRIMARY KEY("allianceId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_boss" (
	"uid" varchar(40) NOT NULL,
	"itemNum" integer DEFAULT 0,
	"bossLevel" varchar(255),
	"todayCount" integer DEFAULT 0,
	"lastChallengeTime" bigint DEFAULT 0,
	"bossId" varchar(255),
	"maxHp" integer DEFAULT 0,
	"hp" integer DEFAULT 0,
	"startTime" bigint DEFAULT 0,
	"endTime" bigint DEFAULT 0,
	"power" integer DEFAULT 0,
	"rewards" varchar(255),
	"pointId" integer DEFAULT 0,
	"attackerNum" integer DEFAULT 0,
	"attackTimes" integer DEFAULT 0,
	"killUser" varchar(255),
	"lastHurt" integer DEFAULT 0,
	"userAttackInfo" text,
	CONSTRAINT "alliance_boss_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_boss_rank" (
	"uid" varchar(40) NOT NULL,
	"allianceId" varchar(40),
	"bossId" varchar(40),
	"useTime" bigint DEFAULT 0,
	CONSTRAINT "alliance_boss_rank_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_boss_record" (
	"uid" varchar(40) NOT NULL,
	"allianceId" varchar(40),
	"bossId" varchar(40),
	"maxHp" integer DEFAULT 0,
	"hp" integer DEFAULT 0,
	"startTime" bigint DEFAULT 0,
	"endTime" bigint DEFAULT 0,
	"pointId" integer DEFAULT 0,
	"attackerNum" integer DEFAULT 0,
	"attackTimes" integer DEFAULT 0,
	"killUser" varchar(40),
	"lastHurt" integer DEFAULT 0,
	"userAttackInfo" text,
	CONSTRAINT "alliance_boss_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_build_cost_record" (
	"uid" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"type" integer NOT NULL,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	"time" bigint NOT NULL,
	CONSTRAINT "alliance_build_cost_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_comment" (
	"uid" varchar(40) NOT NULL,
	"allianceId" varchar(40),
	"time" bigint,
	"senderUid" varchar(40),
	"senderAllianceId" varchar(40),
	"message" "bytea",
	"lang" varchar(10),
	"type" integer,
	"name" varchar(40),
	"abbr" varchar(10),
	"icon" varchar(10),
	"username" varchar(40),
	"userpic" varchar(40),
	CONSTRAINT "alliance_comment_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "alliance_comment_message_length" CHECK (octet_length("message") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_comment_shield" (
	"uuid" varchar(40) NOT NULL,
	"allianceId" varchar(40),
	"type" integer,
	"icon" varchar(10),
	"abbr" varchar(10),
	"name" varchar(40),
	CONSTRAINT "alliance_comment_shield_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_diplomacy" (
	"uid" varchar(255) NOT NULL,
	"ally" "bytea",
	"enemy" "bytea",
	"other" "bytea",
	CONSTRAINT "alliance_diplomacy_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "alliance_diplomacy_ally_length" CHECK (octet_length("ally") <= 65535),
	CONSTRAINT "alliance_diplomacy_enemy_length" CHECK (octet_length("enemy") <= 65535),
	CONSTRAINT "alliance_diplomacy_other_length" CHECK (octet_length("other") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_donate" (
	"uerid" varchar(45) NOT NULL,
	"scienceid" integer NOT NULL,
	"highres" varchar(45),
	"midres" varchar(45),
	"lowres" varchar(45),
	"highnum" integer DEFAULT 0,
	"midnum" integer DEFAULT 0,
	"lownum" integer DEFAULT 0,
	"higprogress" integer DEFAULT 0,
	"midprogress" integer DEFAULT 0,
	"lowprogress" integer DEFAULT 0,
	"highcontribute" integer DEFAULT 0,
	"midcontribute" integer DEFAULT 0,
	"lowcontribute" integer DEFAULT 0,
	"lastrefreshtime" bigint DEFAULT 0,
	"highNotUse" integer DEFAULT 0,
	"midNotUse" integer DEFAULT 0,
	"midAvailable" integer DEFAULT 0,
	"highAvailable" integer DEFAULT 0,
	CONSTRAINT "alliance_donate_PRIMARY" PRIMARY KEY("uerid","scienceid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_dragon_battle" (
	"allianceId" varchar(40) NOT NULL,
	"joinMemberCnt" integer DEFAULT 0,
	"leftTeleportTimes" integer,
	CONSTRAINT "alliance_dragon_battle_PRIMARY" PRIMARY KEY("allianceId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_dragonplayoff_award" (
	"version" integer NOT NULL,
	"allianceId" varchar(50) NOT NULL,
	"uid" varchar(50) NOT NULL,
	"type" integer NOT NULL,
	"state" integer NOT NULL,
	"addr" varchar(2000),
	CONSTRAINT "alliance_dragonplayoff_award_PRIMARY" PRIMARY KEY("version","allianceId","uid","type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_fight_of_king" (
	"type" integer NOT NULL,
	"id" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"serverId" integer NOT NULL,
	"occupyTime" bigint NOT NULL,
	CONSTRAINT "alliance_fight_of_king_PRIMARY" PRIMARY KEY("type","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_gift" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"allianceid" varchar(40) NOT NULL,
	"level" integer,
	"typeId" integer NOT NULL,
	"time" bigint,
	"expiretime" integer,
	CONSTRAINT "alliance_gift_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_group_buys" (
	"id" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"round" integer NOT NULL,
	"name" varchar(40),
	"allianceId" varchar(40),
	"point" integer,
	"buyTime" bigint,
	"info" varchar(1000),
	"reward" integer,
	CONSTRAINT "alliance_group_buys_PRIMARY" PRIMARY KEY("id","uid","round")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_help" (
	"helpId" varchar(255) DEFAULT '' NOT NULL,
	"allianceId" varchar(255) NOT NULL,
	"senderId" varchar(255) NOT NULL,
	"content" varchar(255),
	"isvalid" integer DEFAULT 1,
	"maxcount" integer DEFAULT 0,
	"nowcount" integer DEFAULT 0,
	"startTime" bigint,
	"reduceSec" integer,
	"itemId" varchar(255),
	"level" integer,
	"type" integer,
	"helpers" "bytea",
	"star" integer DEFAULT 0,
	"progress" integer DEFAULT 0,
	CONSTRAINT "alliance_help_PRIMARY" PRIMARY KEY("helpId"),
	CONSTRAINT "alliance_help_helpers_length" CHECK (octet_length("helpers") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_helper" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"helpId" varchar(255),
	"senderId" varchar(255),
	"recvId" varchar(255),
	"stats" integer DEFAULT 0,
	CONSTRAINT "alliance_helper_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_invite_move" (
	"inviter" varchar(255) NOT NULL,
	"invitee" varchar(255) NOT NULL,
	"createTime" bigint,
	CONSTRAINT "alliance_invite_move_PRIMARY" PRIMARY KEY("inviter","invitee")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_member" (
	"uid" varchar(40) NOT NULL,
	"allianceId" varchar(40) NOT NULL,
	"rank" integer,
	"point" integer DEFAULT 0,
	"accPoint" integer DEFAULT 0,
	"progress" integer DEFAULT 0,
	"donateTime" bigint,
	"todaydonate" integer DEFAULT 0,
	"todayprogress" integer DEFAULT 0,
	"jointime" bigint DEFAULT 0,
	"wood" integer DEFAULT 0,
	"stone" integer DEFAULT 0,
	"iron" integer DEFAULT 0,
	"food" integer DEFAULT 0,
	"silver" integer DEFAULT 0,
	"gold" integer DEFAULT 0,
	"donateCDTime" bigint DEFAULT 0,
	"donateAvailable" integer DEFAULT 1,
	"yesterdayLogin" integer DEFAULT 0,
	"fight" integer DEFAULT 0,
	"playoffFight" integer DEFAULT 0,
	CONSTRAINT "alliance_member_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_member_bak" (
	"uid" varchar(40) NOT NULL,
	"allianceId" varchar(40) NOT NULL,
	"rank" integer,
	"point" integer DEFAULT 0,
	"accPoint" integer DEFAULT 0,
	"progress" integer DEFAULT 0,
	"donateTime" bigint,
	"todaydonate" integer DEFAULT 0,
	"todayprogress" integer DEFAULT 0,
	"jointime" bigint DEFAULT 0,
	"wood" integer DEFAULT 0,
	"stone" integer DEFAULT 0,
	"iron" integer DEFAULT 0,
	"food" integer DEFAULT 0,
	"silver" integer DEFAULT 0,
	"gold" integer DEFAULT 0,
	"donateCDTime" bigint DEFAULT 0,
	"donateAvailable" integer DEFAULT 1,
	"yesterdayLogin" integer DEFAULT 0,
	"fight" integer DEFAULT 0,
	CONSTRAINT "alliance_member_bak_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_member_dragon_right" (
	"uid" varchar(50) NOT NULL,
	"allianceId" varchar(50) NOT NULL,
	"canFight" smallint,
	"leaveTime" bigint,
	CONSTRAINT "alliance_member_dragon_right_PRIMARY" PRIMARY KEY("uid","allianceId"),
	CONSTRAINT "alliance_member_dragon_right_canFight_range" CHECK ("canFight" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_mission" (
	"uuid" varchar(255) NOT NULL,
	"missionId" varchar(50) NOT NULL,
	"mType" integer,
	"triggerType" integer,
	"allianceId" varchar(255),
	"conditionValue" varchar(100),
	"para" varchar(100),
	"rewardFlag" varchar(100),
	"rewardId" varchar(100),
	"currentValue" bigint,
	"refreshTime" bigint,
	CONSTRAINT "alliance_mission_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_mission_record" (
	"uid" varchar(255) NOT NULL,
	"missionUUID" varchar(255) NOT NULL,
	"allianceId" varchar(255),
	"mType" integer,
	"rewardFlag" varchar(100),
	CONSTRAINT "alliance_mission_record_PRIMARY" PRIMARY KEY("uid","missionUUID")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_new_resource_log" (
	"uuid" bigint GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."alliance_new_resource_log_uuid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1887 CACHE 1),
	"uid" varchar(40) NOT NULL,
	"sandstone" bigint DEFAULT 0,
	"diamondstone" bigint DEFAULT 0,
	"marble" bigint DEFAULT 0,
	"granite" bigint DEFAULT 0,
	"limestone" bigint DEFAULT 0,
	"updateTime" bigint,
	CONSTRAINT "alliance_new_resource_log_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_offical" (
	"allianceId" varchar(40) NOT NULL,
	"officalOneUid" varchar(40) DEFAULT '' NOT NULL,
	"officalTwoUid" varchar(40) DEFAULT '' NOT NULL,
	"officalThreeUid" varchar(40) DEFAULT '' NOT NULL,
	"officalFourUid" varchar(40) DEFAULT '' NOT NULL,
	CONSTRAINT "alliance_offical_PRIMARY" PRIMARY KEY("allianceId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_offical_apply" (
	"uuid" varchar(40) NOT NULL,
	"userId" varchar(40) DEFAULT '' NOT NULL,
	"allianceId" varchar(40) DEFAULT '' NOT NULL,
	"applyType" integer DEFAULT 0 NOT NULL,
	"applyTime" bigint DEFAULT 0 NOT NULL,
	"operateType" integer DEFAULT 0 NOT NULL,
	"operateTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "alliance_offical_apply_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_science" (
	"allianceId" varchar(40) NOT NULL,
	"scienceId" integer NOT NULL,
	"level" integer,
	"wood" integer,
	"stone" integer,
	"iron" integer,
	"food" integer,
	"silver" integer,
	"gold" integer,
	"donateprogress" integer DEFAULT 0,
	"donatefinish" integer DEFAULT 0,
	"researchstarttime" bigint DEFAULT 0,
	"effectflag" integer DEFAULT 0,
	"power" integer DEFAULT 0,
	CONSTRAINT "alliance_science_PRIMARY" PRIMARY KEY("allianceId","scienceId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_science_upgrade" (
	"allianceId" varchar(40) NOT NULL,
	"scienceId" integer,
	"startTime" bigint,
	"needTime" bigint,
	"accelerate" "bytea",
	CONSTRAINT "alliance_science_upgrade_PRIMARY" PRIMARY KEY("allianceId"),
	CONSTRAINT "alliance_science_upgrade_accelerate_length" CHECK (octet_length("accelerate") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_shop" (
	"allianceId" varchar(40) NOT NULL,
	"goodsId" varchar(40) NOT NULL,
	"count" integer,
	CONSTRAINT "alliance_shop_PRIMARY" PRIMARY KEY("allianceId","goodsId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_shop_buyrecord" (
	"allianceId" varchar(40) NOT NULL,
	"goodsId" varchar(40) NOT NULL,
	"uid" varchar(255) NOT NULL,
	"count" integer NOT NULL,
	"buytime" bigint NOT NULL,
	CONSTRAINT "alliance_shop_buyrecord_PRIMARY" PRIMARY KEY("allianceId","buytime")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_shop_buytoallianceshoprecord" (
	"allianceId" varchar(40) NOT NULL,
	"goodsId" varchar(40) NOT NULL,
	"uid" varchar(255) NOT NULL,
	"count" integer NOT NULL,
	"buytime" bigint NOT NULL,
	CONSTRAINT "alliance_shop_buytoallianceshoprecord_PRIMARY" PRIMARY KEY("allianceId","buytime")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_shop_make" (
	"uid" varchar(40) NOT NULL,
	"allianceId" varchar(40) NOT NULL,
	"goodsId" varchar(40),
	"count" integer,
	"endTime" bigint,
	"needTime" bigint,
	CONSTRAINT "alliance_shop_make_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_shophis" (
	"uid" varchar(40) NOT NULL,
	"allianceId" varchar(40),
	"userId" varchar(40),
	"goodsId" varchar(40),
	"time" bigint,
	CONSTRAINT "alliance_shophis_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_skill" (
	"uuid" varchar(128) NOT NULL,
	"skillId" varchar(128),
	"curEnergy" integer,
	"costEnergy" integer,
	"buildingUid" varchar(256),
	"effect" integer DEFAULT 0,
	"effectValue" integer DEFAULT 0,
	"statusId" varchar(11) DEFAULT '0',
	"startTime" bigint,
	"endTime" bigint,
	CONSTRAINT "alliance_skill_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_stats" (
	"uid" varchar(255) NOT NULL,
	"event_type" integer,
	"fromUser" varchar(255),
	"toUser" varchar(255),
	"createTime" bigint,
	"extraParam" "bytea",
	CONSTRAINT "alliance_stats_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "alliance_stats_extraParam_length" CHECK (octet_length("extraParam") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_task" (
	"uid" varchar(255) NOT NULL,
	"taskId" varchar(255) NOT NULL,
	"allianceId" varchar(255) NOT NULL,
	"publishUid" varchar(255) NOT NULL,
	"acceptUid" varchar(255),
	"vanishTime" bigint,
	"finishTime" bigint,
	"publishStat" integer DEFAULT 0,
	"acceptStat" integer,
	"acceptReward" varchar(255),
	"baseReward" varchar(255),
	"extraReward" varchar(255),
	"startTime" bigint DEFAULT 0,
	"publishTime" bigint DEFAULT 0,
	"freequeue" integer DEFAULT 0,
	CONSTRAINT "alliance_task_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_task_log" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(255),
	"castleLevel" integer,
	"level" integer,
	"taskId" integer,
	"color" integer,
	"createTime" bigint,
	"behavior" integer DEFAULT 0,
	CONSTRAINT "alliance_task_log_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_task_record" (
	"uid" varchar(255) NOT NULL,
	"publishCount" integer DEFAULT 0,
	"refreshCount" integer DEFAULT 0,
	"clearCount" integer DEFAULT 0,
	"itemRefreshCount" integer DEFAULT 0,
	"itemPublishCount" integer DEFAULT 0,
	"itemPublishUseCount" integer DEFAULT 0,
	"refreshTime" bigint DEFAULT 0,
	"colorRate2" integer DEFAULT 0,
	"colorRate3" integer DEFAULT 0,
	"colorRate4" integer DEFAULT 0,
	"colorRate5" integer DEFAULT 0,
	"colorSysRate2" integer DEFAULT 0,
	"colorSysRate3" integer DEFAULT 0,
	"colorSysRate4" integer DEFAULT 0,
	"colorSysRate5" integer DEFAULT 0,
	CONSTRAINT "alliance_task_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_task_unpublish" (
	"uid" varchar(255) NOT NULL,
	"taskId" varchar(255) NOT NULL,
	"publishUid" varchar(255) NOT NULL,
	"stat" integer DEFAULT 0,
	"vanishTime" bigint,
	"finishTime" bigint,
	"acceptReward" varchar(255),
	"baseReward" varchar(255),
	"extraReward" varchar(255),
	CONSTRAINT "alliance_task_unpublish_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_territory" (
	"uid" varchar(255) NOT NULL,
	"pointId" integer,
	"atWorldId" integer DEFAULT 0 NOT NULL,
	"towerPoint" integer,
	"type" integer,
	"resType" integer,
	"num" integer DEFAULT 1,
	"allianceId" varchar(255) NOT NULL,
	"allianceName" varchar(255) NOT NULL,
	"allianceAbbr" varchar(255),
	"stat" integer DEFAULT 0,
	"active" integer DEFAULT 0,
	"level" integer DEFAULT 0,
	"maxDef" integer,
	"curDef" integer,
	"createId" varchar(255),
	"ownerId" varchar(255),
	"pic" varchar(255),
	"name" varchar(255),
	"flag" varchar(255),
	"buildingSpd" numeric(20, 10) DEFAULT 0.0000000000,
	"updateTime" bigint,
	"startTime" bigint,
	"lastUpdateTime" bigint,
	"donateItemNum" integer,
	"arrowHarmPower" integer DEFAULT 0,
	"neighbour" varchar(1000),
	"createTime" bigint DEFAULT 0,
	"activateTime" bigint,
	"trapNum" integer DEFAULT 0,
	"reduceTime" bigint DEFAULT 0,
	"skinsStr" varchar(50) DEFAULT '',
	"skinExpStr" varchar(255) DEFAULT '',
	"nextChangeSkinTime" bigint DEFAULT 0,
	"activeSkin" varchar(10) DEFAULT '',
	CONSTRAINT "alliance_territory_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_territory_fix_log" (
	"uuid" varchar(255) NOT NULL,
	"pointId" integer NOT NULL,
	"territoryId" varchar(255) NOT NULL,
	"territoryType" integer NOT NULL,
	"playerId" varchar(255),
	"runTime" bigint NOT NULL,
	CONSTRAINT "alliance_territory_fix_log_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_title" (
	"allianceId" varchar(40) NOT NULL,
	"title" integer NOT NULL,
	"uid" varchar(255),
	"uName" varchar(255),
	"applicant" varchar(500),
	CONSTRAINT "alliance_title_PRIMARY" PRIMARY KEY("allianceId","title")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_vedio" (
	"allianceId" varchar(40) NOT NULL,
	"vedioURL" varchar(200),
	"thumbnailURL" varchar(200),
	"vedioW" integer DEFAULT 0 NOT NULL,
	"vedioH" integer DEFAULT 0 NOT NULL,
	"vedioSize" integer DEFAULT 0 NOT NULL,
	"vedioLength" integer DEFAULT 0 NOT NULL,
	"checkSign" smallint DEFAULT 0 NOT NULL,
	CONSTRAINT "alliance_vedio_PRIMARY" PRIMARY KEY("allianceId"),
	CONSTRAINT "alliance_vedio_checkSign_range" CHECK ("checkSign" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."anniversary_allianceinfo" (
	"num" integer NOT NULL,
	"allnum" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."anniversary_userinfo" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"regtop" bigint DEFAULT 0,
	"power" bigint DEFAULT 0,
	"powerpercent" numeric(10, 2),
	"food" bigint DEFAULT 0 NOT NULL,
	"wood" bigint DEFAULT 0 NOT NULL,
	"train" bigint DEFAULT 0 NOT NULL,
	"armytype" integer NOT NULL,
	"maxtrain" bigint DEFAULT 0 NOT NULL,
	"maxtrainpercent" numeric(10, 2),
	"dead" integer NOT NULL,
	"deadpercent" numeric(10, 2),
	"kill" integer NOT NULL,
	"killpercent" numeric(10, 2),
	CONSTRAINT "anniversary_userinfo_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."arena_battle_team" (
	"id" varchar(255) NOT NULL,
	"type" integer,
	"targetId" integer,
	"targetUid" varchar(200),
	"targetName" varchar(200),
	"targetPic" varchar(200),
	"targetAName" varchar(200),
	"targetAAbbr" varchar(200),
	"targetAIcon" varchar(200),
	"targetType" integer,
	"leaderUid" varchar(200),
	"leaderName" varchar(200),
	"leaderId" integer,
	"allianceId" varchar(200),
	"allianceName" varchar(200),
	"allianceAbbr" varchar(200),
	"allianceIcon" varchar(200),
	"maxSoldiers" integer,
	"waitTime" bigint,
	"createTime" bigint,
	"worldId" integer,
	"superTeam" integer,
	"failBackItem" integer
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."army_skill_info" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"armyId" varchar(20) NOT NULL,
	"skillId" varchar(20) NOT NULL,
	"level" integer NOT NULL,
	"exp" integer NOT NULL,
	CONSTRAINT "army_skill_info_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."army_strengthen" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"skillbase_id" integer DEFAULT 0,
	"level" integer,
	"exp" integer,
	"skills" varchar(255),
	"times" integer,
	"crit" integer,
	"updateTime" bigint
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."army_total" (
	"uid" varchar(255) NOT NULL,
	"total" integer DEFAULT 0,
	CONSTRAINT "army_total_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."atk_name" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"name" varchar(255),
	CONSTRAINT "atk_name_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."atk_time" (
	"uid" varchar(255) NOT NULL,
	"time" bigint DEFAULT 0,
	CONSTRAINT "atk_time_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."avatar_storage" (
	"uid" varchar(255) NOT NULL,
	"avatarId" varchar(255) NOT NULL,
	"expirationTime" bigint NOT NULL,
	"effectiveSign" integer DEFAULT 0 NOT NULL,
	"username" varchar(255),
	"usetime" bigint,
	"type" integer DEFAULT 0,
	CONSTRAINT "avatar_storage_PRIMARY" PRIMARY KEY("uid","avatarId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."badwords" (
	"id" bigint GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."badwords_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"words" varchar(255),
	CONSTRAINT "badwords_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."barbarion_statistics" (
	"playerUid" varchar(255) NOT NULL,
	"playerName" varchar(255) NOT NULL,
	"time" bigint DEFAULT 0,
	"isSuccess" integer DEFAULT 0,
	"strongHoldLevel" integer DEFAULT 0,
	"actType" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."black_land_barbarion_dead" (
	"id" varchar(40) NOT NULL,
	"areaId" integer NOT NULL,
	"level" integer NOT NULL,
	"deadFinishTime" bigint NOT NULL,
	CONSTRAINT "black_land_barbarion_dead_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."black_land_basttile_dead" (
	"id" varchar(40) NOT NULL,
	"areaId" integer NOT NULL,
	"level" integer NOT NULL,
	"deadFinishTime" bigint NOT NULL,
	CONSTRAINT "black_land_basttile_dead_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."black_land_res_dead" (
	"id" varchar(40) NOT NULL,
	"areaId" integer NOT NULL,
	"level" integer NOT NULL,
	"deadFinishTime" bigint NOT NULL,
	CONSTRAINT "black_land_res_dead_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."bottles" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"name" varchar(255) NOT NULL,
	"serverId" integer NOT NULL,
	"pic" varchar(40),
	"content" "bytea" NOT NULL,
	"locked" smallint NOT NULL,
	"createTime" bigint NOT NULL,
	"replyCount" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "bottles_PRIMARY" PRIMARY KEY("uuid"),
	CONSTRAINT "bottles_content_length" CHECK (octet_length("content") <= 65535),
	CONSTRAINT "bottles_locked_range" CHECK ("locked" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."branch_link" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"serverId" integer DEFAULT 0 NOT NULL,
	"fromUid" varchar(255) DEFAULT '' NOT NULL,
	"fromServerId" integer,
	"type" varchar(128),
	"data" varchar(255) DEFAULT '' NOT NULL,
	"startTime" bigint DEFAULT 0 NOT NULL,
	"modifyTime" bigint DEFAULT 0,
	CONSTRAINT "branch_link_PRIMARY" PRIMARY KEY("uid","serverId","data")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."branch_url" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"serverId" integer DEFAULT 0 NOT NULL,
	"type" varchar(128),
	"data" varchar(255),
	"url" varchar(255) DEFAULT '' NOT NULL,
	"startTime" bigint DEFAULT 0 NOT NULL,
	"modifyTime" bigint DEFAULT 0,
	CONSTRAINT "branch_url_PRIMARY" PRIMARY KEY("uid","serverId","url")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."c3p0testtable" (
	"a" varchar(1)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."castle_exchange" (
	"uid" varchar(40) NOT NULL,
	"id" varchar(40) NOT NULL,
	"buy" integer DEFAULT 0,
	"time" bigint DEFAULT 0,
	CONSTRAINT "castle_exchange_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."castle_leveling_0" (
	"uid" varchar(50) NOT NULL,
	"level" integer NOT NULL,
	"lv_reward" integer DEFAULT 0 NOT NULL,
	"share_reward_0" integer DEFAULT 0 NOT NULL,
	"share_reward_1" integer DEFAULT 0 NOT NULL,
	"share_reward_2" integer DEFAULT 0 NOT NULL,
	"share_reward_3" integer DEFAULT 0 NOT NULL,
	"share_reward_4" integer DEFAULT 0 NOT NULL,
	"share_reward_5" integer DEFAULT 0 NOT NULL,
	"share_reward_6" integer DEFAULT 0 NOT NULL,
	"pay_times_0" integer DEFAULT 0 NOT NULL,
	"pay_times_1" integer DEFAULT 0 NOT NULL,
	"pay_times_2" integer DEFAULT 0 NOT NULL,
	"pay_times_3" integer DEFAULT 0 NOT NULL,
	"pay_times_4" integer DEFAULT 0 NOT NULL,
	"pay_times_5" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "castle_leveling_0_PRIMARY" PRIMARY KEY("uid","level")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."castle_leveling_1" (
	"uid" varchar(50) NOT NULL,
	"level" integer NOT NULL,
	"lv_reward" integer DEFAULT 0 NOT NULL,
	"share_reward_0" integer DEFAULT 0 NOT NULL,
	"share_reward_1" integer DEFAULT 0 NOT NULL,
	"share_reward_2" integer DEFAULT 0 NOT NULL,
	"share_reward_3" integer DEFAULT 0 NOT NULL,
	"share_reward_4" integer DEFAULT 0 NOT NULL,
	"share_reward_5" integer DEFAULT 0 NOT NULL,
	"share_reward_6" integer DEFAULT 0 NOT NULL,
	"pay_times_0" integer DEFAULT 0 NOT NULL,
	"pay_times_1" integer DEFAULT 0 NOT NULL,
	"pay_times_2" integer DEFAULT 0 NOT NULL,
	"pay_times_3" integer DEFAULT 0 NOT NULL,
	"pay_times_4" integer DEFAULT 0 NOT NULL,
	"pay_times_5" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "castle_leveling_1_PRIMARY" PRIMARY KEY("uid","level")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."celebrity" (
	"uid" varchar(255) NOT NULL,
	"description" "bytea",
	CONSTRAINT "celebrity_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "celebrity_description_length" CHECK (octet_length("description") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."chat_report_record" (
	"uid" varchar(255) NOT NULL,
	"lastUpdateTime" bigint DEFAULT 0,
	CONSTRAINT "chat_report_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."chat_shield" (
	"uuid" varchar(40) NOT NULL,
	"owner" varchar(40) NOT NULL,
	"other" varchar(40) NOT NULL,
	"time" bigint,
	CONSTRAINT "chat_shield_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."city_monster" (
	"uid" varchar(255) NOT NULL,
	"nextUpdateTime" bigint,
	"bigMonster" integer,
	"smallMonster" integer,
	"lastUpdateTime" bigint,
	"bigMonsterInOneDay" integer,
	CONSTRAINT "city_monster_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."civilization_castle" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"level" integer DEFAULT 0,
	"pointId" integer DEFAULT 0,
	"def" integer DEFAULT 0,
	"resourceNum" double precision,
	"lastOutputTime" bigint,
	"robCount" integer DEFAULT 0,
	"beRobNum" integer DEFAULT 0,
	"lastRefreshDataTime" bigint,
	"status" integer DEFAULT 0,
	"buildTime" bigint,
	"lastSettleTime" bigint DEFAULT 0,
	CONSTRAINT "civilization_castle_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."civilization_castle_record" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"level" integer DEFAULT 0,
	"pointId" integer DEFAULT 0,
	"def" integer DEFAULT 0,
	"resourceNum" integer DEFAULT 0,
	"lastOutputTime" bigint,
	"robCount" integer DEFAULT 0,
	"beRobNum" integer DEFAULT 0,
	"lastRefreshDataTime" bigint,
	"status" integer DEFAULT 0,
	"buildTime" bigint,
	"lastSettleTime" bigint DEFAULT 0,
	CONSTRAINT "civilization_castle_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."client_log" (
	"uid" varchar(40) NOT NULL,
	"type" integer NOT NULL,
	"keyword" varchar(200) NOT NULL,
	"time" bigint NOT NULL,
	CONSTRAINT "client_log_PRIMARY" PRIMARY KEY("uid","type","keyword","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."cok_monitor_log" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."cok_monitor_log_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"url" varchar(500),
	"action" varchar(50),
	"parameter" text,
	"user_name" varchar(50),
	"access_time" text,
	"module_id" integer,
	CONSTRAINT "cok_monitor_log_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "cok_monitor_log_access_time_temporal" CHECK (("access_time" IS NULL OR (CASE WHEN "access_time" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("access_time",4) <> '0000' AND substring("access_time",6,2) <> '00' AND substring("access_time",9,2) <> '00' THEN to_char(to_date(left("access_time",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("access_time",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."compensate_record" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(255),
	"lostPower" bigint,
	"time" bigint,
	"rewardTime" bigint,
	"rewardStatus" integer,
	"reward" varchar(255),
	"num" integer,
	CONSTRAINT "compensate_record_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."compensate_shield_record" (
	"uid" varchar(255) NOT NULL,
	"createTime" bigint DEFAULT 0,
	CONSTRAINT "compensate_shield_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."compensation_record" (
	"uid" varchar(255) NOT NULL,
	"count" integer DEFAULT 0,
	"lastCompensateTime" bigint,
	"isFirstOnFire" integer DEFAULT 1,
	CONSTRAINT "compensation_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."compensation_record_shield" (
	"uid" varchar(255) NOT NULL,
	"createTime" bigint DEFAULT 0,
	CONSTRAINT "compensation_record_shield_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_0" (
	"uid" varchar(255) NOT NULL,
	"friendUid" varchar(255) NOT NULL,
	"stat" integer DEFAULT 0,
	"description" "bytea",
	CONSTRAINT "contact_0_PRIMARY" PRIMARY KEY("uid","friendUid"),
	CONSTRAINT "contact_0_description_length" CHECK (octet_length("description") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_1" (
	"uid" varchar(255) NOT NULL,
	"friendUid" varchar(255) NOT NULL,
	"stat" integer DEFAULT 0,
	"description" "bytea",
	CONSTRAINT "contact_1_PRIMARY" PRIMARY KEY("uid","friendUid"),
	CONSTRAINT "contact_1_description_length" CHECK (octet_length("description") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_2" (
	"uid" varchar(255) NOT NULL,
	"friendUid" varchar(255) NOT NULL,
	"stat" integer DEFAULT 0,
	"description" "bytea",
	CONSTRAINT "contact_2_PRIMARY" PRIMARY KEY("uid","friendUid"),
	CONSTRAINT "contact_2_description_length" CHECK (octet_length("description") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_3" (
	"uid" varchar(255) NOT NULL,
	"friendUid" varchar(255) NOT NULL,
	"stat" integer DEFAULT 0,
	"description" "bytea",
	CONSTRAINT "contact_3_PRIMARY" PRIMARY KEY("uid","friendUid"),
	CONSTRAINT "contact_3_description_length" CHECK (octet_length("description") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_4" (
	"uid" varchar(255) NOT NULL,
	"friendUid" varchar(255) NOT NULL,
	"stat" integer DEFAULT 0,
	"description" "bytea",
	CONSTRAINT "contact_4_PRIMARY" PRIMARY KEY("uid","friendUid"),
	CONSTRAINT "contact_4_description_length" CHECK (octet_length("description") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_5" (
	"uid" varchar(255) NOT NULL,
	"friendUid" varchar(255) NOT NULL,
	"stat" integer DEFAULT 0,
	"description" "bytea",
	CONSTRAINT "contact_5_PRIMARY" PRIMARY KEY("uid","friendUid"),
	CONSTRAINT "contact_5_description_length" CHECK (octet_length("description") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_6" (
	"uid" varchar(255) NOT NULL,
	"friendUid" varchar(255) NOT NULL,
	"stat" integer DEFAULT 0,
	"description" "bytea",
	CONSTRAINT "contact_6_PRIMARY" PRIMARY KEY("uid","friendUid"),
	CONSTRAINT "contact_6_description_length" CHECK (octet_length("description") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_7" (
	"uid" varchar(255) NOT NULL,
	"friendUid" varchar(255) NOT NULL,
	"stat" integer DEFAULT 0,
	"description" "bytea",
	CONSTRAINT "contact_7_PRIMARY" PRIMARY KEY("uid","friendUid"),
	CONSTRAINT "contact_7_description_length" CHECK (octet_length("description") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_8" (
	"uid" varchar(255) NOT NULL,
	"friendUid" varchar(255) NOT NULL,
	"stat" integer DEFAULT 0,
	"description" "bytea",
	CONSTRAINT "contact_8_PRIMARY" PRIMARY KEY("uid","friendUid"),
	CONSTRAINT "contact_8_description_length" CHECK (octet_length("description") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_9" (
	"uid" varchar(255) NOT NULL,
	"friendUid" varchar(255) NOT NULL,
	"stat" integer DEFAULT 0,
	"description" "bytea",
	CONSTRAINT "contact_9_PRIMARY" PRIMARY KEY("uid","friendUid"),
	CONSTRAINT "contact_9_description_length" CHECK (octet_length("description") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_fb" (
	"uid" varchar(255) NOT NULL,
	"friendUid" varchar(255) NOT NULL,
	"fbUid" varchar(255) NOT NULL,
	"stat" integer DEFAULT 0,
	"description" "bytea",
	"fbName" "bytea",
	CONSTRAINT "contact_fb_PRIMARY" PRIMARY KEY("uid","friendUid"),
	CONSTRAINT "contact_fb_description_length" CHECK (octet_length("description") <= 65535),
	CONSTRAINT "contact_fb_fbName_length" CHECK (octet_length("fbName") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."cross_info" (
	"uid" varchar(128) DEFAULT '' NOT NULL,
	"changeServerType" varchar(128),
	"crossTime" bigint DEFAULT 0,
	"targetServerId" integer DEFAULT 0,
	CONSTRAINT "cross_info_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."cross_promotion_status" (
	"srcGameId" varchar(255) NOT NULL,
	"targetGameId" varchar(255) NOT NULL,
	"srcUid" varchar(255) NOT NULL,
	"targetUid" varchar(255) NOT NULL,
	"taskid" varchar(255) NOT NULL,
	"taskType" integer NOT NULL,
	"startTime" bigint,
	"endTime" bigint,
	"curValue" integer DEFAULT 0 NOT NULL,
	"maxValue" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "cross_promotion_status_PRIMARY" PRIMARY KEY("srcGameId","targetUid","taskid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."cross_promotion_update_task" (
	"uid" varchar(255) NOT NULL,
	"taskid" varchar(255) NOT NULL,
	"taskType" integer NOT NULL,
	"curValue" integer DEFAULT 0 NOT NULL,
	"getRewardSign" integer DEFAULT 0 NOT NULL,
	"acceptTime" bigint,
	"finishTime" bigint,
	CONSTRAINT "cross_promotion_update_task_PRIMARY" PRIMARY KEY("uid","taskid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."cross_throne_king_info" (
	"uuid" varchar(50) NOT NULL,
	"version" integer NOT NULL,
	"king_type" integer NOT NULL,
	"config_type" integer NOT NULL,
	"name" varchar(50),
	"uid" varchar(50),
	"pic" varchar(50),
	"pic_ver" integer DEFAULT 0 NOT NULL,
	"king_server_id" integer DEFAULT 0 NOT NULL,
	"alliance_abbr" varchar(50),
	"occupy_seconds" integer DEFAULT 0 NOT NULL,
	"induction_time" bigint DEFAULT 0 NOT NULL,
	"throne_dead_count" integer DEFAULT 0 NOT NULL,
	"trebuchet_dead_count" integer DEFAULT 0 NOT NULL,
	"battle_user_count" integer DEFAULT 0 NOT NULL,
	"battle_alliance_count" integer DEFAULT 0 NOT NULL,
	"scout_count" integer DEFAULT 0 NOT NULL,
	"create_time" bigint,
	"last_update_time" bigint,
	CONSTRAINT "cross_throne_king_info_PRIMARY" PRIMARY KEY("version","king_type","config_type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."cross_throne_occupy_record" (
	"uuid" varchar(50) NOT NULL,
	"king_info_id" varchar(50) NOT NULL,
	"uid" varchar(50),
	"name" varchar(50),
	"alliance_abbr" varchar(50),
	"server_id" integer,
	"kingdom_name" varchar(50),
	"start_millis" bigint,
	CONSTRAINT "cross_throne_occupy_record_PRIMARY" PRIMARY KEY("uuid","king_info_id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."cross_throne_reward_record" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."cross_throne_reward_record_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 10 CACHE 1),
	"version" integer NOT NULL,
	"from_uid" varchar(40) NOT NULL,
	"target_uid" varchar(40) DEFAULT '-1' NOT NULL,
	"from_server_id" integer NOT NULL,
	"target_server_id" integer NOT NULL,
	"reward_type" smallint NOT NULL,
	"reward_id" integer NOT NULL,
	"record_time" bigint,
	"pic" varchar(50),
	"pic_ver" integer DEFAULT 0 NOT NULL,
	"name" varchar(50),
	"alliance_abbr" varchar(50),
	"throne_type" integer DEFAULT 0 NOT NULL,
	"overlord_type" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "cross_throne_reward_record_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "cross_throne_reward_record_reward_type_range" CHECK ("reward_type" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."crystal_cost_record" (
	"uid" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"goldType" integer,
	"type" integer NOT NULL,
	"param1" integer,
	"param2" integer,
	"originalGold" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remainGold" bigint NOT NULL,
	"time" bigint NOT NULL,
	CONSTRAINT "crystal_cost_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."def_time" (
	"uid" varchar(255) NOT NULL,
	"time" bigint DEFAULT 0,
	CONSTRAINT "def_time_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_0" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"operate" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"startTime" bigint DEFAULT 0 NOT NULL,
	"withDrawTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "deposit_record_0_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_1" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"operate" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"startTime" bigint DEFAULT 0 NOT NULL,
	"withDrawTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "deposit_record_1_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_2" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"operate" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"startTime" bigint DEFAULT 0 NOT NULL,
	"withDrawTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "deposit_record_2_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_3" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"operate" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"startTime" bigint DEFAULT 0 NOT NULL,
	"withDrawTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "deposit_record_3_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_4" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"operate" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"startTime" bigint DEFAULT 0 NOT NULL,
	"withDrawTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "deposit_record_4_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_5" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"operate" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"startTime" bigint DEFAULT 0 NOT NULL,
	"withDrawTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "deposit_record_5_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_6" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"operate" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"startTime" bigint DEFAULT 0 NOT NULL,
	"withDrawTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "deposit_record_6_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_7" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"operate" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"startTime" bigint DEFAULT 0 NOT NULL,
	"withDrawTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "deposit_record_7_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_8" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"operate" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"startTime" bigint DEFAULT 0 NOT NULL,
	"withDrawTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "deposit_record_8_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_9" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"operate" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"startTime" bigint DEFAULT 0 NOT NULL,
	"withDrawTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "deposit_record_9_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."device_info" (
	"uid" varchar(40) NOT NULL,
	"signCode" varchar(100),
	"subscriberId" varchar(100),
	"operator_name" varchar(100),
	"model" varchar(100),
	"network_type" varchar(100),
	"os_build" varchar(200),
	"os_fgpt" varchar(200),
	"reserve1" varchar(100),
	"reserve2" varchar(100),
	"reserve3" varchar(200),
	"reserve4" varchar(200),
	"reserve5" varchar(1000),
	CONSTRAINT "device_info_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."device_mail_record" (
	"deviceId" varchar(40) NOT NULL,
	"record" varchar(40) NOT NULL,
	CONSTRAINT "device_mail_record_PRIMARY" PRIMARY KEY("deviceId","record")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."donate_history" (
	"uid" varchar(255) NOT NULL,
	"allianceId" varchar(255),
	"donate" integer DEFAULT 0,
	"progress" integer,
	"donateTime" bigint,
	CONSTRAINT "donate_history_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."donate_history_record" (
	"uid" varchar(255) NOT NULL,
	"allianceId" varchar(255),
	"donate" integer DEFAULT 0,
	"progress" integer,
	"donateTime" bigint,
	CONSTRAINT "donate_history_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_battle_fight_history" (
	"uid" varchar(50) NOT NULL,
	"teamId" varchar(50),
	"type" integer NOT NULL,
	"time" bigint,
	"serverId" integer,
	"VERSION" varchar(50) DEFAULT '',
	"indexId" integer,
	"score" integer,
	"id" varchar(50) NOT NULL,
	"param1" varchar(255) DEFAULT '',
	"seasonVersion" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "dragon_battle_fight_history_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_battle_mail_record" (
	"season_version" integer NOT NULL,
	"version" integer NOT NULL,
	"uid" varchar(50) NOT NULL,
	"teamId" varchar(50) NOT NULL,
	"fightServer" integer DEFAULT 0 NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"mailId" integer DEFAULT 0 NOT NULL,
	"teamScore" integer DEFAULT 0 NOT NULL,
	"rewards" varchar(2000) DEFAULT '''''' NOT NULL,
	"recived" smallint DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	"win" smallint DEFAULT 0 NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "dragon_battle_mail_record_PRIMARY" PRIMARY KEY("uid","season_version","version"),
	CONSTRAINT "dragon_battle_mail_record_recived_range" CHECK ("recived" BETWEEN -128 AND 127),
	CONSTRAINT "dragon_battle_mail_record_win_range" CHECK ("win" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_building_record" (
	"uuid" varchar(255) NOT NULL,
	"worldId" integer NOT NULL,
	"buildId" varchar(255) NOT NULL,
	"ownerUid" varchar(255) NOT NULL,
	"occupyUidsStr" varchar(255) NOT NULL,
	"lastCalcScoreTime" bigint NOT NULL,
	"lastHandKnightTime" integer DEFAULT 0,
	CONSTRAINT "dragon_building_record_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_playoff_properties" (
	"key" varchar(100) NOT NULL,
	"value" varchar(1000),
	"updateTime" text DEFAULT to_char(statement_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') NOT NULL,
	CONSTRAINT "dragon_playoff_properties_PRIMARY" PRIMARY KEY("key"),
	CONSTRAINT "dragon_playoff_properties_updateTime_temporal" CHECK (("updateTime" IS NULL OR (CASE WHEN "updateTime" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("updateTime",4) <> '0000' AND substring("updateTime",6,2) <> '00' AND substring("updateTime",9,2) <> '00' THEN to_char(to_date(left("updateTime",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("updateTime",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_playoff_teaminfo" (
	"teamId" varchar(40) NOT NULL,
	"teamName" varchar(255),
	"leaderName" varchar(255),
	"kingId" integer DEFAULT 0 NOT NULL,
	"kingName" varchar(255),
	"state" integer DEFAULT 0 NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"fighting" integer DEFAULT 0 NOT NULL,
	"fightNum" integer DEFAULT 0 NOT NULL,
	"winNum" integer DEFAULT 0 NOT NULL,
	"curmember" integer DEFAULT 0 NOT NULL,
	"maxmember" integer DEFAULT 0 NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"index" integer DEFAULT 0 NOT NULL,
	"fightServerId" varchar(40),
	"rankNum" integer DEFAULT 0 NOT NULL,
	"areaId" integer DEFAULT 0 NOT NULL,
	"abbr" varchar(255),
	"fightState" integer DEFAULT 0 NOT NULL,
	"serverId" integer DEFAULT 0 NOT NULL,
	"icon" varchar(255),
	"groupId" integer DEFAULT 0 NOT NULL,
	"groupIndex" integer DEFAULT 0 NOT NULL,
	"timeIndexes" varchar(20),
	"enemyIds" varchar(255),
	"results" varchar(20),
	"curEnemyId" varchar(40),
	"finalGroupIndex" integer DEFAULT 0 NOT NULL,
	"finalRankNum" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "dragon_playoff_teaminfo_PRIMARY" PRIMARY KEY("teamId","version")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_skill" (
	"uid" varchar(96),
	"dragonId" integer,
	"skillId" varchar(60),
	"startTime" bigint,
	"actTime" bigint,
	"endTime" bigint,
	"stat" integer
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_talent_skill" (
	"uid" varchar(96) DEFAULT '' NOT NULL,
	"dragonId" integer DEFAULT 0 NOT NULL,
	"skillId" varchar(60) DEFAULT '' NOT NULL,
	"startTime" bigint,
	"actTime" bigint,
	"endTime" bigint,
	"stat" integer,
	"level" integer,
	"exp" integer,
	"totalExp" integer,
	CONSTRAINT "dragon_talent_skill_PRIMARY" PRIMARY KEY("uid","dragonId","skillId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_tower_buff" (
	"uid" varchar(32) NOT NULL,
	"buffid" integer NOT NULL,
	"remainlayers" integer,
	"buytime" bigint,
	CONSTRAINT "dragon_tower_buff_PRIMARY" PRIMARY KEY("uid","buffid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_tower_fightreport" (
	"citylevel" smallint NOT NULL,
	"layer" integer NOT NULL,
	"uid" varchar(32),
	"fighttime" bigint,
	"army" text,
	"report" text,
	"citystar" smallint,
	"monsterid" integer,
	"difficulty" smallint,
	"monsterdead" integer,
	"playerdead" integer,
	CONSTRAINT "dragon_tower_fightreport_PRIMARY" PRIMARY KEY("citylevel","layer")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_tower_layer" (
	"uid" varchar(32) NOT NULL,
	"layer" integer NOT NULL,
	"difficulty" smallint,
	"monsters" varchar(36),
	"currentmonster" integer,
	"buff" varchar(36),
	"buybuff" integer,
	"awards" text,
	"awardstate" smallint,
	"layerstate" smallint,
	"fighttime" bigint,
	CONSTRAINT "dragon_tower_layer_PRIMARY" PRIMARY KEY("uid","layer"),
	CONSTRAINT "dragon_tower_layer_difficulty_range" CHECK ("difficulty" BETWEEN -128 AND 127),
	CONSTRAINT "dragon_tower_layer_awardstate_range" CHECK ("awardstate" BETWEEN -128 AND 127),
	CONSTRAINT "dragon_tower_layer_layerstate_range" CHECK ("layerstate" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_tower_user" (
	"uid" varchar(32) NOT NULL,
	"currentlayer" integer,
	"weeklymaxlayer" integer,
	"maxlayer" integer,
	"weeklyrevive" smallint,
	"resettimes" smallint,
	"dailyresettime" bigint,
	"weeklyresettime" bigint,
	"dragon" varchar(36),
	"army" text,
	"deadarmy" text,
	"armyrevivenum" integer,
	"armyrevive" text,
	"armyrevivecd" bigint,
	"score" integer,
	"sharetimes" smallint,
	"generalid" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "dragon_tower_user_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_words_record" (
	"uid" varchar(255) NOT NULL,
	"castleLevel" integer NOT NULL,
	"loadLevel" integer NOT NULL,
	"buildingLevel" integer NOT NULL,
	"activityTitle" integer NOT NULL,
	"talismanDetail" varchar(1024),
	CONSTRAINT "dragon_words_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."egg_activity" (
	"uid" varchar(40) NOT NULL,
	"curEgg" varchar(10) NOT NULL,
	"eggCd" bigint DEFAULT 0,
	"exp" integer DEFAULT 0,
	"curExpStage" integer DEFAULT 0,
	CONSTRAINT "egg_activity_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."exception_user" (
	"uid" varchar(40) NOT NULL,
	"type" integer NOT NULL,
	"day" varchar(10) NOT NULL,
	"count" integer,
	"updateTime" bigint,
	CONSTRAINT "exception_user_PRIMARY" PRIMARY KEY("uid","type","day")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange" (
	"uid" varchar(40) NOT NULL,
	"id" varchar(40) NOT NULL,
	"buy" integer DEFAULT 0,
	"time" bigint DEFAULT 0,
	"flush" bigint DEFAULT 0,
	CONSTRAINT "exchange_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_activity" (
	"uid" varchar(40) NOT NULL,
	"actId" varchar(10) NOT NULL,
	"reward" "bytea",
	"refresh" integer DEFAULT 0,
	"refreshTime" bigint DEFAULT 0,
	CONSTRAINT "exchange_activity_PRIMARY" PRIMARY KEY("uid","actId"),
	CONSTRAINT "exchange_activity_reward_length" CHECK (octet_length("reward") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_alliance_log" (
	"uid" varchar(40) NOT NULL,
	"orderId" varchar(200) NOT NULL,
	"allianceId" varchar(40),
	"createTime" bigint NOT NULL,
	"status" smallint,
	CONSTRAINT "exchange_alliance_log_PRIMARY" PRIMARY KEY("uid","orderId","createTime"),
	CONSTRAINT "exchange_alliance_log_status_range" CHECK ("status" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_condition" (
	"uid" varchar(40) NOT NULL,
	"soldierDead" bigint DEFAULT 0,
	"deadFlushTime" bigint DEFAULT 0,
	"payGold" integer DEFAULT 1,
	"goldFlushTime" bigint DEFAULT 0,
	CONSTRAINT "exchange_condition_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_gift" (
	"uid" varchar(40) NOT NULL,
	"receiverId" varchar(40) NOT NULL,
	"exchangeId" varchar(20) NOT NULL,
	"sendTime" bigint,
	CONSTRAINT "exchange_gift_PRIMARY" PRIMARY KEY("uid","receiverId","exchangeId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_gift_log" (
	"mailId" varchar(40) NOT NULL,
	"senderId" varchar(40),
	"receiverId" varchar(40),
	"exchangeId" varchar(20),
	"sendTime" bigint NOT NULL,
	"status" smallint,
	"updateTime" bigint,
	CONSTRAINT "exchange_gift_log_PRIMARY" PRIMARY KEY("mailId","sendTime"),
	CONSTRAINT "exchange_gift_log_status_range" CHECK ("status" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_group_type" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"group_type" integer DEFAULT 0 NOT NULL,
	"id" integer,
	"refreshtime" bigint,
	CONSTRAINT "exchange_group_type_PRIMARY" PRIMARY KEY("uid","group_type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_order" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"itemId" varchar(40) NOT NULL,
	CONSTRAINT "exchange_order_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_time" (
	"uid" varchar(40) NOT NULL,
	"id" varchar(40) NOT NULL,
	"beginTime" bigint,
	"buyTime" bigint,
	CONSTRAINT "exchange_time_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_visible" (
	"uid" varchar(40) NOT NULL,
	"exchangeId" varchar(20) NOT NULL,
	"createTime" bigint,
	CONSTRAINT "exchange_visible_PRIMARY" PRIMARY KEY("uid","exchangeId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."expedition_fail_award" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"score" double precision DEFAULT 0,
	"rewardId" varchar(20) DEFAULT '' NOT NULL,
	"rank" integer NOT NULL,
	CONSTRAINT "expedition_fail_award_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."expedition_mark" (
	"serverId" integer NOT NULL,
	"isKickFinished" smallint DEFAULT 0 NOT NULL,
	"isSendedAward" smallint DEFAULT 0 NOT NULL,
	"kickFinishTime" bigint NOT NULL,
	"sendAwardTime" bigint NOT NULL,
	CONSTRAINT "expedition_mark_PRIMARY" PRIMARY KEY("serverId"),
	CONSTRAINT "expedition_mark_isKickFinished_range" CHECK ("isKickFinished" BETWEEN -128 AND 127),
	CONSTRAINT "expedition_mark_isSendedAward_range" CHECK ("isSendedAward" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."expedition_record" (
	"uuid" varchar(255) NOT NULL,
	"time" bigint DEFAULT 0,
	"type" integer NOT NULL,
	"targetServerName" varchar(255) NOT NULL,
	"targetServerId" integer NOT NULL,
	"kingUid" varchar(255),
	"kingUserName" varchar(255),
	CONSTRAINT "expedition_record_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."fast_carry_activity" (
	"uid" varchar(40) NOT NULL,
	"type" varchar(40) DEFAULT '17' NOT NULL,
	"totalPoint" integer DEFAULT 0 NOT NULL,
	"lastEndTime" bigint DEFAULT 0 NOT NULL,
	"reward1" varchar(40) DEFAULT '-1' NOT NULL,
	"reward2" varchar(40) DEFAULT '-1' NOT NULL,
	"reward3" varchar(40) DEFAULT '-1' NOT NULL,
	"reward4" varchar(40) DEFAULT '-1' NOT NULL,
	"goalReward1" integer DEFAULT 0 NOT NULL,
	"goalReward2" integer DEFAULT 0 NOT NULL,
	"goalReward3" integer DEFAULT 0 NOT NULL,
	"goalReward4" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "fast_carry_activity_PRIMARY" PRIMARY KEY("uid","lastEndTime")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."fastcarryhelp" (
	"allianceId" varchar(40) NOT NULL,
	"uid" varchar(255) NOT NULL,
	"maxcount" integer DEFAULT 0 NOT NULL,
	"nowcount" integer DEFAULT 0 NOT NULL,
	"helpers" varchar(2048),
	"updatetime" bigint NOT NULL,
	"progress" integer DEFAULT 0,
	CONSTRAINT "fastcarryhelp_PRIMARY" PRIMARY KEY("allianceId","uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."feed_reward" (
	"uid" varchar(255) NOT NULL,
	"feed_count" integer,
	"feed_time" bigint,
	"accept_count" integer,
	"accept_time" bigint,
	"feed_uuid" varchar(255),
	CONSTRAINT "feed_reward_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."fight_arena_info" (
	"worldId" integer NOT NULL,
	"state" integer,
	"endTime" bigint,
	"version" integer,
	CONSTRAINT "fight_arena_info_PRIMARY" PRIMARY KEY("worldId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."fight_arena_player_info" (
	"uid" varchar(255),
	"worldId" integer,
	"version" integer,
	"score" integer,
	"side" integer,
	"rankScore" integer
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."fight_king_status" (
	"index" integer NOT NULL,
	"info" varchar(8192),
	CONSTRAINT "fight_king_status_PRIMARY" PRIMARY KEY("index")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."firstpaylog" (
	"uid" varchar(40) NOT NULL,
	"orderId" varchar(200) NOT NULL,
	"pf" varchar(20) NOT NULL,
	"productId" varchar(10) DEFAULT '0' NOT NULL,
	"orderInfo" varchar(100) DEFAULT '',
	"time" bigint,
	"currency" integer DEFAULT 0,
	"spend" numeric(10, 2) DEFAULT 0.00 NOT NULL,
	"paid" numeric(10, 2) DEFAULT 0.00,
	"status" integer DEFAULT 0,
	"payLevel" integer NOT NULL,
	CONSTRAINT "firstpaylog_PRIMARY" PRIMARY KEY("uid","orderId","pf")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."fiveonlinedata" (
	"timeStamp" integer DEFAULT 0 NOT NULL,
	"count" integer,
	CONSTRAINT "fiveonlinedata_PRIMARY" PRIMARY KEY("timeStamp")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."flower_history" (
	"uid" varchar(255) NOT NULL,
	"sourceID" varchar(255) NOT NULL,
	"targetID" varchar(255) NOT NULL,
	"timeVal" bigint,
	"itemID" integer,
	"count" integer,
	CONSTRAINT "flower_history_PRIMARY" PRIMARY KEY("uid","sourceID","targetID")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."flower_info" (
	"uid" varchar(38) NOT NULL,
	"lastflowerRanking" integer,
	"lastOperatorFlower" bigint,
	"flowerUse" varchar(255),
	"lastCanvassTime" bigint DEFAULT 0,
	"lastBeCanvassTime" bigint DEFAULT 0,
	CONSTRAINT "flower_info_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."flower_notice" (
	"uid" varchar(255) NOT NULL,
	"addTime" bigint,
	"targetID" varchar(255),
	"sourceName" varchar(255),
	"sourceID" varchar(255),
	"itemID" varchar(255),
	"itemCount" integer,
	CONSTRAINT "flower_notice_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."flower_ranking" (
	"uid" varchar(255) NOT NULL,
	"scoreVal" integer,
	"flowerVal" integer,
	"eggVal" integer,
	"hideKing" integer DEFAULT 0,
	CONSTRAINT "flower_ranking_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."foreigen_sciences" (
	"uid" varchar(32) NOT NULL,
	"itemid" integer NOT NULL,
	"level" integer,
	"cdtime" bigint,
	"reserve" integer,
	CONSTRAINT "foreigen_sciences_PRIMARY" PRIMARY KEY("uid","itemid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."formation_info" (
	"uid" varchar(255) NOT NULL,
	"formation" varchar(1024),
	"index1" integer NOT NULL,
	"customName" varchar(21),
	"dragonFormation" varchar(300),
	"heroFormation" varchar(300),
	"angelArmy" varchar(50),
	CONSTRAINT "formation_info_PRIMARY" PRIMARY KEY("uid","index1")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."fresh_recharge_reward" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"id" varchar(255) NOT NULL,
	CONSTRAINT "fresh_recharge_reward_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."friend_help" (
	"fromId" varchar(40) NOT NULL,
	"toId" varchar(20) NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "friend_help_PRIMARY" PRIMARY KEY("fromId","toId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."friend_mine" (
	"uid" varchar(40) NOT NULL,
	"itemId" integer,
	"helpCount" integer,
	"time" bigint DEFAULT 0,
	CONSTRAINT "friend_mine_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."fserver_data" (
	"uid" varchar(255) NOT NULL,
	"value" text,
	CONSTRAINT "fserver_data_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."function_notice" (
	"uid" varchar(255) NOT NULL,
	"noticeMapStr" text,
	CONSTRAINT "function_notice_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."general_challenge_layer" (
	"id" integer DEFAULT 0 NOT NULL,
	"uid" varchar(96) DEFAULT '' NOT NULL,
	"count" integer,
	"buycount" integer,
	"finishcount" integer,
	"monsterid" integer,
	"challengetime" bigint,
	"resettime" bigint,
	CONSTRAINT "general_challenge_layer_PRIMARY" PRIMARY KEY("id","uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."gm_expedition_match" (
	"serverId" integer NOT NULL,
	"targetServerId" integer NOT NULL,
	"time" bigint DEFAULT 0,
	CONSTRAINT "gm_expedition_match_PRIMARY" PRIMARY KEY("serverId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."gold_cost_record" (
	"uid" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"goldType" integer,
	"type" integer NOT NULL,
	"param1" integer,
	"param2" integer,
	"originalGold" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remainGold" bigint NOT NULL,
	"time" bigint NOT NULL,
	CONSTRAINT "gold_cost_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."gold_eggs" (
	"uid" varchar(96) NOT NULL,
	"flushfreetimes" integer DEFAULT 0 NOT NULL,
	"flushtime" bigint DEFAULT 0 NOT NULL,
	"flushcount" integer DEFAULT 0 NOT NULL,
	"statelist" varchar(1024) DEFAULT '' NOT NULL,
	"freetimes" integer DEFAULT 0 NOT NULL,
	"everydaytime" bigint DEFAULT 0 NOT NULL,
	"multiple" integer DEFAULT 1 NOT NULL,
	"score" bigint DEFAULT 0 NOT NULL,
	"score_reward" varchar(512) DEFAULT '' NOT NULL,
	"ranking" integer DEFAULT 0 NOT NULL,
	"createtime" bigint DEFAULT 0 NOT NULL,
	"onlogintime" bigint DEFAULT 0,
	CONSTRAINT "gold_eggs_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."gold_group_buy" (
	"id" varchar(40) NOT NULL,
	"flushtime" bigint DEFAULT 0 NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"create_time" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "gold_group_buy_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."gold_wish_pool" (
	"uid" varchar(255) NOT NULL,
	"times" integer NOT NULL,
	"costGold" integer,
	"getGold" integer,
	"rate" integer,
	"time" bigint,
	CONSTRAINT "gold_wish_pool_PRIMARY" PRIMARY KEY("uid","times")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_0" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2024_0_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_1" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2024_1_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_10" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2024_10_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_11" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2024_11_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_2" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2024_2_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_3" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2024_3_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_4" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2024_4_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_5" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2024_5_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_6" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2024_6_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_7" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2024_7_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_8" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2024_8_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_9" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2024_9_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_0" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2026_0_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_1" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2026_1_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_10" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2026_10_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_11" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2026_11_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_2" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2026_2_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_3" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2026_3_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_4" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2026_4_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_5" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2026_5_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_6" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2026_6_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_7" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2026_7_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_8" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2026_8_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_9" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2026_9_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_0" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2027_0_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_1" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2027_1_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_10" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2027_10_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_11" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2027_11_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_2" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2027_2_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_3" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2027_3_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_4" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2027_4_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_5" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2027_5_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_6" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2027_6_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_7" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2027_7_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_8" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2027_8_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_9" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "goods_cost_record_2027_9_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_exchange_goods" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."goods_exchange_goods_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 3073 CACHE 1),
	"uid" varchar(40) NOT NULL,
	"type" smallint DEFAULT 1 NOT NULL,
	"sumNum" bigint DEFAULT 0 NOT NULL,
	"stage" smallint DEFAULT 1 NOT NULL,
	"getAward" smallint DEFAULT 0 NOT NULL,
	CONSTRAINT "goods_exchange_goods_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "goods_exchange_goods_type_range" CHECK ("type" BETWEEN -128 AND 127),
	CONSTRAINT "goods_exchange_goods_stage_range" CHECK ("stage" BETWEEN -128 AND 127),
	CONSTRAINT "goods_exchange_goods_getAward_range" CHECK ("getAward" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."hero_activity" (
	"uuid" varchar(255) NOT NULL,
	"activityId" varchar(100) NOT NULL,
	"activityType" integer,
	"startTime" bigint DEFAULT 0,
	"roundTime" bigint DEFAULT 0,
	"endTime" bigint DEFAULT 0,
	"finish" integer DEFAULT 0,
	"alreadyEvent" varchar(1000),
	"serverGroup" varchar(255),
	"kingdomRank" varchar(255),
	CONSTRAINT "hero_activity_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."hero_event" (
	"uuid" varchar(255) NOT NULL,
	"eventId" varchar(200) NOT NULL,
	"activityId" varchar(255) NOT NULL,
	"type" integer,
	"rewardType" integer,
	"readyTime" bigint DEFAULT 0,
	"startTime" bigint DEFAULT 0,
	"lastTime" bigint DEFAULT 0,
	"endTime" bigint DEFAULT 0,
	"rewardStatus" integer DEFAULT 0,
	"serverGroup" varchar(255),
	"kingdomRank" varchar(255),
	CONSTRAINT "hero_event_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."hero_event_reward_record" (
	"uid" varchar(255) NOT NULL,
	"allianceId" varchar(255) DEFAULT '' NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"rank" integer,
	"level" integer DEFAULT 0,
	"rewardId" varchar(255),
	"time" bigint DEFAULT 0,
	CONSTRAINT "hero_event_reward_record_PRIMARY" PRIMARY KEY("uid","allianceId","eventId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."hero_office" (
	"id" integer NOT NULL,
	"uid" varchar(40) NOT NULL,
	"officeId" varchar(40),
	"position" integer DEFAULT 0,
	"startTime" bigint DEFAULT 0,
	"lastRefreshExpTime" bigint DEFAULT 0,
	CONSTRAINT "hero_office_PRIMARY" PRIMARY KEY("id","uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."hot_buy_record" (
	"uid" varchar(255) NOT NULL,
	"goodsId" varchar(50) NOT NULL,
	"buyCount" integer DEFAULT 0,
	CONSTRAINT "hot_buy_record_PRIMARY" PRIMARY KEY("uid","goodsId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."hot_goods_cost_record" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(255) NOT NULL,
	"goodsId" varchar(20) NOT NULL,
	"priceType" integer,
	"price" integer,
	"buyTime" bigint,
	CONSTRAINT "hot_goods_cost_record_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."hot_info_before_refresh" (
	"uid" varchar(255) NOT NULL,
	"goodsId" varchar(20) NOT NULL,
	"itemId" varchar(20),
	"priceType" integer,
	"price" integer NOT NULL,
	"num" integer,
	"refreshTime" bigint DEFAULT 0 NOT NULL,
	"gold" integer DEFAULT 0,
	CONSTRAINT "hot_info_before_refresh_PRIMARY" PRIMARY KEY("uid","goodsId","price","refreshTime")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."hot_refresh_record" (
	"uid" varchar(255) NOT NULL,
	"count" integer DEFAULT 0,
	"todayTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "hot_refresh_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."innercityskin" (
	"uid" varchar(255) NOT NULL,
	"style" varchar(255) DEFAULT '-1',
	"zoom" varchar(255) DEFAULT '',
	"show_type" varchar(255) DEFAULT '-1',
	"time" varchar(255),
	CONSTRAINT "innercityskin_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."invest_everyday" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"tableid" integer NOT NULL,
	"level" integer NOT NULL,
	"isreceive" varchar(128) DEFAULT '' NOT NULL,
	"beginTime" bigint DEFAULT 0,
	"receiveTime" bigint DEFAULT 0,
	"endactive" integer DEFAULT 0,
	"promptTime" bigint DEFAULT 0,
	CONSTRAINT "invest_everyday_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."invite_count" (
	"uid" varchar(40) NOT NULL,
	"count" integer DEFAULT 0,
	CONSTRAINT "invite_count_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."invitee" (
	"uid" varchar(40) NOT NULL,
	"inviterUid" varchar(40) NOT NULL,
	"status" integer,
	"time" bigint,
	CONSTRAINT "invitee_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."inviter" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"inviteeUid" varchar(40) NOT NULL,
	"gold" bigint,
	"time" bigint,
	CONSTRAINT "inviter_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."item_count_control" (
	"itemId" varchar(50) NOT NULL,
	"count" integer,
	"total" integer,
	"total2" integer,
	"lastRefreshTime" bigint,
	CONSTRAINT "item_count_control_PRIMARY" PRIMARY KEY("itemId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."king_allot_tax_record" (
	"uuid" varchar(255) NOT NULL,
	"kingUid" varchar(255),
	"kingName" varchar(255),
	"toUid" varchar(255),
	"toUserName" varchar(255),
	"wood" bigint DEFAULT 0,
	"food" bigint DEFAULT 0,
	"iron" bigint DEFAULT 0,
	"stone" bigint DEFAULT 0,
	"sendTime" bigint DEFAULT 0,
	CONSTRAINT "king_allot_tax_record_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."king_fight_log" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."king_fight_log_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 46500 CACHE 1),
	"index" integer NOT NULL,
	"logTime" bigint DEFAULT 0,
	"logType" varchar(128) DEFAULT '',
	"uid" varchar(128) DEFAULT '',
	"log" varchar(2048) DEFAULT '',
	CONSTRAINT "king_fight_log_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."king_present_record" (
	"toUserId" varchar(40) NOT NULL,
	"presentId" integer NOT NULL,
	"presentNameId" integer NOT NULL,
	"sendTime" bigint NOT NULL,
	"abbr" varchar(10),
	CONSTRAINT "king_present_record_PRIMARY" PRIMARY KEY("toUserId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."king_skill_event" (
	"uid" varchar(256),
	"skillId" varchar(128),
	"data" varchar(1024),
	"opTime" bigint,
	"params" varchar(1024),
	"dialogId" varchar(128)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."king_skill_status" (
	"id" integer DEFAULT 0 NOT NULL,
	"kingMsg" varchar(2048) NOT NULL,
	"curChooseSkill" varchar(128),
	"skillMaterial" bigint,
	CONSTRAINT "king_skill_status_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."king_tax_record" (
	"uuid" varchar(255) NOT NULL,
	"taxTime" bigint DEFAULT 0,
	"type" integer DEFAULT 0,
	"targetServerName" varchar(255),
	"targetServerId" integer DEFAULT 0,
	"wood" bigint DEFAULT 0,
	"food" bigint DEFAULT 0,
	"iron" bigint DEFAULT 0,
	"stone" bigint DEFAULT 0,
	CONSTRAINT "king_tax_record_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."king_time_fight_log" (
	"uid" varchar(50) NOT NULL,
	"logtime" bigint,
	"category" integer,
	"humanUid" varchar(255),
	"pointId" integer,
	"data1" varchar(255),
	"data2" varchar(255),
	"data3" varchar(255),
	"data4" varchar(255),
	CONSTRAINT "king_time_fight_log_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_battle_team" (
	"id" varchar(40) NOT NULL,
	"type" integer NOT NULL,
	"targetId" integer NOT NULL,
	"targetUid" varchar(40),
	"targetName" varchar(255),
	"targetPic" varchar(40),
	"targetAName" varchar(40),
	"targetAAbbr" varchar(40),
	"targetAIcon" varchar(40),
	"targetType" integer DEFAULT 0,
	"leaderUid" varchar(40) NOT NULL,
	"leaderName" varchar(40) NOT NULL,
	"leaderId" integer,
	"allianceId" varchar(40) NOT NULL,
	"allianceName" varchar(40),
	"allianceAbbr" varchar(40),
	"allianceIcon" varchar(40),
	"maxSoldiers" integer NOT NULL,
	"waitTime" bigint NOT NULL,
	"createTime" bigint NOT NULL,
	"worldId" integer DEFAULT 0 NOT NULL,
	"failBackItem" integer DEFAULT 0,
	"superTeam" integer DEFAULT 0,
	CONSTRAINT "kingdom_battle_team_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_building" (
	"uuid" varchar(36) NOT NULL,
	"itemid" integer,
	"name" varchar(64),
	"worldid" integer,
	"point" integer,
	"level" integer,
	"star" integer,
	"progress" smallint,
	"creator" varchar(32),
	"createtime" bigint,
	"starttime" bigint,
	"updatetime" bigint,
	"type" smallint,
	"state" integer,
	"skin" varchar(64),
	"speed" numeric(20, 10),
	"maxdef" integer,
	"curdef" integer,
	"owner" integer,
	"occupy" integer,
	"reserve" bigint,
	CONSTRAINT "kingdom_building_PRIMARY" PRIMARY KEY("uuid"),
	CONSTRAINT "kingdom_building_progress_range" CHECK ("progress" BETWEEN -128 AND 127),
	CONSTRAINT "kingdom_building_type_range" CHECK ("type" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_building_buff" (
	"uuid" varchar(36) NOT NULL,
	"effect" integer NOT NULL,
	"value" double precision,
	"expiretime" bigint,
	"reserve" bigint,
	CONSTRAINT "kingdom_building_buff_PRIMARY" PRIMARY KEY("uuid","effect")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_cemetery" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."kingdom_cemetery_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 9 CACHE 1),
	"cemeteryStat" integer DEFAULT 0,
	"reviveStat" integer DEFAULT 0,
	"totalContribution" integer DEFAULT 0,
	"totalDead" bigint DEFAULT 0,
	"kingBlessingTime" bigint,
	"ministerBlessingTime" bigint,
	"startReviveTime" bigint,
	"needContributionSum" integer DEFAULT 0,
	CONSTRAINT "kingdom_cemetery_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_cross_fight_history" (
	"serverId" varchar(10) NOT NULL,
	"startTime" bigint NOT NULL,
	"round" integer NOT NULL,
	"score" bigint DEFAULT 0,
	"rank" integer DEFAULT 0,
	CONSTRAINT "kingdom_cross_fight_history_PRIMARY" PRIMARY KEY("serverId","startTime","round")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_info" (
	"serverId" integer NOT NULL,
	"wood" bigint DEFAULT 0,
	"food" bigint DEFAULT 0,
	"iron" bigint DEFAULT 0,
	"stone" bigint DEFAULT 0,
	"silver" bigint DEFAULT 0,
	"victoryTowerLevel" integer DEFAULT 1 NOT NULL,
	"expeditionUserCount" integer DEFAULT 0,
	"expeditionKillArmyCount" bigint DEFAULT 0,
	"expeditionKillMonsterCount" integer DEFAULT 0,
	"expeditionCollectCount" bigint DEFAULT 0,
	"isOccupyThrone" smallint DEFAULT 0,
	"throneScore" integer DEFAULT 0,
	"expeditionKingdomScore" integer DEFAULT 0,
	"kingdomMiracleLevel" integer DEFAULT 0,
	"ownerMiracles" text,
	"miracleOccupyCount" integer DEFAULT 0,
	"isMyThroneOccupy" smallint DEFAULT 0,
	"isOccupyOtherThrone" smallint DEFAULT 0,
	CONSTRAINT "kingdom_info_PRIMARY" PRIMARY KEY("serverId"),
	CONSTRAINT "kingdom_info_isOccupyThrone_range" CHECK ("isOccupyThrone" BETWEEN -128 AND 127),
	CONSTRAINT "kingdom_info_isMyThroneOccupy_range" CHECK ("isMyThroneOccupy" BETWEEN -128 AND 127),
	CONSTRAINT "kingdom_info_isOccupyOtherThrone_range" CHECK ("isOccupyOtherThrone" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_position" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"positionId" varchar(40) DEFAULT '' NOT NULL,
	"time" bigint,
	"chNameFlag" integer,
	"preKingUid" varchar(40),
	"relinquishEndTime" bigint,
	"currResourceType" integer,
	"chBannerFlag" integer,
	"chThronePicFlag" integer,
	"appointedTime" bigint DEFAULT 0,
	"valid" integer DEFAULT 0,
	"cemeteryBlessTime" bigint DEFAULT 0,
	"serverId" integer DEFAULT 0,
	"isSmall" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "kingdom_position_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_position_appoint" (
	"positionId" integer DEFAULT 0 NOT NULL,
	"appointTime" bigint DEFAULT 0,
	CONSTRAINT "kingdom_position_appoint_PRIMARY" PRIMARY KEY("positionId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_skill_log" (
	"uid" varchar(255) NOT NULL,
	"skillId" integer NOT NULL,
	"logTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "kingdom_skill_log_PRIMARY" PRIMARY KEY("uid","skillId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."logaction" (
	"uid" varchar(50) NOT NULL,
	"user" varchar(200) NOT NULL,
	"timeStamp" bigint NOT NULL,
	"action" varchar(50) NOT NULL,
	"code" varchar(100) NOT NULL,
	"info" varchar(2048) NOT NULL,
	"param" "bytea",
	CONSTRAINT "logaction_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "logaction_param_length" CHECK (octet_length("param") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."logrecord" (
	"uid" varchar(50) NOT NULL,
	"user" varchar(200) NOT NULL,
	"timeStamp" bigint NOT NULL,
	"category" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"param3" integer,
	"param4" integer,
	"data1" varchar(255),
	"data2" varchar(255),
	"data3" varchar(255),
	"data4" varchar(255),
	CONSTRAINT "logrecord_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."logrecord_fight" (
	"uid" varchar(50) NOT NULL,
	"user" varchar(200) NOT NULL,
	"timeStamp" bigint NOT NULL,
	"category" integer NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"param3" integer,
	"param4" integer,
	"data1" varchar(255),
	"data2" varchar(255),
	"data3" varchar(255),
	"data4" varchar(255),
	"data5" varchar(4086),
	CONSTRAINT "logrecord_fight_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."logstat" (
	"uid" varchar(50) NOT NULL,
	"user" varchar(200) NOT NULL,
	"timeStamp" bigint NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"param3" integer,
	"param4" integer,
	"param5" integer,
	"data1" integer,
	"data2" bigint,
	"data3" integer,
	"data4" integer,
	"data5" integer,
	"data6" integer,
	"data7" integer,
	"data8" integer,
	CONSTRAINT "logstat_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."logtemp" (
	"uid" varchar(50) NOT NULL,
	"user" varchar(200) NOT NULL,
	"timeStamp" bigint NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"param3" integer,
	"param4" integer,
	"param5" integer,
	"data1" integer,
	"data2" integer,
	"data3" integer,
	"data4" integer,
	"data5" integer,
	"data6" integer,
	"data7" integer,
	"data8" integer,
	CONSTRAINT "logtemp_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."logtmp" (
	"uid" varchar(50) NOT NULL,
	"user" varchar(200) NOT NULL,
	"timeStamp" bigint NOT NULL,
	"type" integer,
	"param1" integer,
	"param2" integer,
	"param3" integer,
	"param4" integer,
	"param5" integer,
	"data1" integer,
	"data2" integer,
	"data3" integer,
	"data4" integer,
	"data5" integer,
	"data6" integer,
	"data7" integer,
	"data8" integer,
	CONSTRAINT "logtmp_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."lottery_log" (
	"uid" varchar(40) NOT NULL,
	"name" varchar(200),
	"type" smallint,
	"superMode" smallint,
	"lotteryId" varchar(40),
	"lotteryInfo" varchar(200),
	"result" varchar(100),
	"position" integer,
	"cost" integer,
	"createTime" bigint NOT NULL,
	CONSTRAINT "lottery_log_PRIMARY" PRIMARY KEY("uid","createTime"),
	CONSTRAINT "lottery_log_type_range" CHECK ("type" BETWEEN -128 AND 127),
	CONSTRAINT "lottery_log_superMode_range" CHECK ("superMode" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."lottery_record" (
	"uid" varchar(40) NOT NULL,
	"type" integer NOT NULL,
	"superMode" integer NOT NULL,
	"step" integer NOT NULL,
	"times1" integer NOT NULL,
	"times2" integer NOT NULL,
	"multiple" integer NOT NULL,
	"result" varchar(100) NOT NULL,
	"lotteryId" varchar(40) NOT NULL,
	"lotteryInfo1" varchar(200) NOT NULL,
	"lotteryInfo2" varchar(100) NOT NULL,
	"updateTime" bigint NOT NULL,
	"times3" integer DEFAULT 0,
	"times4" integer DEFAULT 0,
	"boxTimes" integer DEFAULT 0,
	CONSTRAINT "lottery_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."luck_draw_history" (
	"gameUid" varchar(255),
	"roleName" varchar(40),
	"allianceId" varchar(40),
	"allianceName" varchar(40),
	"type" integer,
	"itemId" varchar(255),
	"time" bigint
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."lucky_bag" (
	"uid" varchar(255) NOT NULL,
	"openFreetimes" integer DEFAULT 0,
	"flushTimes" integer DEFAULT 0,
	"nextOpenTime" integer DEFAULT 0,
	"multiple" integer DEFAULT 1,
	"score" integer DEFAULT 0,
	"scoreReward" varchar(255),
	CONSTRAINT "lucky_bag_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."lucky_day" (
	"uid" varchar(255) NOT NULL,
	"unluckyCount" integer DEFAULT 0,
	"status" integer DEFAULT 0,
	"time" bigint,
	"effectId" varchar(40),
	"luckyCount" integer,
	"lucky_id" integer,
	CONSTRAINT "lucky_day_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail" (
	"uid" varchar(40) NOT NULL,
	"toUser" varchar(40) NOT NULL,
	"fromUser" varchar(40),
	"fromName" varchar(100) DEFAULT '',
	"title" varchar(255) DEFAULT '' NOT NULL,
	"contents" "bytea" NOT NULL,
	"rewardId" text,
	"itemIdFlag" integer DEFAULT 0,
	"status" integer DEFAULT 0,
	"type" integer DEFAULT 1 NOT NULL,
	"rewardStatus" integer DEFAULT 0 NOT NULL,
	"saveFlag" integer DEFAULT 0,
	"createTime" bigint NOT NULL,
	"reply" integer DEFAULT 0 NOT NULL,
	"translationId" varchar(255),
	CONSTRAINT "mail_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "mail_contents_length" CHECK (octet_length("contents") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail_20150212" (
	"uid" varchar(40) NOT NULL,
	"toUser" varchar(40) NOT NULL,
	"fromUser" varchar(40),
	"fromName" varchar(100) NOT NULL,
	"title" varchar(40) NOT NULL,
	"contents" "bytea" NOT NULL,
	"rewardId" "bytea",
	"itemIdFlag" integer DEFAULT 0,
	"status" integer DEFAULT 0,
	"type" integer DEFAULT 1 NOT NULL,
	"rewardStatus" integer DEFAULT 0 NOT NULL,
	"saveFlag" integer DEFAULT 0,
	"createTime" bigint NOT NULL,
	"reply" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "mail_20150212_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "mail_20150212_contents_length" CHECK (octet_length("contents") <= 65535),
	CONSTRAINT "mail_20150212_rewardId_length" CHECK (octet_length("rewardId") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail_contents" (
	"uid" varchar(40) NOT NULL,
	"contents" "bytea" NOT NULL,
	"toUser" varchar(40) DEFAULT '',
	CONSTRAINT "mail_contents_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "mail_contents_contents_length" CHECK (octet_length("contents") <= 16777215)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail_contents_1016" (
	"id" varchar(40) NOT NULL,
	"title" varchar(40) NOT NULL,
	"contents" "bytea" NOT NULL,
	"rewardId" "bytea",
	"itemIdFlag" integer DEFAULT 0,
	"createTime" bigint NOT NULL,
	CONSTRAINT "mail_contents_1016_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "mail_contents_1016_contents_length" CHECK (octet_length("contents") <= 65535),
	CONSTRAINT "mail_contents_1016_rewardId_length" CHECK (octet_length("rewardId") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail_contents_20141030" (
	"id" varchar(40) NOT NULL,
	"title" varchar(40) NOT NULL,
	"contents" "bytea" NOT NULL,
	"rewardId" "bytea",
	"itemIdFlag" integer DEFAULT 0,
	"createTime" bigint NOT NULL,
	CONSTRAINT "mail_contents_20141030_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "mail_contents_20141030_contents_length" CHECK (octet_length("contents") <= 65535),
	CONSTRAINT "mail_contents_20141030_rewardId_length" CHECK (octet_length("rewardId") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail_group" (
	"uid" varchar(40) NOT NULL,
	"groupType" integer DEFAULT 1 NOT NULL,
	"groupIndex" varchar(40) NOT NULL,
	"updateTime" bigint NOT NULL,
	CONSTRAINT "mail_group_PRIMARY" PRIMARY KEY("uid","groupType","groupIndex")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail_group_20150212" (
	"uid" varchar(40) NOT NULL,
	"groupType" integer DEFAULT 1 NOT NULL,
	"groupIndex" varchar(40) NOT NULL,
	"updateTime" bigint NOT NULL,
	CONSTRAINT "mail_group_20150212_PRIMARY" PRIMARY KEY("uid","groupType","groupIndex")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail_reward_log" (
	"uid" varchar(40) NOT NULL,
	"mailId" varchar(40) NOT NULL,
	"type" integer,
	"createTime" bigint NOT NULL,
	"status" smallint,
	CONSTRAINT "mail_reward_log_PRIMARY" PRIMARY KEY("uid","mailId","createTime"),
	CONSTRAINT "mail_reward_log_status_range" CHECK ("status" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."marketing_log" (
	"uid" varchar(255) NOT NULL,
	"id" varchar(255) NOT NULL,
	"network" varchar(255) DEFAULT '' NOT NULL,
	"time" bigint,
	"deviceId" varchar(255),
	CONSTRAINT "marketing_log_PRIMARY" PRIMARY KEY("uid","id","network")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."material_control" (
	"uid" varchar(40) NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"time" bigint DEFAULT 0,
	CONSTRAINT "material_control_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."material_cost_ranking" (
	"uid" varchar(40) NOT NULL,
	"contributeSum" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "material_cost_ranking_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."material_cost_record" (
	"uid" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"type" integer NOT NULL,
	"param1" integer,
	"param2" integer,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	"time" bigint NOT NULL,
	CONSTRAINT "material_cost_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."menu" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."menu_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"module_id" integer,
	"name" varchar(50),
	"pinyin" varchar(200),
	"path" varchar(200),
	"type" varchar(10),
	"p_id" integer,
	"comments" varchar(100),
	"is_prod" smallint,
	"is_log" smallint,
	"order_num" varchar(9),
	CONSTRAINT "menu_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "menu_is_prod_range" CHECK ("is_prod" BETWEEN -128 AND 127),
	CONSTRAINT "menu_is_log_range" CHECK ("is_log" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."methods" (
	"method_id" integer NOT NULL,
	"route_id" integer,
	"method_name" varchar(50),
	"method_path" varchar(50),
	CONSTRAINT "methods_PRIMARY" PRIMARY KEY("method_id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."military_cost_record" (
	"uid" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"type" integer NOT NULL,
	"param1" varchar(255) DEFAULT '' NOT NULL,
	"param2" varchar(255) DEFAULT '' NOT NULL,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	"time" bigint NOT NULL,
	CONSTRAINT "military_cost_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."mod_authorize" (
	"uid" varchar(255) NOT NULL,
	"authorize" integer DEFAULT 1,
	CONSTRAINT "mod_authorize_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."mod_record" (
	"id" bigint GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."mod_record_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"fromUser" varchar(255),
	"toUser" varchar(255),
	"mailType" integer,
	"createTime" bigint,
	CONSTRAINT "mod_record_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."modules" (
	"module_id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."modules_module_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"module_name" varchar(50),
	"module_flag" varchar(50),
	"app_id" varchar(32) DEFAULT '' NOT NULL,
	"group_name" varchar(255) DEFAULT '' NOT NULL,
	CONSTRAINT "modules_PRIMARY" PRIMARY KEY("module_id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."monitor_test" (
	"id" bigint GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."monitor_test_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"value" varchar(255),
	CONSTRAINT "monitor_test_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."monster_everyday_refresh" (
	"monster_id" varchar(255) DEFAULT '' NOT NULL,
	"monster_num" integer,
	"refreshtime" bigint,
	CONSTRAINT "monster_everyday_refresh_PRIMARY" PRIMARY KEY("monster_id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."monster_siege" (
	"allianceId" varchar(40) NOT NULL,
	"monsterCastleId" integer DEFAULT 0,
	"startTime" bigint DEFAULT 0,
	"endTime" bigint DEFAULT 0,
	"state" integer DEFAULT 0 NOT NULL,
	"currPhase" integer DEFAULT 0,
	"currRoundIndex" integer DEFAULT 0,
	"currRoundStartTime" bigint DEFAULT 0,
	"currmemberUidListInfo" varchar(4000),
	"memberUidListInfo" varchar(4000),
	"allianceKillCount" bigint DEFAULT 0,
	"currMonsterInfo" varchar(4000),
	"monsterCastleIds" varchar(400),
	"monsterPerRoundNum" varchar(500),
	CONSTRAINT "monster_siege_PRIMARY" PRIMARY KEY("allianceId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."monster_siege_top_history" (
	"allianceId" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"allianceAbbr" varchar(40) NOT NULL,
	"allianceName" varchar(40) NOT NULL,
	"rank" integer NOT NULL,
	"killCount" bigint DEFAULT 0,
	"siegeRound" integer DEFAULT 0,
	"validMemberCount" integer DEFAULT 0,
	"allianceCount" integer DEFAULT 0,
	"activityAllianceCount" integer DEFAULT 0,
	"activity30AllianceCount" integer DEFAULT 0,
	"activity40AllianceCount" integer DEFAULT 0,
	"activity50AllianceCount" integer DEFAULT 0,
	"monsterPerRoundNum" varchar(500),
	CONSTRAINT "monster_siege_top_history_PRIMARY" PRIMARY KEY("allianceId","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."monthly_card" (
	"uid" varchar(40) NOT NULL,
	"itemId" varchar(40) NOT NULL,
	"accept" integer DEFAULT 0,
	"time" bigint DEFAULT 0,
	"available" integer DEFAULT 0,
	"buyTime" bigint DEFAULT 0,
	"optionId" integer,
	CONSTRAINT "monthly_card_PRIMARY" PRIMARY KEY("uid","itemId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_city_log" (
	"pointId" integer NOT NULL,
	"time" bigint NOT NULL,
	"x" integer,
	"y" integer,
	"count" integer,
	"uids" varchar(1000),
	CONSTRAINT "move_city_log_PRIMARY" PRIMARY KEY("pointId","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_city_time" (
	"uid" varchar(255) NOT NULL,
	"time" bigint DEFAULT 0,
	CONSTRAINT "move_city_time_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_0" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_0_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_1" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_1_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_10" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_10_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_11" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_11_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_2" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_2_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_3" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_3_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_4" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_4_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_5" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_5_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_6" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_6_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_7" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_7_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_8" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_8_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_9" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_9_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_total" (
	"uid" varchar(255) NOT NULL,
	"total" integer DEFAULT 0,
	CONSTRAINT "move_total_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."neutral_server_info" (
	"serverId" integer NOT NULL,
	"groupId" integer NOT NULL,
	"stateId" integer DEFAULT 0 NOT NULL,
	"startTime" bigint DEFAULT 0,
	"endTime" bigint DEFAULT 0,
	"ownerServerId" integer DEFAULT 0,
	"open" smallint DEFAULT 0,
	"resType" integer DEFAULT 0,
	CONSTRAINT "neutral_server_info_PRIMARY" PRIMARY KEY("serverId"),
	CONSTRAINT "neutral_server_info_open_range" CHECK ("open" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."new_exped_history" (
	"stageId" integer DEFAULT 0,
	"winServerId" integer DEFAULT 0,
	"loseServerId" integer DEFAULT 0,
	"users" varchar(1500) DEFAULT '',
	"createTime" bigint DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."new_general" (
	"id" integer DEFAULT 0 NOT NULL,
	"uid" varchar(96) DEFAULT '' NOT NULL,
	"exp" integer,
	"level" integer,
	"quality" integer,
	"talentpoint" integer,
	"state" smallint,
	"predatoruid" varchar(96),
	"relivetime" bigint,
	"buildingUuid" varchar(96),
	"skillInfo" varchar(6000),
	"createtime" bigint,
	"talent" varchar(5000),
	"serverid" integer,
	"robtime" bigint,
	"killtime" bigint,
	"gethomttime" bigint,
	"optime" varchar(200),
	"refineproperty" varchar(300),
	"oldrefineproperty" varchar(300),
	"refinegold" integer,
	"refinecard" integer,
	"refinecount" integer,
	"lockproperty" varchar(60),
	"refreshproperty" varchar(300),
	"breach" varchar(128),
	"star" integer DEFAULT 1,
	"baseSkill" varchar(256),
	CONSTRAINT "new_general_PRIMARY" PRIMARY KEY("id","uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."new_general_buy" (
	"uid" varchar(255) NOT NULL,
	"generalId" integer NOT NULL,
	"countType1" integer DEFAULT 0 NOT NULL,
	"countType2" integer DEFAULT 0 NOT NULL,
	"countType3" integer DEFAULT 0 NOT NULL,
	"countType4" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "new_general_buy_PRIMARY" PRIMARY KEY("uid","generalId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."new_general_skill" (
	"uid" varchar(96) DEFAULT '' NOT NULL,
	"newGeneralId" integer DEFAULT 0 NOT NULL,
	"skillId" varchar(60) DEFAULT '' NOT NULL,
	"startTime" bigint,
	"actTime" bigint,
	"endTime" bigint,
	"stat" integer,
	CONSTRAINT "new_general_skill_PRIMARY" PRIMARY KEY("uid","newGeneralId","skillId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."new_general_status" (
	"uid" varchar(96) DEFAULT '' NOT NULL,
	"newGeneralId" integer DEFAULT 0 NOT NULL,
	"stateId" integer DEFAULT 0 NOT NULL,
	"startTime" bigint,
	"endTime" bigint,
	CONSTRAINT "new_general_status_PRIMARY" PRIMARY KEY("uid","newGeneralId","stateId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."new_sercum_recharge" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"id" varchar(255) NOT NULL,
	CONSTRAINT "new_sercum_recharge_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."new_user_score" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(255),
	"score" double precision NOT NULL,
	"takeReward" varchar(500),
	"rankingrewardstage" varchar(300) DEFAULT '',
	"kingdomrewardstage" varchar(300) DEFAULT '',
	"stage" integer DEFAULT 0,
	CONSTRAINT "new_user_score_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."notice_cost_log" (
	"uid" varchar(40) NOT NULL,
	"type" smallint,
	"itemId" varchar(20) NOT NULL,
	"cost" integer,
	"createTime" bigint NOT NULL,
	CONSTRAINT "notice_cost_log_PRIMARY" PRIMARY KEY("uid","itemId","createTime"),
	CONSTRAINT "notice_cost_log_type_range" CHECK ("type" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."npc_trade" (
	"uid" varchar(40) NOT NULL,
	"trade" varchar(100) NOT NULL,
	"time" bigint DEFAULT 0,
	"num" integer DEFAULT 0,
	"superValue" integer DEFAULT 0,
	CONSTRAINT "npc_trade_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."ob_record" (
	"uid" varchar(50) NOT NULL,
	"allianceIds" varchar(200) NOT NULL,
	"begin" bigint DEFAULT 0 NOT NULL,
	"serverId" integer DEFAULT 0 NOT NULL,
	"areaId" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "ob_record_PRIMARY" PRIMARY KEY("uid","allianceIds")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."ob_report" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."ob_report_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"worldId" integer NOT NULL,
	"content" "bytea",
	"createTime" bigint,
	CONSTRAINT "ob_report_PRIMARY" PRIMARY KEY("id","worldId"),
	CONSTRAINT "ob_report_content_length" CHECK (octet_length("content") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."ob_user" (
	"uid" varchar(50) NOT NULL,
	"worldId" integer,
	"param1" varchar(200),
	"createTime" bigint,
	CONSTRAINT "ob_user_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."oldmailinsert" (
	"uid" varchar(40) NOT NULL,
	"type" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "oldmailinsert_PRIMARY" PRIMARY KEY("uid","type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."parse_info" (
	"uid" varchar(40) NOT NULL,
	"type" integer NOT NULL,
	"status" integer NOT NULL,
	"audio" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "parse_info_PRIMARY" PRIMARY KEY("uid","type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."pay_action" (
	"uid" varchar(40) NOT NULL,
	"exchangeId" varchar(20) NOT NULL,
	"pf" varchar(20),
	"createTime" bigint NOT NULL,
	CONSTRAINT "pay_action_PRIMARY" PRIMARY KEY("uid","exchangeId","createTime")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."pay_order_count" (
	"uid" varchar(40) NOT NULL,
	"className" varchar(40) NOT NULL,
	"action" integer DEFAULT 0,
	"time" bigint DEFAULT 0,
	CONSTRAINT "pay_order_count_PRIMARY" PRIMARY KEY("uid","className")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."pay_order_count_log" (
	"uid" varchar(40) NOT NULL,
	"className" varchar(40) NOT NULL,
	"action" integer DEFAULT 0,
	"time" bigint DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."pay_request" (
	"uid" varchar(40) NOT NULL,
	"pf" varchar(20) NOT NULL,
	"time" bigint NOT NULL,
	"optionId" integer,
	"purchaseId" varchar(10) DEFAULT '',
	"productId" varchar(10) DEFAULT '',
	"status" integer DEFAULT 0,
	"finishTime" bigint DEFAULT 0,
	CONSTRAINT "pay_request_PRIMARY" PRIMARY KEY("uid","pf","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."pay_total" (
	"uid" varchar(40) NOT NULL,
	"gold" bigint,
	"updateTime" bigint,
	"type" integer DEFAULT 1 NOT NULL,
	"getLv" integer DEFAULT 0,
	CONSTRAINT "pay_total_PRIMARY" PRIMARY KEY("uid","type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."pay_total_log" (
	"uid" varchar(40) NOT NULL,
	"level" integer NOT NULL,
	"gold" bigint,
	"createTime" bigint NOT NULL,
	"type" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "pay_total_log_PRIMARY" PRIMARY KEY("uid","level","createTime","type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."paycheck" (
	"uid" varchar(40) NOT NULL,
	"orderId" varchar(200) NOT NULL,
	"pf" varchar(20) NOT NULL,
	"time" bigint,
	"status" varchar(20),
	"apidata" "bytea",
	CONSTRAINT "paycheck_PRIMARY" PRIMARY KEY("uid","orderId","pf"),
	CONSTRAINT "paycheck_apidata_length" CHECK (octet_length("apidata") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."paylog" (
	"uid" varchar(40) NOT NULL,
	"orderId" varchar(200) NOT NULL,
	"pf" varchar(20) NOT NULL,
	"productId" varchar(10) DEFAULT '0' NOT NULL,
	"orderInfo" varchar(200),
	"orderParam" "bytea",
	"comments" varchar(100),
	"time" bigint,
	"currency" integer DEFAULT 0,
	"spend" numeric(10, 2) DEFAULT 0.00 NOT NULL,
	"paid" numeric(10, 2) DEFAULT 0.00,
	"status" integer DEFAULT 0,
	"payLevel" integer NOT NULL,
	"buildingLv" integer DEFAULT 0,
	"receiverId" varchar(40),
	"deviceId" varchar(255),
	"ip" varchar(20) DEFAULT '',
	"curGaid" varchar(40),
	"truelyIp" varchar(20),
	"optionId" varchar(100),
	CONSTRAINT "paylog_PRIMARY" PRIMARY KEY("uid","orderId","pf"),
	CONSTRAINT "paylog_orderParam_length" CHECK (octet_length("orderParam") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."paylog_back" (
	"uid" varchar(40) NOT NULL,
	"orderId" varchar(40) NOT NULL,
	"productId" varchar(10) DEFAULT '0' NOT NULL,
	"time" bigint,
	"currency" integer DEFAULT 0,
	"spend" numeric(10, 0) DEFAULT 0 NOT NULL,
	"status" integer DEFAULT 0,
	"payLevel" integer NOT NULL,
	CONSTRAINT "paylog_back_PRIMARY" PRIMARY KEY("uid","orderId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."personal_data" (
	"uid" varchar(255) NOT NULL,
	"value" text,
	CONSTRAINT "personal_data_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."pic_upload_record" (
	"uid" varchar(255) NOT NULL,
	"picVer" integer DEFAULT 0,
	"updateTime" bigint DEFAULT 9223372036854775807,
	"report" integer DEFAULT 0,
	"banCount" integer DEFAULT 0,
	"banTime" bigint DEFAULT 0,
	"stat" integer DEFAULT 0,
	CONSTRAINT "pic_upload_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."platform_first_login_reward" (
	"uid" varchar(50) NOT NULL,
	"hasReward" integer DEFAULT 0 NOT NULL,
	"pf" varchar(40),
	"rewardTime" bigint,
	CONSTRAINT "platform_first_login_reward_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."play_evolutions" (
	"id" integer NOT NULL,
	"hash" varchar(255) NOT NULL,
	"applied_at" text DEFAULT to_char(statement_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') NOT NULL,
	"apply_script" text,
	"revert_script" text,
	"state" varchar(255),
	"last_problem" text,
	CONSTRAINT "play_evolutions_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "play_evolutions_applied_at_temporal" CHECK (("applied_at" IS NULL OR (CASE WHEN "applied_at" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("applied_at",4) <> '0000' AND substring("applied_at",6,2) <> '00' AND substring("applied_at",9,2) <> '00' THEN to_char(to_date(left("applied_at",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("applied_at",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."player" (
	"id" varchar(8) NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "player_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."player_percents_save" (
	"uid" varchar(255) NOT NULL,
	"footEffect" real DEFAULT 0 NOT NULL,
	"rideEffect" real DEFAULT 0 NOT NULL,
	"bowEffect" real DEFAULT 0 NOT NULL,
	"carEffect" real DEFAULT 0 NOT NULL,
	CONSTRAINT "player_percents_save_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."playerinfo" (
	"uid" varchar(40) NOT NULL,
	"battlesWin" integer DEFAULT 0,
	"battlesLose" integer DEFAULT 0,
	"attacksWin" integer DEFAULT 0,
	"attacksLose" integer DEFAULT 0,
	"defensesWin" integer DEFAULT 0,
	"detectNum" integer DEFAULT 0,
	"armyKill" bigint DEFAULT 0,
	"armyDead" integer DEFAULT 0,
	"armyCure" integer DEFAULT 0,
	"cityDestroyed" integer DEFAULT 0,
	"questPower" integer DEFAULT 0,
	"power" bigint DEFAULT 0,
	"buildingPower" bigint DEFAULT 0,
	"is_reward" varchar(255) DEFAULT 'N' NOT NULL,
	CONSTRAINT "playerinfo_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."point_minifort" (
	"pointId" integer NOT NULL,
	"fortPointId" integer NOT NULL,
	CONSTRAINT "point_minifort_PRIMARY" PRIMARY KEY("pointId","fortPointId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."post_box" (
	"uid" varchar(40) NOT NULL,
	"from" varchar(255) DEFAULT '',
	"name" varchar(255) DEFAULT '',
	"publicValue" integer,
	"contents" "bytea" NOT NULL,
	"seal" varchar(40) DEFAULT '',
	"time" bigint NOT NULL,
	CONSTRAINT "post_box_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "post_box_contents_length" CHECK (octet_length("contents") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."post_mail" (
	"uid" varchar(40) NOT NULL,
	"boxId" varchar(40) NOT NULL,
	"toUser" varchar(40) NOT NULL,
	"fromUser" varchar(40),
	"fromName" varchar(100) NOT NULL,
	"contents" "bytea" NOT NULL,
	"seal" varchar(40) DEFAULT '',
	"createTime" bigint NOT NULL,
	CONSTRAINT "post_mail_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "post_mail_contents_length" CHECK (octet_length("contents") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."post_relation" (
	"uid" varchar(40) NOT NULL,
	"publicValue" varchar(600),
	"time" bigint NOT NULL,
	"players" varchar(600),
	CONSTRAINT "post_relation_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."pray_record" (
	"id" bigint GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."pray_record_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 44571 CACHE 1),
	"uid" varchar(255) NOT NULL,
	"cost" integer DEFAULT 0 NOT NULL,
	"resource" varchar(20) NOT NULL,
	"num" integer NOT NULL,
	"hit" integer DEFAULT 0,
	"prayTime" bigint,
	CONSTRAINT "pray_record_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."princess_task" (
	"uid" varchar(40) NOT NULL,
	"id" varchar(255) NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"sub" varchar(255) NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 1 NOT NULL,
	"time" bigint DEFAULT 0,
	"completeTime" bigint DEFAULT 0,
	"pop" integer DEFAULT 0,
	CONSTRAINT "princess_task_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."princess_task_record" (
	"uid" varchar(40) NOT NULL,
	"refreshNum" integer DEFAULT 0,
	"refreshTime" bigint DEFAULT 0,
	"completeNum" integer DEFAULT 0,
	"completeTime" bigint DEFAULT 0,
	CONSTRAINT "princess_task_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."princess_task_stat" (
	"uid" varchar(255) NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"taskId" integer NOT NULL,
	"taskType" integer NOT NULL,
	"acceptTime" bigint NOT NULL,
	"state" integer NOT NULL,
	"param1" bigint NOT NULL,
	CONSTRAINT "princess_task_stat_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."promotion_log" (
	"channel" varchar(100) NOT NULL,
	"statId" varchar(100) NOT NULL,
	"exchangeId" varchar(20) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"adId" varchar(100) DEFAULT '',
	"deviceType" integer DEFAULT 0,
	"showTime" bigint,
	"buyTime" bigint,
	"state" integer DEFAULT 0,
	"deviceid" varchar(255),
	"accountid" varchar(50),
	"campaignid" varchar(50),
	"adgroupid" varchar(50),
	"creativeid" varchar(50),
	"location" varchar(50),
	CONSTRAINT "promotion_log_PRIMARY" PRIMARY KEY("channel","statId","exchangeId","uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."protect_total" (
	"uid" varchar(255) NOT NULL,
	"total" integer DEFAULT 0,
	CONSTRAINT "protect_total_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."push_log" (
	"uid" varchar(40) NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL,
	"message" varchar(100),
	"status" integer,
	CONSTRAINT "push_log_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."push_record" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"type" varchar(10) DEFAULT '0',
	"msg" "bytea",
	"status" integer DEFAULT 0,
	CONSTRAINT "push_record_PRIMARY" PRIMARY KEY("uid","time"),
	CONSTRAINT "push_record_msg_length" CHECK (octet_length("msg") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."question_match" (
	"id" varchar(40) NOT NULL,
	"result" varchar(40),
	"startBetTime" bigint,
	"startTime" bigint,
	"ended" integer,
	"betNum" bigint,
	CONSTRAINT "question_match_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."queue" (
	"uuid" varchar(40) NOT NULL,
	"ownerId" varchar(40) NOT NULL,
	"qid" integer NOT NULL,
	"type" integer NOT NULL,
	"itemId" varchar(255),
	"startTime" bigint,
	"endTime" bigint NOT NULL,
	"updateTime" bigint NOT NULL,
	"isHelped" integer,
	"para" integer DEFAULT 0,
	"totalTime" bigint DEFAULT 0,
	"exchgType" smallint DEFAULT 0,
	CONSTRAINT "queue_PRIMARY" PRIMARY KEY("uuid"),
	CONSTRAINT "queue_exchgType_range" CHECK ("exchgType" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."receive_heart" (
	"uid" varchar(40) NOT NULL,
	"duration" integer NOT NULL,
	"effecttype" varchar(2) NOT NULL,
	"senduid" varchar(40) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."receive_item" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."receive_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" varchar(50) NOT NULL,
	"senduid" varchar(50) NOT NULL,
	"itemId" varchar(50) DEFAULT '0' NOT NULL,
	"itemNum" integer DEFAULT 0 NOT NULL,
	"createTime" bigint,
	CONSTRAINT "receive_item_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."red_packets" (
	"uid" varchar(255) NOT NULL,
	"range" integer DEFAULT 0,
	"rangeId" varchar(255) DEFAULT '',
	"type" integer DEFAULT 0,
	"sender" varchar(255) DEFAULT '',
	"senderName" varchar(255) DEFAULT '',
	"pic" varchar(40),
	"picVer" integer DEFAULT 0,
	"total" integer DEFAULT 0,
	"remain" integer DEFAULT 0,
	"sendTime" bigint DEFAULT 0,
	"endTime" bigint DEFAULT 0,
	"totalPeople" integer DEFAULT 0,
	"curPeople" integer DEFAULT 0,
	"state" integer DEFAULT 0,
	CONSTRAINT "red_packets_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."red_packets_records" (
	"uid" varchar(255) NOT NULL,
	"player" varchar(255) DEFAULT '' NOT NULL,
	"name" varchar(255) DEFAULT '',
	"pic" varchar(40),
	"picVer" integer DEFAULT 0,
	"value" integer DEFAULT 0,
	"getTime" bigint DEFAULT 0,
	CONSTRAINT "red_packets_records_PRIMARY" PRIMARY KEY("uid","player")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."redis_cfg_backup" (
	"keyFlag" varchar(128) NOT NULL,
	"info" varchar(2048) DEFAULT '0',
	CONSTRAINT "redis_cfg_backup_PRIMARY" PRIMARY KEY("keyFlag")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."refund_log" (
	"refundId" varchar(255) NOT NULL,
	"order" integer NOT NULL,
	"time" bigint NOT NULL,
	"userId" varchar(255) NOT NULL,
	"type" integer,
	"itemId" varchar(16) NOT NULL,
	"original" bigint NOT NULL,
	"cost" integer NOT NULL,
	"remain" bigint NOT NULL,
	CONSTRAINT "refund_log_PRIMARY" PRIMARY KEY("refundId","order")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."report" (
	"uid" varchar(40) NOT NULL,
	"createTime" bigint NOT NULL,
	"report" "bytea" NOT NULL,
	CONSTRAINT "report_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "report_report_length" CHECK (octet_length("report") <= 16777215)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."res_area_count" (
	"areaId" integer NOT NULL,
	"count" integer NOT NULL,
	CONSTRAINT "res_area_count_PRIMARY" PRIMARY KEY("areaId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."rescue_skill_record" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(255),
	"marchUuid" varchar(255),
	"targetUid" varchar(255),
	"marchType" integer,
	"targetType" integer,
	"attackTime" bigint,
	"returnTime" bigint DEFAULT 0,
	"activate" integer DEFAULT 0,
	"saved" integer DEFAULT 0,
	"attack" integer DEFAULT 0,
	CONSTRAINT "rescue_skill_record_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_107" (
	"uid" varchar(255) NOT NULL,
	"version" varchar(255) NOT NULL,
	"sid" integer DEFAULT 0,
	"107uid" varchar(255),
	"name" varchar(255),
	"rewardLevel" integer DEFAULT 0,
	"rewardStatus" integer DEFAULT 0,
	"endTime" bigint DEFAULT 0,
	CONSTRAINT "reward_107_PRIMARY" PRIMARY KEY("uid","version")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_item_control" (
	"uid" varchar(255) NOT NULL,
	"itemId" varchar(255) NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"flushTime" bigint DEFAULT 0,
	CONSTRAINT "reward_item_control_PRIMARY" PRIMARY KEY("uid","itemId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log" (
	"uid" varchar(255) NOT NULL,
	"rewardid" varchar(255) NOT NULL,
	"nownum" integer DEFAULT 0,
	"totalnum" bigint DEFAULT 0,
	CONSTRAINT "reward_log_PRIMARY" PRIMARY KEY("uid","rewardid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_0" (
	"uid" varchar(255) NOT NULL,
	"rewardid" varchar(255) NOT NULL,
	"nownum" integer DEFAULT 0,
	"totalnum" bigint DEFAULT 0,
	CONSTRAINT "reward_log_0_PRIMARY" PRIMARY KEY("uid","rewardid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_1" (
	"uid" varchar(255) NOT NULL,
	"rewardid" varchar(255) NOT NULL,
	"nownum" integer DEFAULT 0,
	"totalnum" bigint DEFAULT 0,
	CONSTRAINT "reward_log_1_PRIMARY" PRIMARY KEY("uid","rewardid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_2" (
	"uid" varchar(255) NOT NULL,
	"rewardid" varchar(255) NOT NULL,
	"nownum" integer DEFAULT 0,
	"totalnum" bigint DEFAULT 0,
	CONSTRAINT "reward_log_2_PRIMARY" PRIMARY KEY("uid","rewardid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_3" (
	"uid" varchar(255) NOT NULL,
	"rewardid" varchar(255) NOT NULL,
	"nownum" integer DEFAULT 0,
	"totalnum" bigint DEFAULT 0,
	CONSTRAINT "reward_log_3_PRIMARY" PRIMARY KEY("uid","rewardid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_4" (
	"uid" varchar(255) NOT NULL,
	"rewardid" varchar(255) NOT NULL,
	"nownum" integer DEFAULT 0,
	"totalnum" bigint DEFAULT 0,
	CONSTRAINT "reward_log_4_PRIMARY" PRIMARY KEY("uid","rewardid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_5" (
	"uid" varchar(255) NOT NULL,
	"rewardid" varchar(255) NOT NULL,
	"nownum" integer DEFAULT 0,
	"totalnum" bigint DEFAULT 0,
	CONSTRAINT "reward_log_5_PRIMARY" PRIMARY KEY("uid","rewardid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_6" (
	"uid" varchar(255) NOT NULL,
	"rewardid" varchar(255) NOT NULL,
	"nownum" integer DEFAULT 0,
	"totalnum" bigint DEFAULT 0,
	CONSTRAINT "reward_log_6_PRIMARY" PRIMARY KEY("uid","rewardid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_7" (
	"uid" varchar(255) NOT NULL,
	"rewardid" varchar(255) NOT NULL,
	"nownum" integer DEFAULT 0,
	"totalnum" bigint DEFAULT 0,
	CONSTRAINT "reward_log_7_PRIMARY" PRIMARY KEY("uid","rewardid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_8" (
	"uid" varchar(255) NOT NULL,
	"rewardid" varchar(255) NOT NULL,
	"nownum" integer DEFAULT 0,
	"totalnum" bigint DEFAULT 0,
	CONSTRAINT "reward_log_8_PRIMARY" PRIMARY KEY("uid","rewardid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_9" (
	"uid" varchar(255) NOT NULL,
	"rewardid" varchar(255) NOT NULL,
	"nownum" integer DEFAULT 0,
	"totalnum" bigint DEFAULT 0,
	CONSTRAINT "reward_log_9_PRIMARY" PRIMARY KEY("uid","rewardid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."rob_general" (
	"uid" varchar(96),
	"serverid" integer,
	"allianceid" varchar(96),
	"alliancename" varchar(255),
	"owneruid" varchar(96) DEFAULT '' NOT NULL,
	"ownername" varchar(255),
	"generalid" integer DEFAULT 0 NOT NULL,
	"robtime" bigint,
	"freetime" bigint,
	"optime" varchar(200),
	CONSTRAINT "rob_general_PRIMARY" PRIMARY KEY("owneruid","generalid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."role_permission" (
	"role_id" integer NOT NULL,
	"module_permission" varchar(255) NOT NULL,
	"route_permission" varchar(1000),
	"method_permission" varchar(1000),
	CONSTRAINT "role_permission_PRIMARY" PRIMARY KEY("role_id","module_permission")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."roles" (
	"role_id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."roles_role_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"role_name" varchar(50),
	"role_flag" varchar(50),
	CONSTRAINT "roles_PRIMARY" PRIMARY KEY("role_id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."routes" (
	"route_id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."routes_route_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"module_id" integer,
	"route_name" varchar(50),
	"route_path" varchar(100),
	"log_tag" smallint DEFAULT 0,
	"prt_id" integer,
	"order_num" varchar(12),
	"pinyin" varchar(100),
	"isProd" smallint DEFAULT 1,
	"type" varchar(6) DEFAULT 'other',
	CONSTRAINT "routes_PRIMARY" PRIMARY KEY("route_id"),
	CONSTRAINT "routes_log_tag_range" CHECK ("log_tag" BETWEEN -128 AND 127),
	CONSTRAINT "routes_isProd_range" CHECK ("isProd" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."saga_tower_science" (
	"uid" varchar(32) NOT NULL,
	"itemid" integer NOT NULL,
	"level" integer,
	"cdtime" bigint,
	"reserve" integer,
	CONSTRAINT "saga_tower_science_PRIMARY" PRIMARY KEY("uid","itemid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."sampleuser" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"regTime" bigint NOT NULL,
	"tag" integer NOT NULL,
	CONSTRAINT "sampleuser_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."score_act" (
	"uid" varchar(255) NOT NULL,
	"actId" varchar(40) NOT NULL,
	"level" integer,
	"score" integer DEFAULT 0 NOT NULL,
	"finishFlag" integer DEFAULT 0,
	"rewardFlag" varchar(255),
	CONSTRAINT "score_act_PRIMARY" PRIMARY KEY("uid","actId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."score_act_in" (
	"uid" varchar(255) NOT NULL,
	"allianceId" varchar(255) NOT NULL,
	"actId" varchar(255) NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "score_act_in_PRIMARY" PRIMARY KEY("uid","allianceId","actId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."score_act_record" (
	"uid" varchar(255) NOT NULL,
	"actId" varchar(40) NOT NULL,
	"level" integer,
	"score" integer DEFAULT 0 NOT NULL,
	"finishFlag" integer DEFAULT 0,
	"rewardFlag" varchar(255),
	CONSTRAINT "score_act_record_PRIMARY" PRIMARY KEY("uid","actId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_activity" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"id" integer NOT NULL,
	"startTime" bigint,
	"endTime" bigint,
	"rewad" integer DEFAULT 0,
	"events" varchar(500),
	CONSTRAINT "server_activity_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_announce" (
	"serverId" varchar(255) NOT NULL,
	"randomGeneral" "bytea",
	"lastMoniterPushTime" bigint,
	CONSTRAINT "server_announce_PRIMARY" PRIMARY KEY("serverId"),
	CONSTRAINT "server_announce_randomGeneral_length" CHECK (octet_length("randomGeneral") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_config" (
	"uid" varchar(255) NOT NULL,
	"stat" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "server_config_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_history_top_score" (
	"uid" varchar(40) NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL,
	"score" double precision DEFAULT 0,
	"rank" integer DEFAULT 0,
	"name" varchar(40),
	"allianceAbbr" varchar(40),
	"allianceIcon" varchar(40),
	CONSTRAINT "server_history_top_score_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_info" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"activityTime" bigint,
	"activationTime" bigint DEFAULT 0,
	"kaifu" bigint DEFAULT 0,
	"yangfu" bigint DEFAULT 0,
	"daoliangStart" bigint DEFAULT 0,
	"daoliangEnd" bigint DEFAULT 0,
	"shuaguaiActStart" bigint DEFAULT 0,
	"lastMergeMillis" bigint DEFAULT 0,
	"thronePic" varchar(40),
	"payTotalTime" bigint DEFAULT 0,
	"crossFightServerId" integer,
	"worldCount" integer DEFAULT 1,
	"mergeTiredRushBeginTime" bigint DEFAULT 0 NOT NULL,
	"resGoldAddEndTime" bigint DEFAULT 0,
	"lastClearMilitaryMailSendTime" bigint DEFAULT 0,
	CONSTRAINT "server_info_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_info_copy" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"activityTime" bigint,
	"activationTime" bigint DEFAULT 0,
	"kaifu" bigint DEFAULT 0,
	"yangfu" bigint DEFAULT 0,
	"daoliangStart" bigint DEFAULT 0,
	"daoliangEnd" bigint DEFAULT 0,
	"shuaguaiActStart" bigint DEFAULT 0,
	"lastMergeMillis" bigint DEFAULT 0,
	"thronePic" varchar(40),
	"payTotalTime" bigint DEFAULT 0,
	"crossFightServerId" integer,
	"worldCount" integer DEFAULT 1,
	"mergeTiredRushBeginTime" bigint DEFAULT 0 NOT NULL,
	"resGoldAddEndTime" bigint DEFAULT 0,
	"lastClearMilitaryMailSendTime" bigint DEFAULT 0,
	CONSTRAINT "server_info_copy_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_mail_record" (
	"uid" varchar(40) NOT NULL,
	"record" varchar(40) NOT NULL,
	"state" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_merge_task" (
	"id" varchar(40) NOT NULL,
	"src_server" varchar(255) DEFAULT '' NOT NULL,
	"dst_server" varchar(255) DEFAULT '' NOT NULL,
	"merge_reason" text NOT NULL,
	"apply_time" bigint DEFAULT 0 NOT NULL,
	"merge_time" bigint DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "server_merge_task_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_push" (
	"uid" varchar(40) NOT NULL,
	"type" integer DEFAULT 0,
	"mailType" integer DEFAULT 0,
	"startTime" bigint,
	"endTime" bigint,
	"regStartTime" bigint,
	"regEndTime" bigint,
	"lastOnlineTimeBegin" bigint,
	"lastOnlineTime" bigint,
	"levelMin" integer,
	"levelMax" integer,
	"title" "bytea",
	"contents" "bytea",
	"reward" "bytea",
	"updateVersion" varchar(40),
	"state" integer,
	"parse" integer,
	"notification" "bytea",
	"reply" integer,
	"likeStatus" integer,
	"confirm" integer DEFAULT 0,
	"platform" varchar(40),
	"itemIdFlag" integer DEFAULT 0,
	"activityId" varchar(64),
	"countries" varchar(256),
	"deviceLimit" integer,
	"CDKeySeries" integer,
	"bind" integer DEFAULT 0,
	"bLvMin" integer DEFAULT 0,
	"bLvMax" integer DEFAULT 0,
	"HDflag" integer DEFAULT 0,
	"mbLevel" integer DEFAULT 0,
	"setReceiveTime" integer DEFAULT 0,
	"tag" varchar(100),
	CONSTRAINT "server_push_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "server_push_title_length" CHECK (octet_length("title") <= 65535),
	CONSTRAINT "server_push_contents_length" CHECK (octet_length("contents") <= 16777215),
	CONSTRAINT "server_push_reward_length" CHECK (octet_length("reward") <= 65535),
	CONSTRAINT "server_push_notification_length" CHECK (octet_length("notification") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_push_20141106" (
	"uid" varchar(40) NOT NULL,
	"type" integer DEFAULT 0,
	"mailType" integer DEFAULT 0,
	"startTime" bigint,
	"endTime" bigint,
	"regStartTime" bigint,
	"regEndTime" bigint,
	"lastOnlineTime" bigint,
	"levelMin" integer,
	"levelMax" integer,
	"title" "bytea",
	"contents" "bytea",
	"reward" "bytea",
	"updateVersion" varchar(40),
	"state" integer,
	"parse" integer,
	"notification" varchar(128),
	"reply" integer,
	CONSTRAINT "server_push_20141106_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "server_push_20141106_title_length" CHECK (octet_length("title") <= 65535),
	CONSTRAINT "server_push_20141106_contents_length" CHECK (octet_length("contents") <= 65535),
	CONSTRAINT "server_push_20141106_reward_length" CHECK (octet_length("reward") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_push_config" (
	"uid" varchar(40) NOT NULL,
	"type" integer DEFAULT 0,
	"startTime" bigint,
	"contents" "bytea",
	"state" integer,
	CONSTRAINT "server_push_config_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "server_push_config_contents_length" CHECK (octet_length("contents") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_score" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"id" integer NOT NULL,
	"activity" varchar(40),
	"readyTime" bigint,
	"beginTime" bigint,
	"endTime" bigint,
	"rewad" integer DEFAULT 0,
	"round" integer DEFAULT 1,
	CONSTRAINT "server_score_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_top_score" (
	"uid" varchar(40) NOT NULL,
	"actId" varchar(40) NOT NULL,
	"round" integer DEFAULT 0,
	"score" integer DEFAULT 0,
	"rank" integer DEFAULT 0,
	"name" varchar(40),
	"allianceAbbr" varchar(40),
	"allianceIcon" varchar(40),
	CONSTRAINT "server_top_score_PRIMARY" PRIMARY KEY("uid","actId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_transfer" (
	"uid" varchar(255) NOT NULL,
	"cdTime" bigint,
	"transferTime" bigint,
	"times" integer,
	"beforeServers" varchar(255) DEFAULT '',
	CONSTRAINT "server_transfer_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_update" (
	"uid" varchar(255) NOT NULL,
	"idx" integer NOT NULL,
	"content" "bytea",
	"chineseContent" "bytea",
	"endTime" bigint DEFAULT 0,
	CONSTRAINT "server_update_PRIMARY" PRIMARY KEY("uid","idx"),
	CONSTRAINT "server_update_content_length" CHECK (octet_length("content") <= 65535),
	CONSTRAINT "server_update_chineseContent_length" CHECK (octet_length("chineseContent") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_update_suggestion" (
	"uid" varchar(255) NOT NULL,
	"updateId" varchar(255) NOT NULL,
	"idx" integer NOT NULL,
	"suggestion" "bytea",
	"real_uid" varchar(255),
	"server" integer,
	"real_name" varchar(255),
	"reward_status" integer DEFAULT 0,
	"createTime" bigint DEFAULT 0,
	CONSTRAINT "server_update_suggestion_PRIMARY" PRIMARY KEY("uid","updateId","idx"),
	CONSTRAINT "server_update_suggestion_suggestion_length" CHECK (octet_length("suggestion") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_usermail" (
	"uid" varchar(40) NOT NULL,
	"toUser" varchar(40) NOT NULL,
	"sendBy" varchar(40) NOT NULL,
	"sendTime" bigint NOT NULL,
	"title" varchar(40),
	"contents" "bytea",
	"reward" "bytea",
	"rewardStatus" integer,
	CONSTRAINT "server_usermail_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "server_usermail_contents_length" CHECK (octet_length("contents") <= 65535),
	CONSTRAINT "server_usermail_reward_length" CHECK (octet_length("reward") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."shopping_mall" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"id" varchar(40) NOT NULL,
	"buyDaily" integer DEFAULT 0,
	"buyTime" bigint DEFAULT 0,
	"buyTotal" integer DEFAULT 0,
	"flushTotalTime" bigint DEFAULT 0,
	CONSTRAINT "shopping_mall_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."sign_in" (
	"uid" varchar(255) NOT NULL,
	"day" integer DEFAULT 0,
	"signInTime" bigint DEFAULT 0,
	CONSTRAINT "sign_in_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."sign_in_feed" (
	"uid" varchar(255) NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"feed" varchar(40) NOT NULL,
	"time" bigint DEFAULT 0,
	CONSTRAINT "sign_in_feed_PRIMARY" PRIMARY KEY("uid","type","feed")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."soccer_match" (
	"id" varchar(255) NOT NULL,
	"vs" varchar(100),
	"idx" integer,
	"winner" varchar(100),
	"startBetTime" bigint,
	"startTime" bigint,
	"ended" integer,
	"betNumA" bigint,
	"betNumB" bigint,
	"oddsA" numeric(20, 2),
	"oddsB" numeric(20, 2),
	CONSTRAINT "soccer_match_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."staff" (
	"id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "staff_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_adjust" (
	"uid" varchar(40) NOT NULL,
	"device" varchar(10),
	"country" varchar(20),
	"channel" varchar(50),
	"campain" varchar(100),
	"fulldata" "bytea",
	CONSTRAINT "stat_adjust_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "stat_adjust_fulldata_length" CHECK (octet_length("fulldata") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_af" (
	"uid" varchar(40) NOT NULL,
	"afuid" varchar(200),
	"device" varchar(10),
	"country" varchar(20),
	"channel" varchar(50),
	"campain" varchar(100),
	"fulldata" "bytea",
	CONSTRAINT "stat_af_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "stat_af_fulldata_length" CHECK (octet_length("fulldata") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_date" (
	"date" text NOT NULL,
	"dau" integer DEFAULT 0 NOT NULL,
	"pay" numeric(12, 2) DEFAULT 0.00 NOT NULL,
	"reg" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "stat_date_PRIMARY" PRIMARY KEY("date"),
	CONSTRAINT "stat_date_date_temporal" CHECK (("date" IS NULL OR (CASE WHEN "date" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01])$' THEN CASE WHEN left("date",4) <> '0000' AND substring("date",6,2) <> '00' AND substring("date",9,2) <> '00' THEN to_char(to_date(left("date",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("date",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"disconnect" bigint DEFAULT 0,
	"ip" varchar(20),
	"level" integer,
	"castlelevel" integer,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"deviceId" varchar(255),
	"regTime" bigint DEFAULT 0 NOT NULL,
	"pf" varchar(20),
	"country" varchar(10),
	"trulyip" varchar(20),
	"linkname" varchar(40),
	"curpf" varchar(20),
	"curcountry" varchar(10),
	"curgaid" varchar(40),
	"curdeviceid" varchar(255),
	"appversion" varchar(40),
	"curip" varchar(20),
	CONSTRAINT "stat_login_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login2" (
	"uid" varchar(40) NOT NULL,
	CONSTRAINT "stat_login2_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_0" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"disconnect" bigint DEFAULT 0,
	"ip" varchar(20),
	"level" integer,
	"castlelevel" integer,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"deviceId" varchar(255),
	"regTime" bigint DEFAULT 0 NOT NULL,
	"pf" varchar(20),
	"country" varchar(10),
	"trulyip" varchar(20),
	"linkname" varchar(40),
	"curpf" varchar(20),
	"curcountry" varchar(10),
	"curgaid" varchar(40),
	"curdeviceid" varchar(255),
	"appversion" varchar(40),
	"curip" varchar(20),
	CONSTRAINT "stat_login_2024_0_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_1" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"disconnect" bigint DEFAULT 0,
	"ip" varchar(20),
	"level" integer,
	"castlelevel" integer,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"deviceId" varchar(255),
	"regTime" bigint DEFAULT 0 NOT NULL,
	"pf" varchar(20),
	"country" varchar(10),
	"trulyip" varchar(20),
	"linkname" varchar(40),
	"curpf" varchar(20),
	"curcountry" varchar(10),
	"curgaid" varchar(40),
	"curdeviceid" varchar(255),
	"appversion" varchar(40),
	"curip" varchar(20),
	CONSTRAINT "stat_login_2024_1_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_10" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"disconnect" bigint DEFAULT 0,
	"ip" varchar(20),
	"level" integer,
	"castlelevel" integer,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"deviceId" varchar(255),
	"regTime" bigint DEFAULT 0 NOT NULL,
	"pf" varchar(20),
	"country" varchar(10),
	"trulyip" varchar(20),
	"linkname" varchar(40),
	"curpf" varchar(20),
	"curcountry" varchar(10),
	"curgaid" varchar(40),
	"curdeviceid" varchar(255),
	"appversion" varchar(40),
	"curip" varchar(20),
	CONSTRAINT "stat_login_2024_10_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_11" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"disconnect" bigint DEFAULT 0,
	"ip" varchar(20),
	"level" integer,
	"castlelevel" integer,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"deviceId" varchar(255),
	"regTime" bigint DEFAULT 0 NOT NULL,
	"pf" varchar(20),
	"country" varchar(10),
	"trulyip" varchar(20),
	"linkname" varchar(40),
	"curpf" varchar(20),
	"curcountry" varchar(10),
	"curgaid" varchar(40),
	"curdeviceid" varchar(255),
	"appversion" varchar(40),
	"curip" varchar(20),
	CONSTRAINT "stat_login_2024_11_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_2" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"disconnect" bigint DEFAULT 0,
	"ip" varchar(20),
	"level" integer,
	"castlelevel" integer,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"deviceId" varchar(255),
	"regTime" bigint DEFAULT 0 NOT NULL,
	"pf" varchar(20),
	"country" varchar(10),
	"trulyip" varchar(20),
	"linkname" varchar(40),
	"curpf" varchar(20),
	"curcountry" varchar(10),
	"curgaid" varchar(40),
	"curdeviceid" varchar(255),
	"appversion" varchar(40),
	"curip" varchar(20),
	CONSTRAINT "stat_login_2024_2_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_3" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"disconnect" bigint DEFAULT 0,
	"ip" varchar(20),
	"level" integer,
	"castlelevel" integer,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"deviceId" varchar(255),
	"regTime" bigint DEFAULT 0 NOT NULL,
	"pf" varchar(20),
	"country" varchar(10),
	"trulyip" varchar(20),
	"linkname" varchar(40),
	"curpf" varchar(20),
	"curcountry" varchar(10),
	"curgaid" varchar(40),
	"curdeviceid" varchar(255),
	"appversion" varchar(40),
	"curip" varchar(20),
	CONSTRAINT "stat_login_2024_3_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_4" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"disconnect" bigint DEFAULT 0,
	"ip" varchar(20),
	"level" integer,
	"castlelevel" integer,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"deviceId" varchar(255),
	"regTime" bigint DEFAULT 0 NOT NULL,
	"pf" varchar(20),
	"country" varchar(10),
	"trulyip" varchar(20),
	"linkname" varchar(40),
	"curpf" varchar(20),
	"curcountry" varchar(10),
	"curgaid" varchar(40),
	"curdeviceid" varchar(255),
	"appversion" varchar(40),
	"curip" varchar(20),
	CONSTRAINT "stat_login_2024_4_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_5" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"disconnect" bigint DEFAULT 0,
	"ip" varchar(20),
	"level" integer,
	"castlelevel" integer,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"deviceId" varchar(255),
	"regTime" bigint DEFAULT 0 NOT NULL,
	"pf" varchar(20),
	"country" varchar(10),
	"trulyip" varchar(20),
	"linkname" varchar(40),
	"curpf" varchar(20),
	"curcountry" varchar(10),
	"curgaid" varchar(40),
	"curdeviceid" varchar(255),
	"appversion" varchar(40),
	"curip" varchar(20),
	CONSTRAINT "stat_login_2024_5_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_6" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"disconnect" bigint DEFAULT 0,
	"ip" varchar(20),
	"level" integer,
	"castlelevel" integer,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"deviceId" varchar(255),
	"regTime" bigint DEFAULT 0 NOT NULL,
	"pf" varchar(20),
	"country" varchar(10),
	"trulyip" varchar(20),
	"linkname" varchar(40),
	"curpf" varchar(20),
	"curcountry" varchar(10),
	"curgaid" varchar(40),
	"curdeviceid" varchar(255),
	"appversion" varchar(40),
	"curip" varchar(20),
	CONSTRAINT "stat_login_2024_6_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_7" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"disconnect" bigint DEFAULT 0,
	"ip" varchar(20),
	"level" integer,
	"castlelevel" integer,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"deviceId" varchar(255),
	"regTime" bigint DEFAULT 0 NOT NULL,
	"pf" varchar(20),
	"country" varchar(10),
	"trulyip" varchar(20),
	"linkname" varchar(40),
	"curpf" varchar(20),
	"curcountry" varchar(10),
	"curgaid" varchar(40),
	"curdeviceid" varchar(255),
	"appversion" varchar(40),
	"curip" varchar(20),
	CONSTRAINT "stat_login_2024_7_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_8" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"disconnect" bigint DEFAULT 0,
	"ip" varchar(20),
	"level" integer,
	"castlelevel" integer,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"deviceId" varchar(255),
	"regTime" bigint DEFAULT 0 NOT NULL,
	"pf" varchar(20),
	"country" varchar(10),
	"trulyip" varchar(20),
	"linkname" varchar(40),
	"curpf" varchar(20),
	"curcountry" varchar(10),
	"curgaid" varchar(40),
	"curdeviceid" varchar(255),
	"appversion" varchar(40),
	"curip" varchar(20),
	CONSTRAINT "stat_login_2024_8_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_9" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"disconnect" bigint DEFAULT 0,
	"ip" varchar(20),
	"level" integer,
	"castlelevel" integer,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"deviceId" varchar(255),
	"regTime" bigint DEFAULT 0 NOT NULL,
	"pf" varchar(20),
	"country" varchar(10),
	"trulyip" varchar(20),
	"linkname" varchar(40),
	"curpf" varchar(20),
	"curcountry" varchar(10),
	"curgaid" varchar(40),
	"curdeviceid" varchar(255),
	"appversion" varchar(40),
	"curip" varchar(20),
	CONSTRAINT "stat_login_2024_9_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2026_9" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"disconnect" bigint DEFAULT 0,
	"ip" varchar(20),
	"level" integer,
	"castlelevel" integer,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"deviceId" varchar(255),
	"regTime" bigint DEFAULT 0 NOT NULL,
	"pf" varchar(20),
	"country" varchar(10),
	"trulyip" varchar(20),
	"linkname" varchar(40),
	"curpf" varchar(20),
	"curcountry" varchar(10),
	"curgaid" varchar(40),
	"curdeviceid" varchar(255),
	"appversion" varchar(40),
	"curip" varchar(20),
	CONSTRAINT "stat_login_2026_9_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_phone" (
	"uid" varchar(255) NOT NULL,
	"model" varchar(255),
	"version" varchar(255),
	"width" integer,
	"height" integer,
	CONSTRAINT "stat_phone_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_phone_log" (
	"uid" varchar(40) NOT NULL,
	"phoneDevice" varchar(255) NOT NULL,
	"model" varchar(255) NOT NULL,
	"version" varchar(255) NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"count" integer,
	"time" bigint,
	CONSTRAINT "stat_phone_log_PRIMARY" PRIMARY KEY("uid","phoneDevice","model","version","width","height")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_reg" (
	"uid" varchar(40) NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"time" bigint NOT NULL,
	"pf" varchar(20),
	"pfId" varchar(200),
	"referrer" "bytea",
	"country" varchar(10),
	"ip" varchar(20),
	"ipcountry" varchar(10),
	"linkname" varchar(40),
	"curip" varchar(20),
	CONSTRAINT "stat_reg_PRIMARY" PRIMARY KEY("uid","type"),
	CONSTRAINT "stat_reg_referrer_length" CHECK (octet_length("referrer") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_tutorial" (
	"uid" varchar(40) NOT NULL,
	"tutorial" bigint NOT NULL,
	"time" bigint,
	CONSTRAINT "stat_tutorial_PRIMARY" PRIMARY KEY("uid","tutorial")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_tutorial_analyze" (
	"uid" varchar(40) NOT NULL,
	"tutorial" bigint NOT NULL,
	"time" bigint,
	CONSTRAINT "stat_tutorial_analyze_PRIMARY" PRIMARY KEY("uid","tutorial")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_tutorial_v2" (
	"uid" varchar(40) NOT NULL,
	"tutorial" bigint NOT NULL,
	"time" bigint,
	"appVersion" varchar(40),
	CONSTRAINT "stat_tutorial_v2_PRIMARY" PRIMARY KEY("uid","tutorial")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."subscription_log" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"orderId" varchar(200) DEFAULT '' NOT NULL,
	"itemId" varchar(10),
	"originalOrderId" varchar(200),
	"beginTime" bigint,
	"endTime" bigint,
	"nextCheckTime" bigint,
	CONSTRAINT "subscription_log_PRIMARY" PRIMARY KEY("uid","orderId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."suggest_log" (
	"uuid" varchar(50) NOT NULL,
	"user" varchar(200) NOT NULL,
	"timeStamp" bigint NOT NULL,
	"description" "bytea",
	"param1" integer,
	"param2" varchar(255),
	CONSTRAINT "suggest_log_PRIMARY" PRIMARY KEY("uuid"),
	CONSTRAINT "suggest_log_description_length" CHECK (octet_length("description") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."suggestion" (
	"uid" varchar(40) NOT NULL,
	"ownerId" varchar(40) NOT NULL,
	"castlelevel" integer,
	"contents" "bytea" NOT NULL,
	"createTime" bigint NOT NULL,
	"replyContent" "bytea",
	"replyTime" bigint,
	CONSTRAINT "suggestion_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "suggestion_contents_length" CHECK (octet_length("contents") <= 65535),
	CONSTRAINT "suggestion_replyContent_length" CHECK (octet_length("replyContent") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."suit_create_rate" (
	"uid" varchar(40) NOT NULL,
	"itemId" varchar(40) NOT NULL,
	"rate" integer NOT NULL,
	CONSTRAINT "suit_create_rate_PRIMARY" PRIMARY KEY("uid","itemId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."suit_decompose_effect" (
	"item1" varchar(100),
	"item2" varchar(100) DEFAULT '0',
	"item3" varchar(100) DEFAULT '0',
	"item4" varchar(100) DEFAULT '0',
	"item5" varchar(100) DEFAULT '0',
	"item6" varchar(100) DEFAULT '0',
	"owner" varchar(100) DEFAULT '0' NOT NULL,
	"suitid" varchar(100) DEFAULT '0' NOT NULL,
	CONSTRAINT "suit_decompose_effect_PRIMARY" PRIMARY KEY("owner","suitid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."sumsungactivity" (
	"uid" varchar(70) NOT NULL,
	"deviceID" varchar(100) NOT NULL,
	"time" bigint,
	CONSTRAINT "sumsungactivity_PRIMARY" PRIMARY KEY("uid","deviceID")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."super_army_log" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(255),
	"castleLevel" integer,
	"level" integer,
	"createTime" bigint,
	CONSTRAINT "super_army_log_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."switches" (
	"name" varchar(255) NOT NULL,
	"stat" integer DEFAULT 0,
	"appVersion" varchar(255),
	CONSTRAINT "switches_PRIMARY" PRIMARY KEY("name")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."system_data" (
	"uid" varchar(255) NOT NULL,
	"value" text,
	CONSTRAINT "system_data_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."t_hero" (
	"id" varchar(36) NOT NULL,
	"uid" varchar(32),
	"heroid" integer,
	"level" smallint,
	"exp" integer,
	"events" text,
	"createtime" bigint,
	"state" smallint,
	"skinID" varchar(255) DEFAULT '',
	CONSTRAINT "t_hero_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "t_hero_state_range" CHECK ("state" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."t_worldboss" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."t_worldboss_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 8456 CACHE 1),
	"bossid" integer,
	"level" smallint,
	"type" smallint DEFAULT 0,
	"maxhp" integer,
	"hp" integer,
	"starttime" bigint,
	"endtime" bigint,
	"point" integer,
	"lefttimes" smallint,
	"attackers" integer,
	"attacktimes" integer,
	"attackpower" integer,
	"items" integer,
	"killuser" varchar(32),
	"reward" smallint,
	"firerange" integer,
	"firespeed" integer,
	"status" smallint,
	CONSTRAINT "t_worldboss_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "t_worldboss_type_range" CHECK ("type" BETWEEN -128 AND 127),
	CONSTRAINT "t_worldboss_reward_range" CHECK ("reward" BETWEEN -128 AND 127),
	CONSTRAINT "t_worldboss_status_range" CHECK ("status" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."t_worldbossinfo" (
	"id" varchar(36) NOT NULL,
	"bossid" integer,
	"level" smallint,
	"type" smallint,
	"weeklyresettime" bigint,
	"weeklytimes" smallint,
	"dailyresettime" bigint,
	"dailytimes" smallint,
	CONSTRAINT "t_worldbossinfo_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "t_worldbossinfo_type_range" CHECK ("type" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."t_worldbossrank" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."t_worldbossrank_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1131 CACHE 1),
	"bossid" integer,
	"bosstid" integer,
	"uid" varchar(32),
	"score" integer,
	"reward" smallint,
	"lastscore" integer,
	"lasttime" bigint,
	CONSTRAINT "t_worldbossrank_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "t_worldbossrank_reward_range" CHECK ("reward" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."tavern" (
	"uid" varchar(40) NOT NULL,
	"free" integer NOT NULL,
	"firstFree" integer NOT NULL,
	"firstPay" integer NOT NULL,
	"freeTimes" integer NOT NULL,
	"payTimes" integer NOT NULL,
	"generals" varchar(255),
	"generalId1" varchar(40),
	"generalId2" varchar(40),
	"generalId3" varchar(40),
	"generalId4" varchar(40),
	"generalId5" varchar(40),
	"generalId6" varchar(40),
	"recruit1" integer NOT NULL,
	"recruit2" integer NOT NULL,
	"recruit3" integer NOT NULL,
	"recruit4" integer NOT NULL,
	"recruit5" integer NOT NULL,
	"recruit6" integer NOT NULL,
	"addFreeTime" bigint NOT NULL,
	"resetResult" integer NOT NULL,
	CONSTRAINT "tavern_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."team_atk_time" (
	"uid" varchar(255) NOT NULL,
	"time" bigint DEFAULT 0,
	CONSTRAINT "team_atk_time_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."territory_trap_log" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"allianceid" varchar(40) NOT NULL,
	"logid" integer NOT NULL,
	"param" varchar(100) NOT NULL,
	"createtime" bigint DEFAULT 0,
	"paramname" varchar(60) DEFAULT '',
	CONSTRAINT "territory_trap_log_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."territory_user_effect" (
	"uid" varchar(255) NOT NULL,
	"pointId" integer NOT NULL,
	"allianceId" varchar(255),
	"stat" integer,
	"active" integer,
	CONSTRAINT "territory_user_effect_PRIMARY" PRIMARY KEY("uid","pointId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."time_notice" (
	"timeType" integer NOT NULL,
	"timeVal" bigint,
	CONSTRAINT "time_notice_PRIMARY" PRIMARY KEY("timeType")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."time_reward" (
	"uid" varchar(255) NOT NULL,
	"itemId" varchar(255),
	"rewardId" varchar(255),
	"lastRewardTime" bigint,
	"nextRewardTime" bigint,
	"count" integer,
	CONSTRAINT "time_reward_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."train" (
	"uid" varchar(40) NOT NULL,
	"id" varchar(20) NOT NULL,
	"genUid" varchar(40),
	"finishTrain" bigint NOT NULL,
	"endTime" bigint NOT NULL,
	CONSTRAINT "train_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."translation" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."translation_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"content" "bytea",
	"en" "bytea",
	"originalLang" varchar(255) DEFAULT 'cn',
	CONSTRAINT "translation_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "translation_content_length" CHECK (octet_length("content") <= 65535),
	CONSTRAINT "translation_en_length" CHECK (octet_length("en") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."translation_record" (
	"date" varchar(255) NOT NULL,
	"month" integer,
	"day" integer,
	"num" integer,
	"words" integer,
	"countryCharacters" integer DEFAULT 0,
	"allianceCharacters" integer DEFAULT 0,
	"en" integer DEFAULT 0,
	"zh-Hans" integer DEFAULT 0,
	"zh-Hant" integer DEFAULT 0,
	"ja" integer DEFAULT 0,
	"ko" integer DEFAULT 0,
	"ru" integer DEFAULT 0,
	"es" integer DEFAULT 0,
	"ms" integer DEFAULT 0,
	"fr" integer DEFAULT 0,
	"de" integer DEFAULT 0,
	"it" integer DEFAULT 0,
	"pt" integer DEFAULT 0,
	"other" integer DEFAULT 0,
	"fromDB" integer DEFAULT 0,
	"fromMS" integer DEFAULT 0,
	CONSTRAINT "translation_record_PRIMARY" PRIMARY KEY("date")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."translationv2" (
	"id" varchar(255) NOT NULL,
	"en" "bytea",
	"zh-Hans" "bytea",
	"zh-Hant" "bytea",
	"ja" "bytea",
	"ko" "bytea",
	"ru" "bytea",
	"es" "bytea",
	"ms" "bytea",
	"fr" "bytea",
	"de" "bytea",
	"it" "bytea",
	"pt" "bytea",
	"count" integer DEFAULT 0,
	CONSTRAINT "translationv2_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "translationv2_en_length" CHECK (octet_length("en") <= 65535),
	CONSTRAINT "translationv2_zh-Hans_length" CHECK (octet_length("zh-Hans") <= 65535),
	CONSTRAINT "translationv2_zh-Hant_length" CHECK (octet_length("zh-Hant") <= 65535),
	CONSTRAINT "translationv2_ja_length" CHECK (octet_length("ja") <= 65535),
	CONSTRAINT "translationv2_ko_length" CHECK (octet_length("ko") <= 65535),
	CONSTRAINT "translationv2_ru_length" CHECK (octet_length("ru") <= 65535),
	CONSTRAINT "translationv2_es_length" CHECK (octet_length("es") <= 65535),
	CONSTRAINT "translationv2_ms_length" CHECK (octet_length("ms") <= 65535),
	CONSTRAINT "translationv2_fr_length" CHECK (octet_length("fr") <= 65535),
	CONSTRAINT "translationv2_de_length" CHECK (octet_length("de") <= 65535),
	CONSTRAINT "translationv2_it_length" CHECK (octet_length("it") <= 65535),
	CONSTRAINT "translationv2_pt_length" CHECK (octet_length("pt") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."treasure_map" (
	"uuid" varchar(40) NOT NULL,
	"treasureId" varchar(40),
	"currentOwner" varchar(40),
	"originalOwner" varchar(40),
	"targetId" integer,
	"time" integer,
	"colour" integer,
	"marchId" varchar(40),
	"startTime" bigint,
	"finishTime" bigint,
	"state" integer,
	CONSTRAINT "treasure_map_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."tree_award" (
	"uid" varchar(255) NOT NULL,
	"freeCount" integer NOT NULL,
	"awardCount" integer NOT NULL,
	"lastFreeTime" bigint NOT NULL,
	"lastAwardTime" bigint NOT NULL,
	"awardMaxCount" integer DEFAULT 0,
	CONSTRAINT "tree_award_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."trial_field" (
	"uid" varchar(50) NOT NULL,
	"freeTrial" integer DEFAULT 0,
	"freeFresh" bigint DEFAULT 0,
	"freeAtk" integer DEFAULT 0,
	"monster" varchar(50) DEFAULT '',
	"blood" integer DEFAULT 0,
	"screen" varchar(255) DEFAULT '',
	"buyTrial" integer DEFAULT 0,
	"buyAtk" integer DEFAULT 0,
	"chargeAtkTimes" integer DEFAULT 0,
	"rewardMonster" varchar(50) DEFAULT '',
	CONSTRAINT "trial_field_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."trigger_timmer" (
	"timmer_name" varchar(200) NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"last_exec_millis" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "trigger_timmer_PRIMARY" PRIMARY KEY("timmer_name")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."trigger_var" (
	"type" integer NOT NULL,
	"uid" varchar(50) DEFAULT '''''' NOT NULL,
	"key" varchar(200) NOT NULL,
	"value" text NOT NULL,
	"refreshtime" bigint DEFAULT 0 NOT NULL,
	"createTime" text DEFAULT to_char(statement_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') NOT NULL,
	"lastUpdateTime" text DEFAULT '0000-00-00 00:00:00' NOT NULL,
	CONSTRAINT "trigger_var_PRIMARY" PRIMARY KEY("type","uid","key"),
	CONSTRAINT "trigger_var_createTime_temporal" CHECK (("createTime" IS NULL OR (CASE WHEN "createTime" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("createTime",4) <> '0000' AND substring("createTime",6,2) <> '00' AND substring("createTime",9,2) <> '00' THEN to_char(to_date(left("createTime",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("createTime",10) ELSE true END ELSE false END))),
	CONSTRAINT "trigger_var_lastUpdateTime_temporal" CHECK (("lastUpdateTime" IS NULL OR (CASE WHEN "lastUpdateTime" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("lastUpdateTime",4) <> '0000' AND substring("lastUpdateTime",6,2) <> '00' AND substring("lastUpdateTime",9,2) <> '00' THEN to_char(to_date(left("lastUpdateTime",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("lastUpdateTime",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."trouble_log" (
	"uid" bigint,
	"username" varchar(255),
	"usetime" bigint,
	"statusid" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."turret_shooting_task" (
	"uid" varchar(255) NOT NULL,
	"turretUid" varchar(255),
	"marchUuid" varchar(255),
	"startTime" bigint,
	"endTime" bigint,
	CONSTRAINT "turret_shooting_task_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user" (
	"id" bigint DEFAULT 0 NOT NULL,
	"age" bigint,
	"email" varchar(255),
	"name" varchar(255),
	CONSTRAINT "user_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_14day_login" (
	"uid" varchar(255) NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"day" integer DEFAULT 0,
	"lastRewardTime" bigint DEFAULT 0,
	"vipRewardTime" bigint DEFAULT 0,
	"reward" varchar(255),
	CONSTRAINT "user_14day_login_PRIMARY" PRIMARY KEY("uid","type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_achievement" (
	"uid" varchar(40) NOT NULL,
	"id" varchar(255) NOT NULL,
	"num" bigint DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	"completeTime" bigint DEFAULT 0,
	"rewardTime" bigint,
	CONSTRAINT "user_achievement_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_activation" (
	"uid" varchar(40) NOT NULL,
	"data" "bytea",
	CONSTRAINT "user_activation_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "user_activation_data_length" CHECK (octet_length("data") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_activity" (
	"uid" varchar(255) NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"actId" varchar(255) NOT NULL,
	"status" integer DEFAULT 0 NOT NULL,
	"time" bigint,
	CONSTRAINT "user_activity_PRIMARY" PRIMARY KEY("uid","actId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_activity_new" (
	"uid" varchar(40) NOT NULL,
	"actId" integer NOT NULL,
	"level" integer NOT NULL,
	"rewards" varchar(1000) NOT NULL,
	"updateTime" bigint NOT NULL,
	"reserve_1" integer NOT NULL,
	"reserve_2" varchar(1000) NOT NULL,
	"flushTimes" integer DEFAULT 0,
	"flushDate" bigint DEFAULT 0,
	"receiveLevels" varchar(40) DEFAULT '',
	CONSTRAINT "user_activity_new_PRIMARY" PRIMARY KEY("uid","actId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_alliance_task" (
	"uid" varchar(255) NOT NULL,
	"id" varchar(255) NOT NULL,
	"itemId" varchar(255),
	"num" bigint DEFAULT 0,
	"state" integer DEFAULT 0,
	CONSTRAINT "user_alliance_task_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_arena" (
	"uid" varchar(255),
	"rankScore" integer,
	"state" integer,
	"fightServerId" integer,
	"worldId" integer,
	"version" integer,
	"time" integer,
	"totalWinCount" integer,
	"totalLoseCount" integer,
	"serialWinCount" integer
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_army" (
	"uid" varchar(40) NOT NULL,
	"armyId" varchar(20) NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	"free" integer DEFAULT 0 NOT NULL,
	"pve" integer DEFAULT 0 NOT NULL,
	"march" integer DEFAULT 0 NOT NULL,
	"defence" integer DEFAULT 0 NOT NULL,
	"train" integer DEFAULT 0 NOT NULL,
	"foodCostTime" bigint DEFAULT 0 NOT NULL,
	"finishTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_army_PRIMARY" PRIMARY KEY("uid","armyId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_army_back" (
	"uid" varchar(40) NOT NULL,
	"armyId" varchar(20) NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	"free" integer DEFAULT 0 NOT NULL,
	"pve" integer DEFAULT 0 NOT NULL,
	"march" integer DEFAULT 0 NOT NULL,
	"defence" integer DEFAULT 0 NOT NULL,
	"train" integer DEFAULT 0 NOT NULL,
	"foodCostTime" bigint DEFAULT 0 NOT NULL,
	"finishTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_army_back_PRIMARY" PRIMARY KEY("uid","armyId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_army_bak" (
	"uid" varchar(40) NOT NULL,
	"armyId" varchar(20) NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	"free" integer DEFAULT 0 NOT NULL,
	"pve" integer DEFAULT 0 NOT NULL,
	"march" integer DEFAULT 0 NOT NULL,
	"defence" integer DEFAULT 0 NOT NULL,
	"train" integer DEFAULT 0 NOT NULL,
	"foodCostTime" bigint DEFAULT 0 NOT NULL,
	"finishTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_army_bak_PRIMARY" PRIMARY KEY("uid","armyId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_army_change" (
	"uid" varchar(40) NOT NULL,
	"armyId" varchar(20) NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	"free" integer DEFAULT 0 NOT NULL,
	"pve" integer DEFAULT 0 NOT NULL,
	"march" integer DEFAULT 0 NOT NULL,
	"defence" integer DEFAULT 0 NOT NULL,
	"train" integer DEFAULT 0 NOT NULL,
	"foodCostTime" bigint DEFAULT 0 NOT NULL,
	"finishTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_army_change_PRIMARY" PRIMARY KEY("uid","armyId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_army_cross" (
	"uid" varchar(40) NOT NULL,
	"armyId" varchar(20) NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	"free" integer DEFAULT 0 NOT NULL,
	"pve" integer DEFAULT 0 NOT NULL,
	"march" integer DEFAULT 0 NOT NULL,
	"defence" integer DEFAULT 0 NOT NULL,
	"train" integer DEFAULT 0 NOT NULL,
	"foodCostTime" bigint DEFAULT 0 NOT NULL,
	"finishTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_army_cross_PRIMARY" PRIMARY KEY("uid","armyId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_assets" (
	"uid" varchar(255) NOT NULL,
	"winPoint" bigint DEFAULT 0 NOT NULL,
	"lastUpdateTime" bigint DEFAULT 0,
	"lastprottectTime" bigint DEFAULT 0,
	CONSTRAINT "user_assets_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_auction" (
	"uid" varchar(255) NOT NULL,
	"gold" bigint,
	CONSTRAINT "user_auction_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_auction_goods" (
	"uid" varchar(255) NOT NULL,
	"uuid" varchar(255) NOT NULL,
	"gold" integer,
	CONSTRAINT "user_auction_goods_PRIMARY" PRIMARY KEY("uid","uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_auction_history" (
	"uid" varchar(255) NOT NULL,
	"uuid" varchar(255) NOT NULL,
	"itemId" varchar(20) NOT NULL,
	"itemNum" integer,
	"price" integer,
	"time" bigint NOT NULL,
	CONSTRAINT "user_auction_history_PRIMARY" PRIMARY KEY("uid","uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_auth" (
	"uid" varchar(40) NOT NULL,
	"female" integer,
	"sealId" varchar(40) DEFAULT '',
	"seal" bigint DEFAULT 0,
	CONSTRAINT "user_auth_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance" (
	"uid" varchar(50) NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" bigint DEFAULT 0 NOT NULL,
	"income" bigint DEFAULT 0 NOT NULL,
	"usable_income" bigint DEFAULT 0 NOT NULL,
	"last_income_time" bigint DEFAULT 0 NOT NULL,
	"last_effect_time" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_balance_PRIMARY" PRIMARY KEY("uid","type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_0" (
	"uuid" varchar(50) NOT NULL,
	"uid" varchar(50) NOT NULL,
	"bank_type" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" bigint DEFAULT 0 NOT NULL,
	"original_num" bigint DEFAULT 0 NOT NULL,
	"curr_sum" bigint DEFAULT 0 NOT NULL,
	"curr_charge0" bigint DEFAULT 0 NOT NULL,
	"curr_usable_income" bigint DEFAULT 0 NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_balance_history_0_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_1" (
	"uuid" varchar(50) NOT NULL,
	"uid" varchar(50) NOT NULL,
	"bank_type" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" bigint DEFAULT 0 NOT NULL,
	"original_num" bigint DEFAULT 0 NOT NULL,
	"curr_sum" bigint DEFAULT 0 NOT NULL,
	"curr_charge0" bigint DEFAULT 0 NOT NULL,
	"curr_usable_income" bigint DEFAULT 0 NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_balance_history_1_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_2" (
	"uuid" varchar(50) NOT NULL,
	"uid" varchar(50) NOT NULL,
	"bank_type" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" bigint DEFAULT 0 NOT NULL,
	"original_num" bigint DEFAULT 0 NOT NULL,
	"curr_sum" bigint DEFAULT 0 NOT NULL,
	"curr_charge0" bigint DEFAULT 0 NOT NULL,
	"curr_usable_income" bigint DEFAULT 0 NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_balance_history_2_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_3" (
	"uuid" varchar(50) NOT NULL,
	"uid" varchar(50) NOT NULL,
	"bank_type" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" bigint DEFAULT 0 NOT NULL,
	"original_num" bigint DEFAULT 0 NOT NULL,
	"curr_sum" bigint DEFAULT 0 NOT NULL,
	"curr_charge0" bigint DEFAULT 0 NOT NULL,
	"curr_usable_income" bigint DEFAULT 0 NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_balance_history_3_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_4" (
	"uuid" varchar(50) NOT NULL,
	"uid" varchar(50) NOT NULL,
	"bank_type" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" bigint DEFAULT 0 NOT NULL,
	"original_num" bigint DEFAULT 0 NOT NULL,
	"curr_sum" bigint DEFAULT 0 NOT NULL,
	"curr_charge0" bigint DEFAULT 0 NOT NULL,
	"curr_usable_income" bigint DEFAULT 0 NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_balance_history_4_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_5" (
	"uuid" varchar(50) NOT NULL,
	"uid" varchar(50) NOT NULL,
	"bank_type" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" bigint DEFAULT 0 NOT NULL,
	"original_num" bigint DEFAULT 0 NOT NULL,
	"curr_sum" bigint DEFAULT 0 NOT NULL,
	"curr_charge0" bigint DEFAULT 0 NOT NULL,
	"curr_usable_income" bigint DEFAULT 0 NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_balance_history_5_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_6" (
	"uuid" varchar(50) NOT NULL,
	"uid" varchar(50) NOT NULL,
	"bank_type" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" bigint DEFAULT 0 NOT NULL,
	"original_num" bigint DEFAULT 0 NOT NULL,
	"curr_sum" bigint DEFAULT 0 NOT NULL,
	"curr_charge0" bigint DEFAULT 0 NOT NULL,
	"curr_usable_income" bigint DEFAULT 0 NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_balance_history_6_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_7" (
	"uuid" varchar(50) NOT NULL,
	"uid" varchar(50) NOT NULL,
	"bank_type" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" bigint DEFAULT 0 NOT NULL,
	"original_num" bigint DEFAULT 0 NOT NULL,
	"curr_sum" bigint DEFAULT 0 NOT NULL,
	"curr_charge0" bigint DEFAULT 0 NOT NULL,
	"curr_usable_income" bigint DEFAULT 0 NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_balance_history_7_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_8" (
	"uuid" varchar(50) NOT NULL,
	"uid" varchar(50) NOT NULL,
	"bank_type" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" bigint DEFAULT 0 NOT NULL,
	"original_num" bigint DEFAULT 0 NOT NULL,
	"curr_sum" bigint DEFAULT 0 NOT NULL,
	"curr_charge0" bigint DEFAULT 0 NOT NULL,
	"curr_usable_income" bigint DEFAULT 0 NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_balance_history_8_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_9" (
	"uuid" varchar(50) NOT NULL,
	"uid" varchar(50) NOT NULL,
	"bank_type" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"num" bigint DEFAULT 0 NOT NULL,
	"original_num" bigint DEFAULT 0 NOT NULL,
	"curr_sum" bigint DEFAULT 0 NOT NULL,
	"curr_charge0" bigint DEFAULT 0 NOT NULL,
	"curr_usable_income" bigint DEFAULT 0 NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_balance_history_9_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_bank" (
	"uid" varchar(40) NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	"deposit" text,
	CONSTRAINT "user_bank_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_bet" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(255),
	"matchId" varchar(255),
	"vs" varchar(100),
	"resourceType" integer,
	"betNum" integer,
	"betSide" varchar(50),
	"winner" varchar(50),
	"ended" integer DEFAULT 0,
	"rewarded" integer DEFAULT 0,
	"odds" numeric(10, 2),
	CONSTRAINT "user_bet_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_bottle_info" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"throwRemainCount" integer DEFAULT 0 NOT NULL,
	"pickRemainCount" integer DEFAULT 0 NOT NULL,
	"myBottleNum" integer DEFAULT 0 NOT NULL,
	"lastClearTime" bigint DEFAULT 0 NOT NULL,
	"pickBottlesUidsByteArray" "bytea",
	CONSTRAINT "user_bottle_info_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "user_bottle_info_pickBottlesUidsByteArray_length" CHECK (octet_length("pickBottlesUidsByteArray") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_branch_city_info" (
	"uid" varchar(32) NOT NULL,
	"openstate" smallint NOT NULL,
	"takerewardcount" integer NOT NULL,
	"takerewardtime" bigint,
	CONSTRAINT "user_branch_city_info_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_branch_city_reward" (
	"id" integer DEFAULT 0 NOT NULL,
	"uid" varchar(32) DEFAULT '' NOT NULL,
	"configid" integer NOT NULL,
	"dieawaytime" bigint,
	"rewardrefreashtime" bigint
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_building" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"itemId" integer NOT NULL,
	"pos" integer NOT NULL,
	"level" integer NOT NULL,
	"opType" integer DEFAULT 0,
	"putId" varchar(100),
	"reward" integer DEFAULT 0,
	"refreshTime" bigint,
	"updateTime" bigint DEFAULT 0,
	"effectTime" bigint DEFAULT 0,
	"star" integer DEFAULT 0,
	"progress" integer DEFAULT 0,
	"unlockFlag" integer DEFAULT 0 NOT NULL,
	"costUnlockTimes" integer DEFAULT 0,
	CONSTRAINT "user_building_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_building_bak" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"itemId" integer NOT NULL,
	"pos" integer NOT NULL,
	"level" integer NOT NULL,
	"opType" integer DEFAULT 0,
	"putId" varchar(100),
	"reward" integer DEFAULT 0,
	"refreshTime" bigint,
	"updateTime" bigint DEFAULT 0,
	"effectTime" bigint DEFAULT 0,
	"star" integer DEFAULT 0,
	"progress" integer DEFAULT 0,
	CONSTRAINT "user_building_bak_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_building_exp" (
	"uid" varchar(255) NOT NULL,
	"historyMax" bigint DEFAULT 0,
	"currentMax" bigint DEFAULT 0,
	CONSTRAINT "user_building_exp_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_cemetery" (
	"uid" varchar(255) NOT NULL,
	"deadSum" bigint DEFAULT 0,
	"deadAbilityValue" bigint DEFAULT 0,
	"contributionValue" integer DEFAULT 0 NOT NULL,
	"needContributionValue" integer DEFAULT 0 NOT NULL,
	"contributionStage" integer DEFAULT 0 NOT NULL,
	"useItemSum" integer DEFAULT 0 NOT NULL,
	"pubDeadInfo" varchar(1500) NOT NULL,
	"priDeadInfo" varchar(1500) NOT NULL,
	"reviveAbilityValue" bigint DEFAULT 0,
	"tempReviveInfo" varchar(1500),
	"isPriInfoEmpty" integer DEFAULT 0,
	"reviveSumThisTime" integer DEFAULT 0,
	"freedata" varchar(1500),
	"revived" text,
	CONSTRAINT "user_cemetery_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_cemetery_history" (
	"uid" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"deadSum" bigint NOT NULL,
	"reviveSum" bigint NOT NULL,
	"useItemSum" integer NOT NULL,
	"mainBuildingLevel" integer NOT NULL,
	"rechargeSum" integer NOT NULL,
	CONSTRAINT "user_cemetery_history_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_civilization_prestige" (
	"uid" varchar(40) NOT NULL,
	"civilizationType" integer NOT NULL,
	"prestigeValue" bigint DEFAULT 0,
	"periodicLimitValue" integer DEFAULT 0,
	"updateTime" bigint DEFAULT 0,
	"rewardLv" integer DEFAULT 0,
	"actionLimits" varchar(3000),
	CONSTRAINT "user_civilization_prestige_PRIMARY" PRIMARY KEY("uid","civilizationType")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_civilization_science" (
	"baseItemID" integer NOT NULL,
	"userID" varchar(64) NOT NULL,
	"level" integer,
	CONSTRAINT "user_civilization_science_PRIMARY" PRIMARY KEY("baseItemID","userID")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_collect_record" (
	"uid" varchar(255) NOT NULL,
	"resource" integer DEFAULT 0,
	"killPeople" integer,
	"train" integer,
	"lastKillTime" bigint,
	"sockByResource" integer,
	"sockByKill" integer,
	"sockByTrain" integer,
	CONSTRAINT "user_collect_record_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_comeback_record" (
	"uid" varchar(50) NOT NULL,
	"deviceId" varchar(255),
	"configId" varchar(11) NOT NULL,
	"backType" integer DEFAULT 0 NOT NULL,
	"backTime" bigint DEFAULT 0 NOT NULL,
	"backReward" smallint DEFAULT 0 NOT NULL,
	"dailyReward" varchar(30),
	"payReward" varchar(100),
	"payTotal" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_comeback_record_PRIMARY" PRIMARY KEY("uid","configId"),
	CONSTRAINT "user_comeback_record_backReward_range" CHECK ("backReward" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_continue_pay" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"productId" varchar(40) NOT NULL,
	"goldCount" integer DEFAULT 0,
	"status" integer,
	"updateTime" bigint,
	CONSTRAINT "user_continue_pay_PRIMARY" PRIMARY KEY("uid","productId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_cross_fight_history" (
	"uid" varchar(255) NOT NULL,
	"startTime" bigint NOT NULL,
	"round" integer NOT NULL,
	"score" bigint DEFAULT 0,
	"rank" integer DEFAULT 0,
	"serverId" integer NOT NULL,
	"worldId" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_cross_fight_history_PRIMARY" PRIMARY KEY("uid","startTime","round","worldId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_cross_server" (
	"uid" varchar(255) NOT NULL,
	"fromServerId" integer,
	"time" bigint,
	CONSTRAINT "user_cross_server_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_cross_throne" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."user_cross_throne_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 2347 CACHE 1),
	"uid" varchar(128),
	"totalKills" bigint DEFAULT 0,
	"totalDeads" bigint,
	"kingdomFightIndex" integer,
	"startTime" bigint,
	"name" varchar(128),
	"allianceName" varchar(128),
	"abbr" varchar(128),
	"kingdomName" varchar(128),
	"serverId" integer,
	"deadDetail" varchar(1024),
	"deadDetailBak" varchar(1024),
	"hasCemeteryCollected" bigint DEFAULT 0,
	CONSTRAINT "user_cross_throne_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_daily_task" (
	"uid" varchar(40) NOT NULL,
	"id" varchar(255) NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"times" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_daily_task_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_device_bind_hide" (
	"uid" varchar(40) NOT NULL,
	"hideUid" varchar(40) NOT NULL,
	"time" bigint,
	CONSTRAINT "user_device_bind_hide_PRIMARY" PRIMARY KEY("uid","hideUid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_dragon" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"itemId" integer NOT NULL,
	"level" integer NOT NULL,
	"exp" integer NOT NULL,
	"place" varchar(100),
	CONSTRAINT "user_dragon_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_dragon_battle" (
	"uid" varchar(40) NOT NULL,
	"freeTeleport" integer DEFAULT 0,
	"leaveTime" bigint DEFAULT 0,
	CONSTRAINT "user_dragon_battle_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_egg" (
	"uid" varchar(40) NOT NULL,
	"eggId" varchar(10) NOT NULL,
	"goods" varchar(200) NOT NULL,
	"reward" integer DEFAULT 0,
	CONSTRAINT "user_egg_PRIMARY" PRIMARY KEY("uid","eggId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_equip" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(255) NOT NULL,
	"on" integer DEFAULT 0 NOT NULL,
	"generalid" integer DEFAULT 0,
	"itemId" integer DEFAULT 0 NOT NULL,
	"cost" varchar(255) DEFAULT '',
	"extraProperty" varchar(255) DEFAULT '',
	"refineProperty" varchar(255) DEFAULT '',
	"lockProperty" varchar(255),
	"showSign" integer DEFAULT 1,
	"reforgeCount" integer DEFAULT 0,
	"strengthLevel" integer DEFAULT 0 NOT NULL,
	"crystalCharge" integer DEFAULT 0 NOT NULL,
	"darkCrystalCharge" integer DEFAULT 0 NOT NULL,
	"chargeType" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_equip_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_equip_bak" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(255) NOT NULL,
	"on" integer DEFAULT 0 NOT NULL,
	"itemId" integer DEFAULT 0 NOT NULL,
	"cost" varchar(255) DEFAULT '',
	"extraProperty" varchar(255) DEFAULT '',
	"refineProperty" varchar(255) DEFAULT '',
	CONSTRAINT "user_equip_bak_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_exchange_cycle" (
	"uid" varchar(255) NOT NULL,
	"stage" integer DEFAULT 0,
	"totalstage" integer DEFAULT 0,
	"waittime" bigint DEFAULT 0,
	"totalstage1" integer DEFAULT 0,
	"waittime1" bigint DEFAULT 0,
	"totalstage2" integer DEFAULT 0,
	"waittime2" bigint DEFAULT 0,
	"exchanges" varchar(200),
	"stage1" integer DEFAULT 0,
	"stage2" integer DEFAULT 0,
	"cdtime" bigint DEFAULT -1,
	"cdtime1" bigint DEFAULT -1,
	"cdtime2" bigint DEFAULT -1,
	"receive_reward" varchar(255),
	"receive_reward1" varchar(255),
	"receive_reward2" varchar(255),
	CONSTRAINT "user_exchange_cycle_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_expedition_info" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"recieveResource" bigint DEFAULT 0 NOT NULL,
	"lastClearTime" bigint DEFAULT 0 NOT NULL,
	"isTakeAward1" smallint DEFAULT 0 NOT NULL,
	"isTakeAward2" smallint DEFAULT 0 NOT NULL,
	"isTakeAward3" smallint DEFAULT 0 NOT NULL,
	"takeTime1" bigint DEFAULT 0 NOT NULL,
	"takeTime2" bigint DEFAULT 0 NOT NULL,
	"takeTime3" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_expedition_info_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "user_expedition_info_isTakeAward1_range" CHECK ("isTakeAward1" BETWEEN -128 AND 127),
	CONSTRAINT "user_expedition_info_isTakeAward2_range" CHECK ("isTakeAward2" BETWEEN -128 AND 127),
	CONSTRAINT "user_expedition_info_isTakeAward3_range" CHECK ("isTakeAward3" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_expedition_score" (
	"uid" varchar(255) NOT NULL,
	"score" double precision DEFAULT 0,
	CONSTRAINT "user_expedition_score_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_general" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"generalId" varchar(40) NOT NULL,
	"color" integer,
	"status" integer NOT NULL,
	"level" integer NOT NULL,
	"exp" integer DEFAULT 0,
	"time" bigint DEFAULT 0,
	"ability" "bytea",
	"abilityIndex" integer DEFAULT 1,
	"plusSkillPoint" integer DEFAULT 0,
	CONSTRAINT "user_general_PRIMARY" PRIMARY KEY("uuid"),
	CONSTRAINT "user_general_ability_length" CHECK (octet_length("ability") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_gift" (
	"uuid" varchar(40) NOT NULL,
	"giftId" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"allianceId" varchar(40) NOT NULL,
	"gifttype" integer NOT NULL,
	"valid" integer DEFAULT 1 NOT NULL,
	"level" integer,
	"item" varchar(255),
	"num" integer,
	"para" integer DEFAULT 0,
	"time" bigint NOT NULL,
	"expiretime" integer,
	"exp" integer DEFAULT 0,
	"description" varchar(255),
	CONSTRAINT "user_gift_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_gift_vote" (
	"uid" varchar(50) NOT NULL,
	"version" integer NOT NULL,
	"type" integer NOT NULL,
	"giftId" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "user_gift_vote_PRIMARY" PRIMARY KEY("uid","version","type","giftId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_glory_info" (
	"uid" varchar(40) NOT NULL,
	"strengthenCount" integer NOT NULL,
	"strengthenTime" bigint NOT NULL,
	"expeditionVictoryTimes" integer DEFAULT -1 NOT NULL,
	"weaknessTime" bigint,
	CONSTRAINT "user_glory_info_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_gold_group_buy" (
	"uid" varchar(40) NOT NULL,
	"id" varchar(40) NOT NULL,
	"buy_time" bigint DEFAULT 0 NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"group_coupon_num" integer DEFAULT 0 NOT NULL,
	"isMail" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_gold_group_buy_PRIMARY" PRIMARY KEY("uid","id","buy_time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_gold_wheel" (
	"uid" varchar(50) NOT NULL,
	"hide_king" integer DEFAULT 0 NOT NULL,
	"normal_free" integer DEFAULT 0 NOT NULL,
	"normal_total" integer DEFAULT 0 NOT NULL,
	"normal_last_free_millis" bigint DEFAULT 0 NOT NULL,
	"silver_usable" integer DEFAULT 0 NOT NULL,
	"silver_usable_free" integer DEFAULT 0 NOT NULL,
	"silver_daily" integer DEFAULT 0 NOT NULL,
	"silver_total" integer DEFAULT 0 NOT NULL,
	"silver_last_add_millis" bigint DEFAULT 0 NOT NULL,
	"silver_last_free_millis" bigint DEFAULT 0 NOT NULL,
	"gold_daily" integer DEFAULT 0 NOT NULL,
	"gold_usable" integer DEFAULT 0 NOT NULL,
	"gold_total" integer DEFAULT 0 NOT NULL,
	"gold_last_add_millis" bigint DEFAULT 0 NOT NULL,
	"last_normal_wheel_millis" bigint DEFAULT 0 NOT NULL,
	"rewardFlags" varchar(200),
	CONSTRAINT "user_gold_wheel_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_gold_wheel_histo" (
	"uid" varchar(50) NOT NULL,
	"normal_free" integer DEFAULT 0 NOT NULL,
	"normal_total" integer DEFAULT 0 NOT NULL,
	"silver_usable" integer DEFAULT 0 NOT NULL,
	"silver_usable_free" integer DEFAULT 0 NOT NULL,
	"silver_daily" integer DEFAULT 0 NOT NULL,
	"silver_total" integer DEFAULT 0 NOT NULL,
	"silver_last_add_millis" bigint DEFAULT 0 NOT NULL,
	"gold_daily" integer DEFAULT 0 NOT NULL,
	"gold_usable" integer DEFAULT 0 NOT NULL,
	"gold_total" integer DEFAULT 0 NOT NULL,
	"gold_last_add_millis" bigint DEFAULT 0 NOT NULL,
	"last_normal_wheel_millis" bigint DEFAULT 0 NOT NULL,
	"create_time" text NOT NULL,
	CONSTRAINT "user_gold_wheel_histo_create_time_temporal" CHECK (("create_time" IS NULL OR (CASE WHEN "create_time" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("create_time",4) <> '0000' AND substring("create_time",6,2) <> '00' AND substring("create_time",9,2) <> '00' THEN to_char(to_date(left("create_time",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("create_time",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_grant_title" (
	"uid" varchar(40) NOT NULL,
	"endtime" bigint DEFAULT 0 NOT NULL,
	"targetuid" varchar(40) NOT NULL,
	CONSTRAINT "user_grant_title_PRIMARY" PRIMARY KEY("uid","endtime","targetuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_growth_fund" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"itemId" varchar(40),
	"buyTime" bigint,
	"extra" text,
	"status" integer,
	CONSTRAINT "user_growth_fund_PRIMARY" PRIMARY KEY("uid","type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_hero" (
	"ownerUid" varchar(40) DEFAULT '' NOT NULL,
	"heroUid" varchar(40) NOT NULL,
	"heroState" integer DEFAULT 0 NOT NULL,
	"captureTime" bigint DEFAULT 0 NOT NULL,
	"killTime" bigint DEFAULT 0 NOT NULL,
	"revivalTime" bigint DEFAULT 0 NOT NULL,
	"freeTime" bigint DEFAULT 0 NOT NULL,
	"thrashTime" bigint DEFAULT 0 NOT NULL,
	"thrashNum" integer DEFAULT 0 NOT NULL,
	"captureCD" bigint DEFAULT 0 NOT NULL,
	"killCD" bigint DEFAULT 0 NOT NULL,
	"thrashCD" bigint DEFAULT 0 NOT NULL,
	"revivalCD" bigint DEFAULT 0,
	"lastKillerUid" varchar(40) DEFAULT '',
	CONSTRAINT "user_hero_PRIMARY" PRIMARY KEY("heroUid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_honor" (
	"uid" varchar(40) NOT NULL,
	"id" varchar(50) DEFAULT '' NOT NULL,
	"level" integer,
	CONSTRAINT "user_honor_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_hospital" (
	"uid" varchar(40) NOT NULL,
	"armyId" varchar(20) NOT NULL,
	"dead" integer DEFAULT 0 NOT NULL,
	"heal" integer DEFAULT 0 NOT NULL,
	"finishTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_hospital_PRIMARY" PRIMARY KEY("uid","armyId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_hot_item" (
	"uid" varchar(255) NOT NULL,
	"itemId" varchar(20) NOT NULL,
	"price" integer,
	"num" integer,
	"refreshTime" bigint,
	CONSTRAINT "user_hot_item_PRIMARY" PRIMARY KEY("uid","itemId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_hot_item_best" (
	"uid" varchar(255) NOT NULL,
	"goodsId" varchar(20) NOT NULL,
	"color" integer DEFAULT 0,
	"price_type" integer DEFAULT 0,
	"price" integer DEFAULT 0,
	"price_hot" integer DEFAULT 0,
	CONSTRAINT "user_hot_item_best_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_hot_item_best_v3" (
	"uid" varchar(255) NOT NULL,
	"goodsId" varchar(20) NOT NULL,
	"color" smallint,
	"price_type" integer,
	"price" integer,
	"price_hot" integer,
	CONSTRAINT "user_hot_item_best_v3_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "user_hot_item_best_v3_color_range" CHECK ("color" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_hot_item_v2" (
	"uid" varchar(255) NOT NULL,
	"goodsId" varchar(20) NOT NULL,
	"itemId" varchar(20),
	"priceType" integer,
	"price" integer NOT NULL,
	"price_hot" integer DEFAULT 0,
	"num" integer,
	"refreshTime" bigint,
	"para1" integer DEFAULT 0,
	CONSTRAINT "user_hot_item_v2_PRIMARY" PRIMARY KEY("uid","goodsId","price")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_hot_item_v3" (
	"uid" varchar(255) NOT NULL,
	"goodsId" varchar(20) NOT NULL,
	"itemId" varchar(20) NOT NULL,
	"priceType" integer,
	"price" integer NOT NULL,
	"price_hot" integer,
	"num" integer,
	"refreshTime" bigint,
	"para1" integer,
	"type" smallint,
	CONSTRAINT "user_hot_item_v3_PRIMARY" PRIMARY KEY("uid","goodsId","price"),
	CONSTRAINT "user_hot_item_v3_type_range" CHECK ("type" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_item" (
	"uuid" varchar(40) NOT NULL,
	"ownerId" varchar(255) NOT NULL,
	"itemId" varchar(255) NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"value" integer,
	"vanishTime" bigint DEFAULT 0,
	CONSTRAINT "user_item_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_item_bak" (
	"uuid" varchar(40) NOT NULL,
	"ownerId" varchar(255) NOT NULL,
	"itemId" varchar(255) NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"value" integer,
	"vanishTime" bigint DEFAULT 0,
	CONSTRAINT "user_item_bak_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_item_cd" (
	"uid" varchar(40) NOT NULL,
	"itemId" varchar(255) NOT NULL,
	"useTime" bigint NOT NULL,
	CONSTRAINT "user_item_cd_PRIMARY" PRIMARY KEY("uid","itemId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_king_skill" (
	"uuid" varchar(128) NOT NULL,
	"uid" varchar(128) NOT NULL,
	"skillId" varchar(20) NOT NULL,
	"startTime" bigint,
	"level" integer,
	"endTime" bigint,
	"todayUseTimes" integer DEFAULT 0 NOT NULL,
	"checkDay" bigint DEFAULT 0,
	"hasDonatedMaterial" integer DEFAULT 0 NOT NULL,
	"isSuccessLast" integer DEFAULT 1,
	CONSTRAINT "user_king_skill_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_knight_title" (
	"uid" varchar(255) NOT NULL,
	"activity_title" integer NOT NULL,
	"unlock_title" "bytea",
	"contract_activity_title" integer DEFAULT -1 NOT NULL,
	"contract_unlock_title" "bytea",
	"normal_unlock_title" "bytea",
	"activeshortCut" varchar(255) DEFAULT '' NOT NULL,
	CONSTRAINT "user_knight_title_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "user_knight_title_unlock_title_length" CHECK (octet_length("unlock_title") <= 65535),
	CONSTRAINT "user_knight_title_contract_unlock_title_length" CHECK (octet_length("contract_unlock_title") <= 65535),
	CONSTRAINT "user_knight_title_normal_unlock_title_length" CHECK (octet_length("normal_unlock_title") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_login_ip" (
	"uid" varchar(40) NOT NULL,
	"ip" varchar(40) NOT NULL,
	"count" integer,
	CONSTRAINT "user_login_ip_PRIMARY" PRIMARY KEY("uid","ip")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_lord" (
	"uid" varchar(40) NOT NULL,
	"userSign" varchar(50),
	"medal" varchar(50),
	"levelUp" integer DEFAULT 1,
	"firstJoinAllianceFlag" integer DEFAULT 1,
	"newPlayerAwardSoldierFlag" integer DEFAULT 0,
	"lastPayTime" bigint DEFAULT 0,
	"pveLevel" integer DEFAULT 1,
	"firstBindAccountRewardFlag" integer,
	"dailyTaskFlushTime" bigint DEFAULT 0,
	"dailyTaskComplete" integer DEFAULT 0,
	"isHDLogin" integer DEFAULT 0,
	"freshRecharge" integer DEFAULT 0,
	"freshRechargeTotal" integer DEFAULT 0,
	"barbarionCount" integer DEFAULT 0,
	"lastClearBarbarionTime" bigint DEFAULT 0,
	"newSerCumRechargeTotal" bigint DEFAULT 0 NOT NULL,
	"newDailyTaskFlushTime" bigint DEFAULT 0 NOT NULL,
	"newDailyTaskBoxRewardId" integer DEFAULT 0 NOT NULL,
	"newDailyTaskBoxRewardState" integer DEFAULT 0 NOT NULL,
	"castleLevelUp" integer DEFAULT 0,
	"castleLevelUpStatus" integer DEFAULT 0,
	"remainAttackLeaderBossTime" integer DEFAULT 0,
	"refreshAtkLeaderBossTime" bigint DEFAULT 0,
	CONSTRAINT "user_lord_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_lottery" (
	"uid" varchar(40) NOT NULL,
	"lotteryId" varchar(40) NOT NULL,
	"times" integer,
	"updateTime" bigint,
	CONSTRAINT "user_lottery_PRIMARY" PRIMARY KEY("uid","lotteryId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_luck_draw" (
	"uid" varchar(255) NOT NULL,
	"type" integer NOT NULL,
	"count" integer,
	"upTime" bigint,
	"randTime" bigint,
	"reward" varchar(1000),
	CONSTRAINT "user_luck_draw_PRIMARY" PRIMARY KEY("uid","type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_military" (
	"uid" varchar(255) NOT NULL,
	"score" numeric(11, 2) DEFAULT 0.00,
	"honor" numeric(11, 2) DEFAULT 0.00,
	"exp" integer NOT NULL,
	"level" integer NOT NULL,
	"lastLevel" integer DEFAULT 0,
	"lastScore" numeric(11, 2) DEFAULT 0.00,
	"skillStr" varchar(255) DEFAULT '',
	"lastCashTime" bigint DEFAULT 0 NOT NULL,
	"lastResetTime" bigint DEFAULT 0 NOT NULL,
	"honorThisWeek" numeric(11, 2) DEFAULT 0.00,
	CONSTRAINT "user_military_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_military_rank" (
	"uid" varchar(255) NOT NULL,
	"militaryScore" numeric(11, 2) DEFAULT 0.00,
	"honor" numeric(11, 2) DEFAULT 0.00,
	"rankingExp" integer NOT NULL,
	"militaryRank" integer NOT NULL,
	"award" varchar(500) DEFAULT '' NOT NULL,
	"lastRanking" integer DEFAULT 0,
	"lastMilitaryScore" numeric(11, 2) DEFAULT 0.00,
	"skill" varchar(255) DEFAULT '',
	"status" integer DEFAULT 1 NOT NULL,
	"lastTimeSet0Tostatus" bigint DEFAULT 0 NOT NULL,
	"awardReceived" integer DEFAULT 1 NOT NULL,
	"lastTimeReset" bigint DEFAULT 0 NOT NULL,
	"maxHonorWeekly" numeric(11, 2) DEFAULT 0.00,
	"lastRewardTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_military_rank_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_mine" (
	"uid" varchar(40) NOT NULL,
	"fId" varchar(40) NOT NULL,
	"itemId" integer DEFAULT 0,
	"level" integer,
	"call" integer DEFAULT 0,
	"exp" integer,
	"miner" integer DEFAULT 0,
	"mineTime" bigint,
	"helpInfo" "bytea",
	CONSTRAINT "user_mine_PRIMARY" PRIMARY KEY("uid","fId"),
	CONSTRAINT "user_mine_helpInfo_length" CHECK (octet_length("helpInfo") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_miracle_buff_active" (
	"uid" varchar(255) NOT NULL,
	"level" smallint,
	CONSTRAINT "user_miracle_buff_active_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_mixed_info" (
	"uid" varchar(40) NOT NULL,
	"scoreSwitch" integer DEFAULT 0,
	"daliyFirstLoginTime" bigint DEFAULT 0,
	"continuouslyLoginDay" integer DEFAULT 0,
	"activityPopup" integer DEFAULT 0,
	"popupTime" bigint DEFAULT 0,
	"showEquip" integer DEFAULT 1,
	"materialBackup" integer DEFAULT 1,
	"taskStage" integer DEFAULT 0,
	"scrollEquip" integer DEFAULT 1,
	"colorblind" integer DEFAULT 0,
	"dailyTaskId" varchar(320) DEFAULT '',
	"clientRecord" varchar(4000) DEFAULT '',
	"lastGoldCureTime" bigint DEFAULT 0,
	"npcReward" integer DEFAULT 0,
	"npcClickTime" bigint DEFAULT 0,
	"npcRewardTime" bigint DEFAULT 0,
	"showMedal" integer DEFAULT 1,
	"appointedTime" bigint DEFAULT 0,
	"hasCollected" bigint DEFAULT 0,
	"refine" integer DEFAULT 0,
	"refineTime" bigint DEFAULT 0,
	"sdReward" integer DEFAULT 0,
	"sdClickTime" bigint DEFAULT 0,
	"sdRewardTime" bigint DEFAULT 0,
	"hasSendEnterMsg" integer DEFAULT 0,
	"shieldCdTime" bigint DEFAULT 0,
	"protectEndTime" bigint DEFAULT 0,
	"protectEndSendTimes" bigint DEFAULT 0,
	"skin" varchar(320) DEFAULT '',
	"archeryReward" integer DEFAULT 0,
	"archeryClickTime" bigint DEFAULT 0,
	"archeryRewardTime" bigint DEFAULT 0,
	"marchSoldierShow" integer DEFAULT 0,
	"waterSplashing" integer DEFAULT 0,
	"waterSplashingTime" bigint DEFAULT 0,
	"materialCdNum" integer DEFAULT 0,
	"materialCdTime" bigint DEFAULT 0,
	"superArmyUseTimes" integer DEFAULT 0,
	"superArmyCheckTime" bigint DEFAULT 0,
	"callBackAccount" integer DEFAULT 0,
	"postMail" integer DEFAULT 0,
	"postMailTime" bigint DEFAULT 0,
	"postReward" integer DEFAULT 0,
	"postRewardTime" bigint DEFAULT 0,
	"followFBTime" bigint DEFAULT 0,
	"lastBeDuelTime" bigint DEFAULT 0,
	"lastKillMonsterTime" bigint,
	"todayHasKillMonsterCount" integer,
	"historyHasKillMonsterCount" bigint,
	"shippingTradeInvest" integer DEFAULT 0 NOT NULL,
	"shippingTradeInvestGold" integer DEFAULT 0 NOT NULL,
	"mdata" text NOT NULL,
	"clientSaveFlag" integer DEFAULT 0,
	"plunderResource" integer DEFAULT 0,
	"plunderTime" bigint DEFAULT 0,
	"mirrorFindCount" integer,
	"mirrorTime" bigint,
	"generalRefineCount" integer DEFAULT 0 NOT NULL,
	"generalRefineTime" bigint DEFAULT 0 NOT NULL,
	"showBanner" bigint DEFAULT 0 NOT NULL,
	"newComerWishCount" integer,
	"newComerWishLastTime" bigint,
	"generalFree" bigint DEFAULT 0,
	"payHide" integer DEFAULT 0,
	"costHide" integer DEFAULT 0,
	"prestigeValueLimit" integer DEFAULT 0,
	"prestigeLastTime" bigint DEFAULT 0,
	"civilizationValueLimit" integer DEFAULT 0,
	"civilizationLastTime" bigint DEFAULT 0,
	"heroReward" integer DEFAULT 0,
	"heroRewardTime" bigint DEFAULT 0,
	"grantTitleTimes" integer DEFAULT 0,
	"grantTitleTime" bigint DEFAULT 0,
	"dragonSuperArmyUseTimes" integer DEFAULT 0,
	"expeditionSuperArmyUseTimes" integer DEFAULT 0,
	"neutralSuperArmyUseTimes" integer DEFAULT 0,
	"ancientSuperArmyUseTimes" integer DEFAULT 0,
	CONSTRAINT "user_mixed_info_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_monster_siege" (
	"uid" varchar(40) NOT NULL,
	"failTimes" integer DEFAULT 0,
	"killMonsterCount" bigint DEFAULT 0,
	"state" integer NOT NULL,
	"goalRank" integer DEFAULT 0,
	"failRounds" varchar(100),
	"isfinish" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_monster_siege_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_monster_siege_data" (
	"uid" varchar(40) NOT NULL,
	"failTimes" integer DEFAULT 0,
	"killMonsterCount" bigint DEFAULT 0,
	"state" integer NOT NULL,
	"goalRank" integer DEFAULT 0,
	"failRounds" varchar(100),
	"recordTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_monster_siege_data_PRIMARY" PRIMARY KEY("uid","recordTime")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_monster_siege_history" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"allianceAbbr" varchar(40),
	"allianceName" varchar(40),
	"rank" integer NOT NULL,
	"killCount" bigint DEFAULT 0,
	"failRounds" varchar(100),
	CONSTRAINT "user_monster_siege_history_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_monster_siege_top_history" (
	"uid" varchar(40) NOT NULL,
	"time" bigint NOT NULL,
	"name" varchar(40) NOT NULL,
	"allianceAbbr" varchar(40),
	"allianceName" varchar(40),
	"rank" integer NOT NULL,
	"killCount" bigint DEFAULT 0,
	"failRounds" varchar(100),
	CONSTRAINT "user_monster_siege_top_history_PRIMARY" PRIMARY KEY("uid","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_neutral" (
	"uid" varchar(40) NOT NULL,
	"serverid" integer DEFAULT 0,
	"collectload" integer DEFAULT 0,
	"collecttime" bigint DEFAULT 0,
	"score" double precision DEFAULT 0,
	"leaveTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_neutral_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_new_daily_task" (
	"uid" varchar(40) NOT NULL,
	"id" integer NOT NULL,
	"type" integer NOT NULL,
	"num" integer,
	"state" integer,
	CONSTRAINT "user_new_daily_task_PRIMARY" PRIMARY KEY("uid","id","type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_new_recall_info" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"type" integer,
	"initTime" bigint,
	"country" varchar(40),
	"catsleLv" integer,
	"updateTime" bigint,
	"count" integer,
	"extra" text,
	CONSTRAINT "user_new_recall_info_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_new_recall_task" (
	"uid" varchar(255) NOT NULL,
	"taskId" varchar(255) DEFAULT '' NOT NULL,
	"day" integer,
	"state" integer,
	"targetNum" integer,
	"num" integer,
	"time" bigint,
	"refreshTime" bigint,
	CONSTRAINT "user_new_recall_task_PRIMARY" PRIMARY KEY("uid","taskId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_new_resource_log" (
	"uuid" bigint GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."user_new_resource_log_uuid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 2311 CACHE 1),
	"uid" varchar(40) NOT NULL,
	"actionType" integer NOT NULL,
	"sandstone" bigint DEFAULT 0,
	"diamondstone" bigint DEFAULT 0,
	"marble" bigint DEFAULT 0,
	"granite" bigint DEFAULT 0,
	"limestone" bigint DEFAULT 0,
	"updateTime" bigint,
	CONSTRAINT "user_new_resource_log_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_olympic_bet" (
	"uuid" varchar(40) NOT NULL,
	"uid" varchar(40) NOT NULL,
	"questionId" varchar(40) NOT NULL,
	"resourceType" integer NOT NULL,
	"betNum" integer NOT NULL,
	"betCountry" varchar(10) NOT NULL,
	"result" varchar(10),
	"ended" integer,
	"rewarded" integer,
	"reward" integer,
	CONSTRAINT "user_olympic_bet_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_onekey_reload" (
	"uid" varchar(40) NOT NULL,
	"generalId" varchar(40) NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"equip_list" varchar(2048) DEFAULT '' NOT NULL,
	"talentPoint" integer DEFAULT 0 NOT NULL,
	"talent" varchar(5120) DEFAULT '' NOT NULL,
	"dragon_stone_rhyme" varchar(40) DEFAULT '' NOT NULL,
	CONSTRAINT "user_onekey_reload_PRIMARY" PRIMARY KEY("uid","generalId","type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_onlinereward" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"online" bigint DEFAULT 0,
	"refreshTime" bigint DEFAULT 0,
	"use" bigint DEFAULT 0,
	CONSTRAINT "user_onlinereward_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_pay_lottery" (
	"uid" varchar(40) NOT NULL,
	"totalGold" integer,
	"lastGold" integer,
	"lastLuckyNum" integer,
	"lastBonus" integer,
	"count" integer,
	"lastTime" bigint,
	"shareTime" bigint,
	"luckyNum" integer,
	CONSTRAINT "user_pay_lottery_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_pay_lottery_log" (
	"uid" varchar(40) NOT NULL,
	"userId" varchar(40),
	"name" varchar(40),
	"activityId" varchar(40) NOT NULL,
	"spend" numeric(10, 2),
	"itemId" varchar(10),
	"gold" integer,
	"time" bigint,
	CONSTRAINT "user_pay_lottery_log_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_pay_reward" (
	"uid" varchar(40) NOT NULL,
	"itemId" varchar(40),
	"buyTime" bigint,
	"refreshTime" bigint,
	"time" bigint,
	"extra" varchar(2000),
	CONSTRAINT "user_pay_reward_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_permission" (
	"user_id" integer NOT NULL,
	"module_permission" varchar(255) NOT NULL,
	"route_permission" varchar(1000),
	"method_permission" varchar(1000),
	"type" smallint NOT NULL,
	CONSTRAINT "user_permission_PRIMARY" PRIMARY KEY("user_id","module_permission","type")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_pet_dragon" (
	"uuid" varchar(255) NOT NULL,
	"uid" varchar(255) NOT NULL,
	"itemId" integer NOT NULL,
	"dragonState" smallint DEFAULT 0 NOT NULL,
	"friendly" integer DEFAULT 0,
	"clickBubbleTimesForDay" smallint DEFAULT 0,
	"clickBubbleTotalTimes" integer DEFAULT 0,
	"gainEggTime" bigint DEFAULT 0 NOT NULL,
	"clickEggTime" bigint DEFAULT 0,
	"lastClickBubbleTime" bigint DEFAULT 0,
	"useFlag" smallint DEFAULT 0 NOT NULL,
	"friendShipDecreaseTime" bigint DEFAULT 0,
	"travelData" varchar(2000),
	"communicateData" varchar(500),
	"exp" integer DEFAULT 0,
	"initFriendShipFlag" smallint DEFAULT 0,
	"lastUpLevelTime" bigint DEFAULT 0,
	"lv" smallint DEFAULT 1,
	"nickName" varchar(128),
	CONSTRAINT "user_pet_dragon_PRIMARY" PRIMARY KEY("uuid"),
	CONSTRAINT "user_pet_dragon_dragonState_range" CHECK ("dragonState" BETWEEN -128 AND 127),
	CONSTRAINT "user_pet_dragon_useFlag_range" CHECK ("useFlag" BETWEEN -128 AND 127),
	CONSTRAINT "user_pet_dragon_initFriendShipFlag_range" CHECK ("initFriendShipFlag" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_pet_dragon_skill" (
	"uuid" varchar(32) NOT NULL,
	"uid" varchar(32) NOT NULL,
	"skillId" varchar(20) NOT NULL,
	"level" integer,
	"exp" integer,
	"totalExp" integer,
	"ownerId" integer,
	"index1" integer,
	"strengthenLevel" integer DEFAULT 0,
	CONSTRAINT "user_pet_dragon_skill_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_picture" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"uploadTime" bigint DEFAULT 0,
	"auditPerson" varchar(255) DEFAULT '',
	"note" varchar(255) DEFAULT '',
	"state" integer DEFAULT 0,
	"picVer" integer DEFAULT 0,
	CONSTRAINT "user_picture_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_pray" (
	"uid" varchar(255) NOT NULL,
	"freeFromItem" integer DEFAULT 0,
	"itemPrayCount" integer DEFAULT 0,
	"prayCount" integer DEFAULT 0,
	"lastPrayTime" bigint DEFAULT 0,
	"wood" integer DEFAULT 0,
	"food" integer DEFAULT 0,
	"iron" integer DEFAULT 0,
	"silver" integer DEFAULT 0,
	"steel" integer DEFAULT 0,
	"goldwood" integer DEFAULT 0,
	"goldfood" integer DEFAULT 0,
	"goldiron" integer DEFAULT 0,
	"goldsilver" integer DEFAULT 0,
	"goldsteel" integer DEFAULT 0,
	"isFirstFree" integer DEFAULT 0,
	"isFirstPay" integer DEFAULT 0,
	CONSTRAINT "user_pray_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_push" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"platform" varchar(20),
	"userId" varchar(1000),
	"channelId" varchar(40),
	"active" integer DEFAULT 1,
	CONSTRAINT "user_push_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_recall_task" (
	"uid" varchar(40) NOT NULL,
	"id" varchar(255) NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"target_num" integer DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	"type_level" integer DEFAULT 0 NOT NULL,
	"receive" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_recall_task_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_recall_task_notes" (
	"uid" varchar(40) NOT NULL,
	"version" varchar(255) NOT NULL,
	"receive_mode" integer DEFAULT 0 NOT NULL,
	"refreshTime" bigint DEFAULT 0 NOT NULL,
	"beginTime" bigint DEFAULT 0 NOT NULL,
	"opendTime" bigint DEFAULT 0 NOT NULL,
	"country" varchar(40) DEFAULT '' NOT NULL,
	"endTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_recall_task_notes_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_reg" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"appVersion" varchar(40),
	"deviceId" varchar(255),
	CONSTRAINT "user_reg_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_reg_copy" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"appVersion" varchar(40),
	"deviceId" varchar(255),
	CONSTRAINT "user_reg_copy_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_region_recall" (
	"uid" varchar(32) DEFAULT '' NOT NULL,
	"level" integer,
	"ladder" integer,
	"receivedaynum" integer,
	"receivetime" bigint,
	"begintime" bigint,
	"endtime" bigint,
	"country" varchar(32) DEFAULT '' NOT NULL,
	"reward" varchar(255) DEFAULT '' NOT NULL,
	CONSTRAINT "user_region_recall_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_report" (
	"uid" varchar(40) NOT NULL,
	"target_uid" varchar(40) NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_resource" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"stone" bigint NOT NULL,
	"wood" bigint NOT NULL,
	"iron" bigint NOT NULL,
	"food" bigint NOT NULL,
	"silver" integer NOT NULL,
	"chip" integer NOT NULL,
	"diamond" integer NOT NULL,
	"dragon_food" integer NOT NULL,
	"dragon_gold" integer NOT NULL,
	"lastUpdateTime" bigint NOT NULL,
	"woodbind" bigint DEFAULT 0 NOT NULL,
	"stonebind" bigint DEFAULT 0 NOT NULL,
	"ironbind" bigint DEFAULT 0 NOT NULL,
	"foodbind" bigint DEFAULT 0 NOT NULL,
	"sandstone" integer DEFAULT 0,
	"diamondstone" integer DEFAULT 0,
	"marble" integer DEFAULT 0,
	"granite" integer DEFAULT 0,
	"limestone" integer DEFAULT 0,
	CONSTRAINT "user_resource_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_resource_bak" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"stone" integer NOT NULL,
	"wood" integer NOT NULL,
	"iron" integer NOT NULL,
	"food" integer NOT NULL,
	"silver" integer NOT NULL,
	"chip" integer NOT NULL,
	"diamond" integer NOT NULL,
	"dragon_food" integer NOT NULL,
	"dragon_gold" integer NOT NULL,
	"lastUpdateTime" bigint NOT NULL,
	"woodbind" bigint DEFAULT 0 NOT NULL,
	"stonebind" bigint DEFAULT 0 NOT NULL,
	"ironbind" bigint DEFAULT 0 NOT NULL,
	"foodbind" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_resource_bak_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_resource_bind" (
	"uid" varchar(40) NOT NULL,
	"wood" integer,
	"food" integer,
	"stone" integer,
	"iron" integer,
	"count" integer,
	CONSTRAINT "user_resource_bind_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_resource_copy" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"stone" integer NOT NULL,
	"wood" integer NOT NULL,
	"iron" integer NOT NULL,
	"food" integer NOT NULL,
	"silver" integer NOT NULL,
	"chip" integer NOT NULL,
	"diamond" integer NOT NULL,
	"dragon_food" integer NOT NULL,
	"dragon_gold" integer NOT NULL,
	"lastUpdateTime" bigint NOT NULL,
	CONSTRAINT "user_resource_copy_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_resource_log" (
	"uid" varchar(40) NOT NULL,
	"day" varchar(10) NOT NULL,
	"resourceType" integer NOT NULL,
	"actionType" integer NOT NULL,
	"rewardType" integer NOT NULL,
	"count" bigint DEFAULT 0,
	"times" integer DEFAULT 0,
	"updateTime" bigint,
	CONSTRAINT "user_resource_log_PRIMARY" PRIMARY KEY("uid","day","resourceType","actionType","rewardType")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_resource_record" (
	"uid" varchar(255) NOT NULL,
	"itemId" varchar(255) NOT NULL,
	"wood" bigint,
	"stone" bigint,
	"iron" bigint,
	"food" bigint,
	"wood_bind" bigint,
	"stone_bind" bigint,
	"iron_bind" bigint,
	"food_bind" bigint,
	"costItem" varchar(255),
	CONSTRAINT "user_resource_record_PRIMARY" PRIMARY KEY("uid","itemId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_science" (
	"uid" varchar(40) NOT NULL,
	"itemId" varchar(20) NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	"cd" bigint DEFAULT 9223372036854775807 NOT NULL,
	CONSTRAINT "user_science_PRIMARY" PRIMARY KEY("uid","itemId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_score" (
	"uid" varchar(40) NOT NULL,
	"actId" varchar(40) NOT NULL,
	"round" integer DEFAULT 1,
	"level" integer DEFAULT 1,
	"score" integer DEFAULT 0,
	"reward" integer DEFAULT 0,
	CONSTRAINT "user_score_PRIMARY" PRIMARY KEY("uid","actId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_score_bak" (
	"uid" varchar(40) NOT NULL,
	"actId" varchar(40) NOT NULL,
	"round" integer DEFAULT 1,
	"level" integer DEFAULT 1,
	"score" integer DEFAULT 0,
	"reward" integer DEFAULT 0,
	CONSTRAINT "user_score_bak_PRIMARY" PRIMARY KEY("uid","actId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_single_pay" (
	"uid" varchar(40) NOT NULL,
	"productId" varchar(255) NOT NULL,
	"canRecNum" integer,
	"hasRecNum" integer,
	CONSTRAINT "user_single_pay_PRIMARY" PRIMARY KEY("uid","productId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_skill" (
	"uuid" varchar(40) NOT NULL,
	"ownerId" varchar(40) NOT NULL,
	"skillId" varchar(40) NOT NULL,
	"startTime" bigint DEFAULT 0,
	"actTime" bigint DEFAULT 0,
	"endTime" bigint,
	"stat" integer DEFAULT 0,
	"param1" integer DEFAULT 0,
	"param2" integer DEFAULT 0,
	CONSTRAINT "user_skill_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_snowball" (
	"uid" varchar(255) NOT NULL,
	"curLevel" integer,
	"lastThrowTime" bigint,
	"todayThrowCount" integer,
	"lastBuyTime" bigint DEFAULT 0,
	CONSTRAINT "user_snowball_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_sock" (
	"uid" varchar(255) NOT NULL,
	"socks" bigint DEFAULT 0,
	"reward" "bytea",
	"level" integer DEFAULT 0,
	"refreshtime" bigint,
	CONSTRAINT "user_sock_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "user_sock_reward_length" CHECK (octet_length("reward") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_state" (
	"uid" varchar(255) NOT NULL,
	"stateId" integer NOT NULL,
	"startTime" bigint DEFAULT 0 NOT NULL,
	"endTime" bigint NOT NULL,
	"type" integer DEFAULT 0,
	"type2" integer DEFAULT 0,
	"groupType" integer DEFAULT 0,
	"ranEffId" integer,
	"ranEffValue" integer,
	"property1" varchar(50),
	"property2" varchar(50),
	"count" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "user_state_PRIMARY" PRIMARY KEY("uid","stateId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_story_task" (
	"uid" varchar(40) NOT NULL,
	"id" integer NOT NULL,
	"type" integer NOT NULL,
	"num" integer,
	"state" integer,
	CONSTRAINT "user_story_task_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_talent" (
	"uid" varchar(40) NOT NULL,
	"talent" "bytea",
	CONSTRAINT "user_talent_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "user_talent_talent_length" CHECK (octet_length("talent") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_target_task" (
	"uid" varchar(40) NOT NULL,
	"id" varchar(255) NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"target_num" integer DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	"type_level" integer DEFAULT 0 NOT NULL,
	"rewardDouble" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_target_task_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_target_task_notes" (
	"uid" varchar(40) NOT NULL,
	"version" varchar(255) NOT NULL,
	"receive_mode" integer DEFAULT 0 NOT NULL,
	"refreshTime" bigint DEFAULT 0 NOT NULL,
	"beginTime" bigint DEFAULT 0 NOT NULL,
	"opendTime" bigint DEFAULT 0 NOT NULL,
	"isMail" integer DEFAULT 0 NOT NULL,
	"endTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_target_task_notes_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_task" (
	"uid" varchar(40) NOT NULL,
	"id" varchar(255) NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	"type" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "user_task_PRIMARY" PRIMARY KEY("uid","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_tax" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"wood" bigint NOT NULL,
	"food" bigint NOT NULL,
	"iron" bigint NOT NULL,
	"stone" bigint NOT NULL,
	"silver" bigint NOT NULL,
	CONSTRAINT "user_tax_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_territory_donate_resource" (
	"uid" varchar(255) NOT NULL,
	"allianceId" varchar(255) NOT NULL,
	"stone" bigint NOT NULL,
	"wood" bigint NOT NULL,
	"iron" bigint NOT NULL,
	"food" bigint NOT NULL,
	"sandStone" bigint NOT NULL,
	"diamondStone" bigint NOT NULL,
	"marble" bigint NOT NULL,
	"granite" bigint NOT NULL,
	"limestone" bigint NOT NULL,
	"lastUpdateTime" bigint NOT NULL,
	CONSTRAINT "user_territory_donate_resource_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_territory_resource" (
	"uid" varchar(255) NOT NULL,
	"allianceId" varchar(255),
	"wood" bigint DEFAULT 0,
	"stone" bigint DEFAULT 0,
	"iron" bigint DEFAULT 0,
	"food" bigint DEFAULT 0,
	"silver" bigint DEFAULT 0,
	"lastUpdateTime" bigint DEFAULT 0,
	CONSTRAINT "user_territory_resource_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_thumbup" (
	"uid" varchar(50) NOT NULL,
	"type" integer NOT NULL,
	"para1" varchar(50) NOT NULL,
	"time" bigint,
	CONSTRAINT "user_thumbup_PRIMARY" PRIMARY KEY("uid","type","para1")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_timereward" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"level" integer DEFAULT 0,
	"times" integer DEFAULT 0,
	"refreshTime" bigint DEFAULT 0,
	"receiveTime" bigint DEFAULT 0,
	"rewardInfo" "bytea",
	CONSTRAINT "user_timereward_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "user_timereward_rewardInfo_length" CHECK (octet_length("rewardInfo") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_totem" (
	"uid" varchar(40) NOT NULL,
	"totemId" integer NOT NULL,
	"putTime" bigint,
	CONSTRAINT "user_totem_PRIMARY" PRIMARY KEY("uid","totemId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_true_info_bind" (
	"uid" varchar(40) NOT NULL,
	"phoneNumber" varchar(11),
	"email" varchar(255),
	"phoneReward" integer,
	"emailReward" integer,
	"trueInfo" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_used_item" (
	"uid" varchar(40) NOT NULL,
	"itemId" varchar(40) NOT NULL,
	CONSTRAINT "user_used_item_PRIMARY" PRIMARY KEY("uid","itemId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_vip" (
	"uid" varchar(255) NOT NULL,
	"score" integer NOT NULL,
	"level" integer DEFAULT -1 NOT NULL,
	"loginDays" integer NOT NULL,
	"lastLoginTime" bigint NOT NULL,
	"vipEndTime" bigint NOT NULL,
	"sPoint" integer DEFAULT 0 NOT NULL,
	"sLevel" integer DEFAULT 0 NOT NULL,
	"vip_switch" integer DEFAULT 1 NOT NULL,
	"shop_level" integer DEFAULT 0 NOT NULL,
	"shop_exp" integer DEFAULT 0 NOT NULL,
	"svip_level" smallint,
	CONSTRAINT "user_vip_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "user_vip_svip_level_range" CHECK ("svip_level" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_wall" (
	"uid" varchar(40) NOT NULL,
	"armyId" varchar(20) NOT NULL,
	"num" integer DEFAULT 0 NOT NULL,
	"build" integer DEFAULT 0 NOT NULL,
	"finishTime" bigint DEFAULT 0 NOT NULL,
	"level" integer NOT NULL,
	CONSTRAINT "user_wall_PRIMARY" PRIMARY KEY("uid","armyId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_weakness_building" (
	"uid" varchar(40) NOT NULL,
	"armyId" varchar(20) NOT NULL,
	"weakness" integer DEFAULT 0 NOT NULL,
	"marchWeakness" integer NOT NULL,
	"heal" integer DEFAULT 0 NOT NULL,
	"finishTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "user_weakness_building_PRIMARY" PRIMARY KEY("uid","armyId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_world" (
	"uid" varchar(40) NOT NULL,
	"pointId" integer NOT NULL,
	"worldId" integer DEFAULT 0 NOT NULL,
	"color" integer,
	"monsterLock" "bytea",
	"lastCityDefTime" bigint NOT NULL,
	"attMonsterStamina" integer,
	"lastStaminaTime" bigint,
	"lastMoveCityTime" bigint DEFAULT 0,
	"srcServerPointId" integer,
	"ckfConfirmAccessNextRound" integer,
	"ckfNeedLeave" integer,
	"ckfAccessTimes" integer DEFAULT 0,
	"ckfLastPlayRound" integer,
	"ckfProtectTime" bigint,
	"ckfWinStreak" integer DEFAULT 0,
	"cdfAreaId" integer DEFAULT 0,
	"ckfLeaveABFServerTime" bigint,
	"ckfThroneFightFlag" integer DEFAULT 0,
	"resSearchCount" integer DEFAULT 0,
	"searchFlushTime" bigint DEFAULT 0,
	CONSTRAINT "user_world_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "user_world_monsterLock_length" CHECK (octet_length("monsterLock") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_world_pve" (
	"uid" varchar(40) NOT NULL,
	"pointId" integer NOT NULL,
	"attNum" integer NOT NULL,
	"buyNum" integer,
	"monsterInfo" "bytea",
	CONSTRAINT "user_world_pve_PRIMARY" PRIMARY KEY("uid","pointId"),
	CONSTRAINT "user_world_pve_monsterInfo_length" CHECK (octet_length("monsterInfo") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."username" (
	"uid" varchar(40) NOT NULL,
	"people" integer DEFAULT 0 NOT NULL,
	"refreshTime" bigint NOT NULL,
	"leagueTime" bigint NOT NULL,
	CONSTRAINT "username_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."userprofile" (
	"USN" varchar(11),
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"name" varchar(255) NOT NULL,
	"level" integer NOT NULL,
	"exp" integer NOT NULL,
	"gold" bigint DEFAULT 0 NOT NULL,
	"paidGold" bigint DEFAULT 0,
	"csmodBalance" bigint DEFAULT 0 NOT NULL,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"parseRegisterId" varchar(255),
	"gcmRegisterId" varchar(255),
	"openedPos" varchar(500),
	"pic" varchar(40),
	"picVer" integer DEFAULT 0,
	"country" varchar(40) NOT NULL,
	"allianceId" varchar(40),
	"chNameCount" varchar(255) DEFAULT '0',
	"worldPoint" integer,
	"deviceId" varchar(255),
	"deviceUuid" varchar(200),
	"gaid" varchar(40),
	"platform" varchar(40),
	"pf" varchar(40) DEFAULT 'csmod_games',
	"lang" varchar(40),
	"mt" varchar(255),
	"appVersion" varchar(40),
	"gmFlag" integer DEFAULT 0,
	"regTime" bigint DEFAULT 0 NOT NULL,
	"offLineTime" bigint DEFAULT 0,
	"banTime" bigint DEFAULT 0,
	"banFlag" integer DEFAULT 0,
	"excuteBanTime" bigint DEFAULT 0,
	"banType" integer DEFAULT 0,
	"banTimes" integer DEFAULT 0,
	"chatBanTime" bigint DEFAULT 0,
	"banGMName" varchar(255),
	"noticeBanTime" bigint DEFAULT 0,
	"lastOnlineTime" bigint DEFAULT 0,
	"DAILY" varchar(4) DEFAULT 'Y' NOT NULL,
	"gmail" varchar(255),
	"serverId" integer,
	"crossFightSrcServerId" integer DEFAULT -1 NOT NULL,
	"lastModGoldGetTime" bigint DEFAULT 0,
	"modGoldGetTimeInterval" bigint DEFAULT 0,
	"modGoldAmount" bigint DEFAULT 0,
	"beTrainingModTime" bigint DEFAULT 0,
	"guideStep" varchar(255) DEFAULT '',
	"payRiskFactor" integer DEFAULT 0,
	"phoneDevice" varchar(255),
	"crystal" bigint DEFAULT 0,
	"skillMaterial" bigint DEFAULT 0,
	"kingdomContribution" integer DEFAULT 0 NOT NULL,
	"cpCount" integer DEFAULT 0,
	"militaryScore" integer DEFAULT 0,
	"allianceBuildScore" bigint DEFAULT 0,
	"backPlayer" integer DEFAULT 0,
	"backFlag_mc" integer DEFAULT 0,
	"backFlag_op" integer DEFAULT 0,
	"decomposesuiteffect" varchar(100) DEFAULT '0;0;0',
	"curGaid" varchar(40),
	"expeditionCrossCount" integer DEFAULT 0,
	"expeditionCrossTime" bigint DEFAULT 0,
	"expeditionFirstBloodTime" bigint DEFAULT 0,
	"payTotalDollar" numeric(10, 2),
	"srcServerId" integer DEFAULT -1 NOT NULL,
	"allianceIdBack" varchar(40) DEFAULT '',
	"neutralScore" bigint DEFAULT 0 NOT NULL,
	"dmmGold" bigint DEFAULT 0,
	"dmmPaidGold" bigint DEFAULT 0,
	"civilizationType" integer DEFAULT 0,
	"civilizationSorce" bigint DEFAULT 0,
	"paidSpecialGold" bigint,
	"dmmPaidSpecialGold" bigint,
	"crystalGold" bigint DEFAULT 0,
	"picfraId" integer DEFAULT 0,
	CONSTRAINT "userprofile_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."userprofile_active" (
	"uuid" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."userprofile_active_uuid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" varchar(30) NOT NULL,
	"level" smallint DEFAULT 0,
	"build_level" smallint DEFAULT 0,
	"honour_level" smallint DEFAULT 0,
	"parse_register_id" varchar(100) DEFAULT '',
	"country" varchar(20) DEFAULT '',
	"pf" varchar(20) DEFAULT '',
	"lang" varchar(20) DEFAULT '',
	"vip_level" smallint DEFAULT 0,
	"svip_level" smallint DEFAULT 0,
	"total_pay" integer DEFAULT 0,
	"last_online_time" bigint DEFAULT 0,
	"ban_time" bigint DEFAULT 0,
	"status" smallint DEFAULT 0,
	"push_count" integer DEFAULT 0,
	"pay_sum" numeric(10, 2) DEFAULT 0.00,
	"power" bigint DEFAULT 0,
	"user_name" varchar(255) DEFAULT '',
	"most_ip" varchar(16) DEFAULT '',
	"app_version" varchar(40) DEFAULT '',
	"last_pay_time" bigint,
	"gmail" varchar(255),
	"reg_time" bigint,
	"reg_ip" varchar(20),
	"type" integer,
	"deviceId" varchar(255),
	"exp" integer,
	"offLineTime" bigint,
	"googleAccount" varchar(255),
	"facebookAccount" varchar(255),
	CONSTRAINT "userprofile_active_PRIMARY" PRIMARY KEY("uuid"),
	CONSTRAINT "userprofile_active_level_range" CHECK ("level" BETWEEN -128 AND 127),
	CONSTRAINT "userprofile_active_build_level_range" CHECK ("build_level" BETWEEN -128 AND 127),
	CONSTRAINT "userprofile_active_honour_level_range" CHECK ("honour_level" BETWEEN -128 AND 127),
	CONSTRAINT "userprofile_active_vip_level_range" CHECK ("vip_level" BETWEEN -128 AND 127),
	CONSTRAINT "userprofile_active_svip_level_range" CHECK ("svip_level" BETWEEN -128 AND 127),
	CONSTRAINT "userprofile_active_status_range" CHECK ("status" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."userprofile_bak" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"name" varchar(255) NOT NULL,
	"level" integer NOT NULL,
	"exp" integer NOT NULL,
	"gold" bigint DEFAULT 0 NOT NULL,
	"paidGold" bigint DEFAULT 0,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"parseRegisterId" varchar(255),
	"gcmRegisterId" varchar(255),
	"openedPos" varchar(500),
	"pic" varchar(40),
	"picVer" integer DEFAULT 0,
	"country" varchar(40) NOT NULL,
	"allianceId" varchar(40),
	"chNameCount" varchar(255) DEFAULT '0',
	"worldPoint" integer,
	"deviceId" varchar(255),
	"deviceUuid" varchar(200),
	"gaid" varchar(40),
	"platform" varchar(40),
	"pf" varchar(40) DEFAULT 'csmod_games',
	"lang" varchar(40),
	"mt" varchar(255),
	"appVersion" varchar(40),
	"gmFlag" integer DEFAULT 0,
	"regTime" bigint DEFAULT 0 NOT NULL,
	"offLineTime" bigint DEFAULT 0,
	"banTime" bigint DEFAULT 0,
	"banType" integer DEFAULT 0,
	"banTimes" integer DEFAULT 0,
	"chatBanTime" bigint DEFAULT 0,
	"banGMName" varchar(255),
	"noticeBanTime" bigint DEFAULT 0,
	"lastOnlineTime" bigint DEFAULT 0,
	"gmail" varchar(255),
	"serverId" integer,
	"crossFightSrcServerId" integer DEFAULT -1 NOT NULL,
	"lastModGoldGetTime" bigint DEFAULT 0,
	"modGoldGetTimeInterval" bigint DEFAULT 0,
	"modGoldAmount" bigint DEFAULT 0,
	"beTrainingModTime" bigint DEFAULT 0,
	"guideStep" varchar(255) DEFAULT '',
	"payRiskFactor" integer DEFAULT 0,
	"phoneDevice" varchar(40),
	"crystal" bigint DEFAULT 0,
	CONSTRAINT "userprofile_bak_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."userprofile_del" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"name" varchar(255) NOT NULL,
	"level" integer NOT NULL,
	"exp" integer NOT NULL,
	"gold" bigint DEFAULT 0 NOT NULL,
	"paidGold" bigint DEFAULT 0,
	"payTotal" bigint DEFAULT 0 NOT NULL,
	"parseRegisterId" varchar(255),
	"gcmRegisterId" varchar(255),
	"openedPos" varchar(500),
	"pic" varchar(40),
	"picVer" integer DEFAULT 0,
	"country" varchar(40) NOT NULL,
	"allianceId" varchar(40),
	"chNameCount" varchar(255) DEFAULT '0',
	"worldPoint" integer,
	"deviceId" varchar(255),
	"deviceUuid" varchar(200),
	"gaid" varchar(40),
	"platform" varchar(40),
	"pf" varchar(40) DEFAULT 'csmod_games',
	"lang" varchar(40),
	"mt" varchar(255),
	"appVersion" varchar(40),
	"gmFlag" integer DEFAULT 0,
	"regTime" bigint DEFAULT 0 NOT NULL,
	"offLineTime" bigint DEFAULT 0,
	"banTime" bigint DEFAULT 0,
	"banType" integer DEFAULT 0,
	"banTimes" integer DEFAULT 0,
	"chatBanTime" bigint DEFAULT 0,
	"banGMName" varchar(255),
	"noticeBanTime" bigint DEFAULT 0,
	"lastOnlineTime" bigint DEFAULT 0,
	"gmail" varchar(255),
	"serverId" integer,
	"crossFightSrcServerId" integer DEFAULT -1 NOT NULL,
	"lastModGoldGetTime" bigint DEFAULT 0,
	"modGoldGetTimeInterval" bigint DEFAULT 0,
	"modGoldAmount" bigint DEFAULT 0,
	"beTrainingModTime" bigint DEFAULT 0,
	"guideStep" varchar(255) DEFAULT '',
	"payRiskFactor" integer DEFAULT 0,
	"phoneDevice" varchar(40),
	"crystal" bigint DEFAULT 0,
	"skillMaterial" bigint DEFAULT 0,
	CONSTRAINT "userprofile_del_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."vip_box_turntable" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"vip" integer NOT NULL,
	"itemidlist" varchar(255) DEFAULT '' NOT NULL,
	"tableid" integer NOT NULL,
	"openCount" bigint DEFAULT 0 NOT NULL,
	"stepNum" integer DEFAULT 0 NOT NULL,
	"free" integer DEFAULT 0 NOT NULL,
	"rewardTime" bigint DEFAULT 0,
	"refreshTime" bigint DEFAULT 0,
	CONSTRAINT "vip_box_turntable_PRIMARY" PRIMARY KEY("uid","vip")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."wishing_tree" (
	"uid" varchar(32) DEFAULT '' NOT NULL,
	"totalNum" bigint,
	"type_1" integer,
	"type_2" integer,
	"type_3" integer,
	"type_4" integer,
	"type_5" integer,
	"type_6" integer,
	"type_7" integer,
	"type_8" integer,
	"type_9" integer,
	"type_10" integer,
	"refreshtime" bigint,
	"rewardtime" bigint,
	"rewardid" integer,
	"type_11" integer DEFAULT 0,
	"type_12" integer DEFAULT 0,
	"type_13" integer DEFAULT 0,
	"type_14" integer DEFAULT 0,
	"type_15" integer DEFAULT 0,
	"type_16" integer DEFAULT 0,
	"type_17" integer DEFAULT 0,
	"type_18" integer DEFAULT 0,
	"type_19" integer DEFAULT 0,
	"type_20" integer DEFAULT 0,
	CONSTRAINT "wishing_tree_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_barbarion" (
	"pointId" integer NOT NULL,
	"configId" varchar(255) NOT NULL,
	"lastArmyMapByteArray" "bytea",
	"lastAwardArmyMapByteArray" "bytea",
	"lastBeAttackedTime" bigint DEFAULT 0,
	"currentHP" integer DEFAULT 0,
	CONSTRAINT "world_barbarion_PRIMARY" PRIMARY KEY("pointId"),
	CONSTRAINT "world_barbarion_lastArmyMapByteArray_length" CHECK (octet_length("lastArmyMapByteArray") <= 65535),
	CONSTRAINT "world_barbarion_lastAwardArmyMapByteArray_length" CHECK (octet_length("lastAwardArmyMapByteArray") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_barbarion_dead" (
	"id" varchar(40) NOT NULL,
	"areaId" integer NOT NULL,
	"level" integer NOT NULL,
	"pointItem" varchar(255) DEFAULT '0',
	"deadFinishTime" bigint NOT NULL,
	CONSTRAINT "world_barbarion_dead_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_basttile_dead" (
	"id" varchar(40) NOT NULL,
	"areaId" integer NOT NULL,
	"level" integer NOT NULL,
	"pointItem" varchar(255) DEFAULT '0',
	"deadFinishTime" bigint NOT NULL,
	CONSTRAINT "world_basttile_dead_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_favorite" (
	"uid" varchar(255) NOT NULL,
	"point" integer NOT NULL,
	"type" integer NOT NULL,
	"cityType" integer DEFAULT -1,
	"resType" integer DEFAULT -1,
	"name" varchar(255),
	"server" integer DEFAULT 0 NOT NULL,
	"createTime" bigint DEFAULT 0,
	CONSTRAINT "world_favorite_PRIMARY" PRIMARY KEY("uid","point","server")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_field_monster_dead" (
	"uuid" varchar(40) NOT NULL,
	"id" integer NOT NULL,
	"monster" varchar(40),
	"deadFinishTime" bigint NOT NULL,
	CONSTRAINT "world_field_monster_dead_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_flush_barbarion_tmp" (
	"id" integer NOT NULL,
	"pointType" integer NOT NULL,
	"pointItem" varchar(255),
	"resLevel" integer DEFAULT 0 NOT NULL,
	"flushTime" bigint DEFAULT 0,
	CONSTRAINT "world_flush_barbarion_tmp_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_flush_basttile_tmp" (
	"id" integer NOT NULL,
	"pointType" integer NOT NULL,
	"pointItem" varchar(255),
	"resLevel" integer DEFAULT 0 NOT NULL,
	"flushTime" bigint DEFAULT 0,
	CONSTRAINT "world_flush_basttile_tmp_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_flush_field_monster_tmp" (
	"id" integer NOT NULL,
	"pointType" integer NOT NULL,
	"pointItem" varchar(255),
	"startTime" bigint DEFAULT 0 NOT NULL,
	"flushTime" bigint DEFAULT 0,
	CONSTRAINT "world_flush_field_monster_tmp_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_flush_monster_tmp" (
	"id" integer NOT NULL,
	"pointType" integer NOT NULL,
	"flushTime" bigint DEFAULT 0,
	CONSTRAINT "world_flush_monster_tmp_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_flush_resource_new_tmp" (
	"id" integer NOT NULL,
	"pointType" integer NOT NULL,
	"pointItem" varchar(255),
	"resLevel" integer DEFAULT 0 NOT NULL,
	"resCostValue" integer DEFAULT 0 NOT NULL,
	"resInitValue" integer NOT NULL,
	"flushTime" bigint DEFAULT 0,
	CONSTRAINT "world_flush_resource_new_tmp_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_flush_resource_tmp" (
	"id" integer NOT NULL,
	"pointType" integer NOT NULL,
	"pointItem" varchar(255),
	"resLevel" integer DEFAULT 0 NOT NULL,
	"resCostValue" integer DEFAULT 0 NOT NULL,
	"resInitValue" integer NOT NULL,
	"flushTime" bigint DEFAULT 0,
	CONSTRAINT "world_flush_resource_tmp_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_hero_record" (
	"heroUid" varchar(40) NOT NULL,
	"heroFreeTime" bigint DEFAULT 0,
	CONSTRAINT "world_hero_record_PRIMARY" PRIMARY KEY("heroUid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_march" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"ownerUid" varchar(40),
	"ownerId" integer NOT NULL,
	"ownerName" varchar(255),
	"ownerColor" integer,
	"allianceId" varchar(40),
	"teamId" varchar(40),
	"armyInfo" "bytea",
	"type" integer NOT NULL,
	"targetId" integer NOT NULL,
	"targetType" integer,
	"targetUid" varchar(255),
	"marchStartTime" bigint NOT NULL,
	"marchTime" integer,
	"marchArrivalTime" bigint,
	"returnStartTime" bigint,
	"arrivalTime" bigint,
	"exploreTime" bigint,
	"exploreReport" "bytea",
	"collectSpd" real,
	"changeCollectSpdTime" bigint,
	"collectedBeforeSpd" bigint,
	"resLevel" integer,
	"plunderRes" varchar(2048),
	"retrieveRes" varchar(1024),
	"state" integer,
	"extraParam" integer DEFAULT 0,
	"blackLandMarchTime" varchar(2048),
	"monsterArmyCount" integer,
	"monsterLevel" integer,
	"monsterInfo" varchar(4000),
	"territoryStartTime" bigint,
	"territoryUpdateTime" bigint,
	"territoryStat" integer DEFAULT 0,
	"buildingKillArmy" "bytea",
	"slowDown" integer DEFAULT 0,
	"worldId" integer DEFAULT 0 NOT NULL,
	"isDuelSkill" integer DEFAULT 0,
	"fightSide" integer DEFAULT 0,
	"occupyResourceEndTime" bigint DEFAULT 0,
	"superTeam" integer DEFAULT 0,
	"honourWatchtower" integer DEFAULT 0,
	"npcDropAdd" numeric(8, 2),
	"record" integer,
	"stamina" integer DEFAULT 0,
	"singleCureAdd" numeric(8, 2) DEFAULT 0.00,
	CONSTRAINT "world_march_PRIMARY" PRIMARY KEY("uuid"),
	CONSTRAINT "world_march_armyInfo_length" CHECK (octet_length("armyInfo") <= 65535),
	CONSTRAINT "world_march_exploreReport_length" CHECK (octet_length("exploreReport") <= 65535),
	CONSTRAINT "world_march_buildingKillArmy_length" CHECK (octet_length("buildingKillArmy") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_res_dead" (
	"id" varchar(40) NOT NULL,
	"areaId" integer NOT NULL,
	"level" integer NOT NULL,
	"pointItem" varchar(255) DEFAULT '0',
	"deadFinishTime" bigint NOT NULL,
	CONSTRAINT "world_res_dead_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_res_new_dead" (
	"id" varchar(40) NOT NULL,
	"areaId" integer NOT NULL,
	"level" integer NOT NULL,
	"pointItem" varchar(255) DEFAULT '0',
	"deadFinishTime" bigint NOT NULL,
	CONSTRAINT "world_res_new_dead_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_res_record" (
	"time" bigint NOT NULL,
	"id" integer NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"areaId" integer NOT NULL,
	"level" integer,
	"pointItem" varchar(255),
	CONSTRAINT "world_res_record_PRIMARY" PRIMARY KEY("time","id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_update_gridtype_tmp" (
	"id" bigint GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb1"."world_update_gridtype_tmp_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 4294967295 START WITH 1442402 CACHE 1),
	"gridType" integer NOT NULL,
	"grid2Type" integer NOT NULL,
	CONSTRAINT "world_update_gridtype_tmp_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "world_update_gridtype_tmp_id_range" CHECK ("id" >= 0 AND "id" <= 4294967295)
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."worldcup_apply" (
	"allianceId" varchar(50) NOT NULL,
	"version" integer NOT NULL,
	"applyUid" varchar(50),
	"serverId" integer,
	"time" bigint,
	CONSTRAINT "worldcup_apply_PRIMARY" PRIMARY KEY("allianceId","version")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."worldpoint" (
	"id" integer NOT NULL,
	"worldId" integer DEFAULT 0 NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"areaId" integer NOT NULL,
	"monsterAreaId" integer,
	"bornAreaId" integer,
	"gridType" integer NOT NULL,
	"grid2Type" integer NOT NULL,
	"pointType" integer NOT NULL,
	"pointItem" varchar(255),
	"territoryAlliance" varchar(255),
	"territoryId" integer,
	"active" integer,
	"relicAreaId" varchar(255),
	"resLevel" integer NOT NULL,
	"resCostValue" integer DEFAULT 0 NOT NULL,
	"resInitValue" integer NOT NULL,
	"ownerId" varchar(255),
	"ownerName" varchar(255),
	"allianceId" varchar(40),
	"cityDefValue" integer,
	"startOccupyTime" bigint DEFAULT 0,
	"ownerMarchUUid" varchar(40),
	"flushTime" bigint DEFAULT 0,
	"fireTime" bigint,
	"shieldTime" bigint DEFAULT 0,
	"startTime" bigint,
	"monsterInfo" "bytea",
	"resourceShieldTime" bigint DEFAULT 0,
	"monsterCastleState" integer DEFAULT 0,
	"monsterCurrHP" integer DEFAULT 0,
	"flushFlag" integer DEFAULT 0,
	"sendHeartDurationTime" bigint DEFAULT 0,
	"heartType" varchar(5),
	"cannonFireTime" bigint,
	"trap" varchar(255),
	"reserve" bigint DEFAULT 0,
	CONSTRAINT "worldpoint_PRIMARY" PRIMARY KEY("id","worldId"),
	CONSTRAINT "worldpoint_monsterInfo_length" CHECK (octet_length("monsterInfo") <= 65535)
);
--> statement-breakpoint
CREATE INDEX "action_record_pack_uid" ON "cokdb1"."action_record_pack" USING btree ("uid","type","type1");--> statement-breakpoint
CREATE INDEX "action_record_pack_time" ON "cokdb1"."action_record_pack" USING btree ("time");--> statement-breakpoint
CREATE INDEX "activation_index_user" ON "cokdb1"."activation" USING btree ("user");--> statement-breakpoint
CREATE UNIQUE INDEX "ad_building_attachment_uss_index" ON "cokdb1"."ad_building_attachment" USING btree ("uuid","serverid","skillid");--> statement-breakpoint
CREATE INDEX "ad_mat_index_query" ON "cokdb1"."ad_mat" USING btree ("matId");--> statement-breakpoint
CREATE INDEX "ad_reward_index_time" ON "cokdb1"."ad_reward" USING btree ("time");--> statement-breakpoint
CREATE INDEX "affairs_index_type" ON "cokdb1"."affairs" USING btree ("type","rewardTime");--> statement-breakpoint
CREATE INDEX "alliance_name_idx" ON "cokdb1"."alliance" USING btree ("alliancename");--> statement-breakpoint
CREATE INDEX "alliance_apply_index_user" ON "cokdb1"."alliance_apply" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "alliance_apply_index_alliance" ON "cokdb1"."alliance_apply" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_apply_index_time" ON "cokdb1"."alliance_apply" USING btree ("applyTime");--> statement-breakpoint
CREATE INDEX "alliance_build_cost_record_index_user" ON "cokdb1"."alliance_build_cost_record" USING btree ("time","userId","type");--> statement-breakpoint
CREATE INDEX "alliance_build_cost_record_index_type" ON "cokdb1"."alliance_build_cost_record" USING btree ("userId","time","type");--> statement-breakpoint
CREATE INDEX "alliance_comment_index_allianceId" ON "cokdb1"."alliance_comment" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_comment_shield_index_allianceId" ON "cokdb1"."alliance_comment_shield" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_group_buys_index_allianceId" ON "cokdb1"."alliance_group_buys" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_group_buys_index_time" ON "cokdb1"."alliance_group_buys" USING btree ("buyTime");--> statement-breakpoint
CREATE INDEX "alliance_help_allianceId_index" ON "cokdb1"."alliance_help" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_help_index_alliance_help" ON "cokdb1"."alliance_help" USING btree ("content");--> statement-breakpoint
CREATE INDEX "alliance_helper_index_alliance_helper" ON "cokdb1"."alliance_helper" USING btree ("helpId","recvId");--> statement-breakpoint
CREATE INDEX "alliance_member_index_allianceId" ON "cokdb1"."alliance_member" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_member_bak_index_allianceId" ON "cokdb1"."alliance_member_bak" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_mission_aid_idx" ON "cokdb1"."alliance_mission" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_mission_record_uid_idx" ON "cokdb1"."alliance_mission_record" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "alliance_mission_record_mid_idx" ON "cokdb1"."alliance_mission_record" USING btree ("missionUUID");--> statement-breakpoint
CREATE INDEX "alliance_mission_record_allianceId" ON "cokdb1"."alliance_mission_record" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_new_resource_log_uid_index" ON "cokdb1"."alliance_new_resource_log" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "alliance_offical_apply_index_user" ON "cokdb1"."alliance_offical_apply" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "alliance_offical_apply_index_alliance" ON "cokdb1"."alliance_offical_apply" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_science_index_alliance" ON "cokdb1"."alliance_science" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_shop_index_alliance" ON "cokdb1"."alliance_shop" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_shop_buyrecord_buytime" ON "cokdb1"."alliance_shop_buyrecord" USING btree ("buytime");--> statement-breakpoint
CREATE INDEX "alliance_shop_buytoallianceshoprecord_buytime" ON "cokdb1"."alliance_shop_buytoallianceshoprecord" USING btree ("buytime");--> statement-breakpoint
CREATE INDEX "alliance_shop_make_index_alliance" ON "cokdb1"."alliance_shop_make" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_shophis_index_alliance" ON "cokdb1"."alliance_shophis" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_shophis_index_user" ON "cokdb1"."alliance_shophis" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "alliance_task_al_idx" ON "cokdb1"."alliance_task" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_task_publish_idx" ON "cokdb1"."alliance_task" USING btree ("publishUid");--> statement-breakpoint
CREATE INDEX "alliance_task_accept_idx" ON "cokdb1"."alliance_task" USING btree ("acceptUid");--> statement-breakpoint
CREATE INDEX "alliance_task_log_castle_color" ON "cokdb1"."alliance_task_log" USING btree ("castleLevel","color");--> statement-breakpoint
CREATE INDEX "alliance_task_log_level_index" ON "cokdb1"."alliance_task_log" USING btree ("level");--> statement-breakpoint
CREATE INDEX "alliance_task_log_color_index" ON "cokdb1"."alliance_task_log" USING btree ("color");--> statement-breakpoint
CREATE INDEX "alliance_task_log_castle_index" ON "cokdb1"."alliance_task_log" USING btree ("castleLevel");--> statement-breakpoint
CREATE INDEX "alliance_task_unpublish_pub_idx" ON "cokdb1"."alliance_task_unpublish" USING btree ("publishUid");--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_territory_pointId_worldId_idx" ON "cokdb1"."alliance_territory" USING btree ("pointId","atWorldId");--> statement-breakpoint
CREATE INDEX "alliance_territory_alliance_idx" ON "cokdb1"."alliance_territory" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "alliance_territory_update_idx" ON "cokdb1"."alliance_territory" USING btree ("updateTime");--> statement-breakpoint
CREATE INDEX "alliance_territory_start_idx" ON "cokdb1"."alliance_territory" USING btree ("startTime");--> statement-breakpoint
CREATE INDEX "alliance_territory_lastup_idx" ON "cokdb1"."alliance_territory" USING btree ("lastUpdateTime");--> statement-breakpoint
CREATE INDEX "alliance_territory_tower_idx" ON "cokdb1"."alliance_territory" USING btree ("towerPoint");--> statement-breakpoint
CREATE INDEX "alliance_territory_pointId_idx" ON "cokdb1"."alliance_territory" USING btree ("pointId");--> statement-breakpoint
CREATE INDEX "army_skill_info_uid" ON "cokdb1"."army_skill_info" USING btree ("uid");--> statement-breakpoint
CREATE UNIQUE INDEX "barbarion_statistics_uid_name_time_index" ON "cokdb1"."barbarion_statistics" USING btree ("playerUid","playerName","time");--> statement-breakpoint
CREATE INDEX "barbarion_statistics_playerUid_Index" ON "cokdb1"."barbarion_statistics" USING btree ("playerUid");--> statement-breakpoint
CREATE INDEX "barbarion_statistics_isSuccess_actType_index" ON "cokdb1"."barbarion_statistics" USING btree ("isSuccess","actType");--> statement-breakpoint
CREATE INDEX "barbarion_statistics_strongHoldLevel_index" ON "cokdb1"."barbarion_statistics" USING btree ("strongHoldLevel");--> statement-breakpoint
CREATE INDEX "barbarion_statistics_actType_index" ON "cokdb1"."barbarion_statistics" USING btree ("actType");--> statement-breakpoint
CREATE INDEX "black_land_barbarion_dead_dead_res_time" ON "cokdb1"."black_land_barbarion_dead" USING btree ("deadFinishTime");--> statement-breakpoint
CREATE INDEX "black_land_barbarion_dead_areaId_index" ON "cokdb1"."black_land_barbarion_dead" USING btree ("areaId");--> statement-breakpoint
CREATE INDEX "black_land_basttile_dead_dead_res_time" ON "cokdb1"."black_land_basttile_dead" USING btree ("deadFinishTime");--> statement-breakpoint
CREATE INDEX "black_land_basttile_dead_areaId_index" ON "cokdb1"."black_land_basttile_dead" USING btree ("areaId");--> statement-breakpoint
CREATE INDEX "black_land_res_dead_dead_res_time" ON "cokdb1"."black_land_res_dead" USING btree ("deadFinishTime");--> statement-breakpoint
CREATE INDEX "black_land_res_dead_areaId_index" ON "cokdb1"."black_land_res_dead" USING btree ("areaId");--> statement-breakpoint
CREATE INDEX "bottles_uid_index" ON "cokdb1"."bottles" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "branch_link_branch_link_from_index" ON "cokdb1"."branch_link" USING btree ("fromUid");--> statement-breakpoint
CREATE INDEX "branch_link_branch_link_type_index" ON "cokdb1"."branch_link" USING btree ("type");--> statement-breakpoint
CREATE INDEX "branch_url_branch_url_link_index" ON "cokdb1"."branch_url" USING btree ("url");--> statement-breakpoint
CREATE INDEX "branch_url_branch_url_type_index" ON "cokdb1"."branch_url" USING btree ("type");--> statement-breakpoint
CREATE INDEX "chat_report_record_time_idx" ON "cokdb1"."chat_report_record" USING btree ("lastUpdateTime");--> statement-breakpoint
CREATE INDEX "chat_shield_owner_other_index" ON "cokdb1"."chat_shield" USING btree ("owner","other");--> statement-breakpoint
CREATE INDEX "compensate_record_time_idx" ON "cokdb1"."compensate_record" USING btree ("time");--> statement-breakpoint
CREATE INDEX "compensate_record_uid_idx" ON "cokdb1"."compensate_record" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "compensation_record_time_index" ON "cokdb1"."compensation_record" USING btree ("lastCompensateTime");--> statement-breakpoint
CREATE UNIQUE INDEX "cross_throne_king_info_uuid" ON "cokdb1"."cross_throne_king_info" USING btree ("uuid");--> statement-breakpoint
CREATE INDEX "crystal_cost_record_index_user" ON "cokdb1"."crystal_cost_record" USING btree ("time","userId","type");--> statement-breakpoint
CREATE INDEX "crystal_cost_record_index_type" ON "cokdb1"."crystal_cost_record" USING btree ("userId","time","type");--> statement-breakpoint
CREATE INDEX "crystal_cost_record_index_goldType" ON "cokdb1"."crystal_cost_record" USING btree ("goldType");--> statement-breakpoint
CREATE INDEX "donate_history_aid_idx" ON "cokdb1"."donate_history" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "donate_history_time_idx" ON "cokdb1"."donate_history" USING btree ("donateTime");--> statement-breakpoint
CREATE INDEX "donate_history_progress_idx" ON "cokdb1"."donate_history" USING btree ("progress");--> statement-breakpoint
CREATE INDEX "donate_history_donate_idx" ON "cokdb1"."donate_history" USING btree ("donate");--> statement-breakpoint
CREATE INDEX "donate_history_record_aid_idx" ON "cokdb1"."donate_history_record" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "donate_history_record_time_idx" ON "cokdb1"."donate_history_record" USING btree ("donateTime");--> statement-breakpoint
CREATE INDEX "donate_history_record_progress_idx" ON "cokdb1"."donate_history_record" USING btree ("progress");--> statement-breakpoint
CREATE INDEX "donate_history_record_donate_idx" ON "cokdb1"."donate_history_record" USING btree ("donate");--> statement-breakpoint
CREATE INDEX "dragon_battle_fight_history_utvindex" ON "cokdb1"."dragon_battle_fight_history" USING btree ("uid","type","VERSION");--> statement-breakpoint
CREATE INDEX "dragon_battle_fight_history_teamIdindex" ON "cokdb1"."dragon_battle_fight_history" USING btree ("teamId");--> statement-breakpoint
CREATE INDEX "dragon_battle_mail_record_state" ON "cokdb1"."dragon_battle_mail_record" USING btree ("state");--> statement-breakpoint
CREATE INDEX "dragon_tower_buff_Index_uid" ON "cokdb1"."dragon_tower_buff" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "dragon_tower_layer_Index_uid" ON "cokdb1"."dragon_tower_layer" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "dragon_words_record_dragon_words_record_index" ON "cokdb1"."dragon_words_record" USING btree ("castleLevel","buildingLevel");--> statement-breakpoint
CREATE INDEX "exchange_visible_uid_index" ON "cokdb1"."exchange_visible" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "expedition_record_time_index" ON "cokdb1"."expedition_record" USING btree ("time");--> statement-breakpoint
CREATE INDEX "fast_carry_activity_goalReward" ON "cokdb1"."fast_carry_activity" USING btree ("goalReward1","goalReward2","goalReward3","goalReward4");--> statement-breakpoint
CREATE INDEX "firstpaylog_index_time_pf" ON "cokdb1"."firstpaylog" USING btree ("time","pf");--> statement-breakpoint
CREATE INDEX "gold_cost_record_index_user" ON "cokdb1"."gold_cost_record" USING btree ("time","userId","type");--> statement-breakpoint
CREATE INDEX "gold_cost_record_index_type" ON "cokdb1"."gold_cost_record" USING btree ("userId","time","type");--> statement-breakpoint
CREATE INDEX "gold_cost_record_index_goldType" ON "cokdb1"."gold_cost_record" USING btree ("goldType");--> statement-breakpoint
CREATE INDEX "gold_wish_pool_byUid" ON "cokdb1"."gold_wish_pool" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "goods_cost_record_index_time" ON "cokdb1"."goods_cost_record" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_index_user" ON "cokdb1"."goods_cost_record" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_0_index_type" ON "cokdb1"."goods_cost_record_2024_0" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_0_index_time" ON "cokdb1"."goods_cost_record_2024_0" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_0_index_time_user" ON "cokdb1"."goods_cost_record_2024_0" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_0_index_user_time" ON "cokdb1"."goods_cost_record_2024_0" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_1_index_type" ON "cokdb1"."goods_cost_record_2024_1" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_1_index_time" ON "cokdb1"."goods_cost_record_2024_1" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_1_index_time_user" ON "cokdb1"."goods_cost_record_2024_1" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_1_index_user_time" ON "cokdb1"."goods_cost_record_2024_1" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_10_index_type" ON "cokdb1"."goods_cost_record_2024_10" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_10_index_time" ON "cokdb1"."goods_cost_record_2024_10" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_10_index_time_user" ON "cokdb1"."goods_cost_record_2024_10" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_10_index_user_time" ON "cokdb1"."goods_cost_record_2024_10" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_11_index_type" ON "cokdb1"."goods_cost_record_2024_11" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_11_index_time" ON "cokdb1"."goods_cost_record_2024_11" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_11_index_time_user" ON "cokdb1"."goods_cost_record_2024_11" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_11_index_user_time" ON "cokdb1"."goods_cost_record_2024_11" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_2_index_type" ON "cokdb1"."goods_cost_record_2024_2" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_2_index_time" ON "cokdb1"."goods_cost_record_2024_2" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_2_index_time_user" ON "cokdb1"."goods_cost_record_2024_2" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_2_index_user_time" ON "cokdb1"."goods_cost_record_2024_2" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_3_index_type" ON "cokdb1"."goods_cost_record_2024_3" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_3_index_time" ON "cokdb1"."goods_cost_record_2024_3" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_3_index_time_user" ON "cokdb1"."goods_cost_record_2024_3" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_3_index_user_time" ON "cokdb1"."goods_cost_record_2024_3" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_4_index_type" ON "cokdb1"."goods_cost_record_2024_4" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_4_index_time" ON "cokdb1"."goods_cost_record_2024_4" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_4_index_time_user" ON "cokdb1"."goods_cost_record_2024_4" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_4_index_user_time" ON "cokdb1"."goods_cost_record_2024_4" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_5_index_type" ON "cokdb1"."goods_cost_record_2024_5" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_5_index_time" ON "cokdb1"."goods_cost_record_2024_5" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_5_index_time_user" ON "cokdb1"."goods_cost_record_2024_5" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_5_index_user_time" ON "cokdb1"."goods_cost_record_2024_5" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_6_index_type" ON "cokdb1"."goods_cost_record_2024_6" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_6_index_time" ON "cokdb1"."goods_cost_record_2024_6" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_6_index_time_user" ON "cokdb1"."goods_cost_record_2024_6" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_6_index_user_time" ON "cokdb1"."goods_cost_record_2024_6" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_7_index_type" ON "cokdb1"."goods_cost_record_2024_7" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_7_index_time" ON "cokdb1"."goods_cost_record_2024_7" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_7_index_time_user" ON "cokdb1"."goods_cost_record_2024_7" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_7_index_user_time" ON "cokdb1"."goods_cost_record_2024_7" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_8_index_type" ON "cokdb1"."goods_cost_record_2024_8" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_8_index_time" ON "cokdb1"."goods_cost_record_2024_8" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_8_index_time_user" ON "cokdb1"."goods_cost_record_2024_8" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_8_index_user_time" ON "cokdb1"."goods_cost_record_2024_8" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_9_index_type" ON "cokdb1"."goods_cost_record_2024_9" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_9_index_time" ON "cokdb1"."goods_cost_record_2024_9" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_9_index_time_user" ON "cokdb1"."goods_cost_record_2024_9" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_9_index_user_time" ON "cokdb1"."goods_cost_record_2024_9" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_0_index_type" ON "cokdb1"."goods_cost_record_2026_0" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_0_index_time" ON "cokdb1"."goods_cost_record_2026_0" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_0_index_time_user" ON "cokdb1"."goods_cost_record_2026_0" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_0_index_user_time" ON "cokdb1"."goods_cost_record_2026_0" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_1_index_type" ON "cokdb1"."goods_cost_record_2026_1" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_1_index_time" ON "cokdb1"."goods_cost_record_2026_1" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_1_index_time_user" ON "cokdb1"."goods_cost_record_2026_1" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_1_index_user_time" ON "cokdb1"."goods_cost_record_2026_1" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_10_index_type" ON "cokdb1"."goods_cost_record_2026_10" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_10_index_time" ON "cokdb1"."goods_cost_record_2026_10" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_10_index_time_user" ON "cokdb1"."goods_cost_record_2026_10" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_10_index_user_time" ON "cokdb1"."goods_cost_record_2026_10" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_11_index_type" ON "cokdb1"."goods_cost_record_2026_11" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_11_index_time" ON "cokdb1"."goods_cost_record_2026_11" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_11_index_time_user" ON "cokdb1"."goods_cost_record_2026_11" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_11_index_user_time" ON "cokdb1"."goods_cost_record_2026_11" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_2_index_type" ON "cokdb1"."goods_cost_record_2026_2" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_2_index_time" ON "cokdb1"."goods_cost_record_2026_2" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_2_index_time_user" ON "cokdb1"."goods_cost_record_2026_2" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_2_index_user_time" ON "cokdb1"."goods_cost_record_2026_2" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_3_index_type" ON "cokdb1"."goods_cost_record_2026_3" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_3_index_time" ON "cokdb1"."goods_cost_record_2026_3" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_3_index_time_user" ON "cokdb1"."goods_cost_record_2026_3" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_3_index_user_time" ON "cokdb1"."goods_cost_record_2026_3" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_4_index_type" ON "cokdb1"."goods_cost_record_2026_4" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_4_index_time" ON "cokdb1"."goods_cost_record_2026_4" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_4_index_time_user" ON "cokdb1"."goods_cost_record_2026_4" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_4_index_user_time" ON "cokdb1"."goods_cost_record_2026_4" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_5_index_type" ON "cokdb1"."goods_cost_record_2026_5" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_5_index_time" ON "cokdb1"."goods_cost_record_2026_5" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_5_index_time_user" ON "cokdb1"."goods_cost_record_2026_5" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_5_index_user_time" ON "cokdb1"."goods_cost_record_2026_5" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_6_index_type" ON "cokdb1"."goods_cost_record_2026_6" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_6_index_time" ON "cokdb1"."goods_cost_record_2026_6" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_6_index_time_user" ON "cokdb1"."goods_cost_record_2026_6" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_6_index_user_time" ON "cokdb1"."goods_cost_record_2026_6" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_7_index_type" ON "cokdb1"."goods_cost_record_2026_7" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_7_index_time" ON "cokdb1"."goods_cost_record_2026_7" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_7_index_time_user" ON "cokdb1"."goods_cost_record_2026_7" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_7_index_user_time" ON "cokdb1"."goods_cost_record_2026_7" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_8_index_type" ON "cokdb1"."goods_cost_record_2026_8" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_8_index_time" ON "cokdb1"."goods_cost_record_2026_8" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_8_index_time_user" ON "cokdb1"."goods_cost_record_2026_8" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_8_index_user_time" ON "cokdb1"."goods_cost_record_2026_8" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_9_index_type" ON "cokdb1"."goods_cost_record_2026_9" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_9_index_time" ON "cokdb1"."goods_cost_record_2026_9" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_9_index_time_user" ON "cokdb1"."goods_cost_record_2026_9" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_9_index_user_time" ON "cokdb1"."goods_cost_record_2026_9" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_0_index_type" ON "cokdb1"."goods_cost_record_2027_0" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_0_index_time" ON "cokdb1"."goods_cost_record_2027_0" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_0_index_time_user" ON "cokdb1"."goods_cost_record_2027_0" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_0_index_user_time" ON "cokdb1"."goods_cost_record_2027_0" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_1_index_type" ON "cokdb1"."goods_cost_record_2027_1" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_1_index_time" ON "cokdb1"."goods_cost_record_2027_1" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_1_index_time_user" ON "cokdb1"."goods_cost_record_2027_1" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_1_index_user_time" ON "cokdb1"."goods_cost_record_2027_1" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_10_index_type" ON "cokdb1"."goods_cost_record_2027_10" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_10_index_time" ON "cokdb1"."goods_cost_record_2027_10" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_10_index_time_user" ON "cokdb1"."goods_cost_record_2027_10" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_10_index_user_time" ON "cokdb1"."goods_cost_record_2027_10" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_11_index_type" ON "cokdb1"."goods_cost_record_2027_11" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_11_index_time" ON "cokdb1"."goods_cost_record_2027_11" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_11_index_time_user" ON "cokdb1"."goods_cost_record_2027_11" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_11_index_user_time" ON "cokdb1"."goods_cost_record_2027_11" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_2_index_type" ON "cokdb1"."goods_cost_record_2027_2" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_2_index_time" ON "cokdb1"."goods_cost_record_2027_2" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_2_index_time_user" ON "cokdb1"."goods_cost_record_2027_2" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_2_index_user_time" ON "cokdb1"."goods_cost_record_2027_2" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_3_index_type" ON "cokdb1"."goods_cost_record_2027_3" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_3_index_time" ON "cokdb1"."goods_cost_record_2027_3" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_3_index_time_user" ON "cokdb1"."goods_cost_record_2027_3" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_3_index_user_time" ON "cokdb1"."goods_cost_record_2027_3" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_4_index_type" ON "cokdb1"."goods_cost_record_2027_4" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_4_index_time" ON "cokdb1"."goods_cost_record_2027_4" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_4_index_time_user" ON "cokdb1"."goods_cost_record_2027_4" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_4_index_user_time" ON "cokdb1"."goods_cost_record_2027_4" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_5_index_type" ON "cokdb1"."goods_cost_record_2027_5" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_5_index_time" ON "cokdb1"."goods_cost_record_2027_5" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_5_index_time_user" ON "cokdb1"."goods_cost_record_2027_5" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_5_index_user_time" ON "cokdb1"."goods_cost_record_2027_5" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_6_index_type" ON "cokdb1"."goods_cost_record_2027_6" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_6_index_time" ON "cokdb1"."goods_cost_record_2027_6" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_6_index_time_user" ON "cokdb1"."goods_cost_record_2027_6" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_6_index_user_time" ON "cokdb1"."goods_cost_record_2027_6" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_7_index_type" ON "cokdb1"."goods_cost_record_2027_7" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_7_index_time" ON "cokdb1"."goods_cost_record_2027_7" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_7_index_time_user" ON "cokdb1"."goods_cost_record_2027_7" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_7_index_user_time" ON "cokdb1"."goods_cost_record_2027_7" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_8_index_type" ON "cokdb1"."goods_cost_record_2027_8" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_8_index_time" ON "cokdb1"."goods_cost_record_2027_8" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_8_index_time_user" ON "cokdb1"."goods_cost_record_2027_8" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_8_index_user_time" ON "cokdb1"."goods_cost_record_2027_8" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_9_index_type" ON "cokdb1"."goods_cost_record_2027_9" USING btree ("type");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_9_index_time" ON "cokdb1"."goods_cost_record_2027_9" USING btree ("time");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_9_index_time_user" ON "cokdb1"."goods_cost_record_2027_9" USING btree ("time","userId","itemId");--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_9_index_user_time" ON "cokdb1"."goods_cost_record_2027_9" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "hero_activity_st_idx" ON "cokdb1"."hero_activity" USING btree ("startTime");--> statement-breakpoint
CREATE INDEX "hero_activity_et_idx" ON "cokdb1"."hero_activity" USING btree ("endTime");--> statement-breakpoint
CREATE INDEX "hero_activity_act_idx" ON "cokdb1"."hero_activity" USING btree ("activityId");--> statement-breakpoint
CREATE INDEX "hero_event_act_idx" ON "cokdb1"."hero_event" USING btree ("activityId");--> statement-breakpoint
CREATE INDEX "hero_event_st_idx" ON "cokdb1"."hero_event" USING btree ("startTime");--> statement-breakpoint
CREATE INDEX "hero_event_et_idx" ON "cokdb1"."hero_event" USING btree ("endTime");--> statement-breakpoint
CREATE INDEX "hero_event_eid_idx" ON "cokdb1"."hero_event" USING btree ("eventId");--> statement-breakpoint
CREATE INDEX "hero_event_r_idx" ON "cokdb1"."hero_event" USING btree ("rewardStatus");--> statement-breakpoint
CREATE INDEX "hero_event_reward_record_eid_idx" ON "cokdb1"."hero_event_reward_record" USING btree ("eventId");--> statement-breakpoint
CREATE INDEX "hero_event_reward_record_time_idx" ON "cokdb1"."hero_event_reward_record" USING btree ("time");--> statement-breakpoint
CREATE INDEX "hero_event_reward_record_level_idx" ON "cokdb1"."hero_event_reward_record" USING btree ("level");--> statement-breakpoint
CREATE INDEX "hero_event_reward_record_al_idx" ON "cokdb1"."hero_event_reward_record" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "hero_office_uid_index" ON "cokdb1"."hero_office" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "hot_goods_cost_record_uid_idx" ON "cokdb1"."hot_goods_cost_record" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "hot_goods_cost_record_goods_idx" ON "cokdb1"."hot_goods_cost_record" USING btree ("goodsId");--> statement-breakpoint
CREATE INDEX "hot_goods_cost_record_time_idx" ON "cokdb1"."hot_goods_cost_record" USING btree ("buyTime");--> statement-breakpoint
CREATE INDEX "hot_info_before_refresh_time_idx" ON "cokdb1"."hot_info_before_refresh" USING btree ("refreshTime");--> statement-breakpoint
CREATE INDEX "inviter_inviter_index_001" ON "cokdb1"."inviter" USING btree ("uid","type","time");--> statement-breakpoint
CREATE INDEX "inviter_uid_type_inviteeUid" ON "cokdb1"."inviter" USING btree ("uid","inviteeUid","type");--> statement-breakpoint
CREATE INDEX "king_allot_tax_record_time_index" ON "cokdb1"."king_allot_tax_record" USING btree ("sendTime");--> statement-breakpoint
CREATE INDEX "king_fight_log_uid_index" ON "cokdb1"."king_fight_log" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "king_skill_event_uid_index" ON "cokdb1"."king_skill_event" USING btree (left("uid", 255));--> statement-breakpoint
CREATE INDEX "king_tax_record_time_index" ON "cokdb1"."king_tax_record" USING btree ("taxTime");--> statement-breakpoint
CREATE INDEX "king_time_fight_log_Index_logtime" ON "cokdb1"."king_time_fight_log" USING btree ("logtime");--> statement-breakpoint
CREATE INDEX "kingdom_building_Index_itemid" ON "cokdb1"."kingdom_building" USING btree ("itemid");--> statement-breakpoint
CREATE INDEX "kingdom_building_buff_Index_itemid" ON "cokdb1"."kingdom_building_buff" USING btree ("uuid");--> statement-breakpoint
CREATE INDEX "kingdom_cross_fight_history_kingdom_startTime" ON "cokdb1"."kingdom_cross_fight_history" USING btree ("serverId","startTime");--> statement-breakpoint
CREATE INDEX "kingdom_cross_fight_history_startTime" ON "cokdb1"."kingdom_cross_fight_history" USING btree ("startTime");--> statement-breakpoint
CREATE INDEX "logaction_index" ON "cokdb1"."logaction" USING btree ("timeStamp","user","action","code");--> statement-breakpoint
CREATE INDEX "logaction_index2" ON "cokdb1"."logaction" USING btree ("user","timeStamp","action");--> statement-breakpoint
CREATE INDEX "logrecord_index" ON "cokdb1"."logrecord" USING btree ("timeStamp","user","category","type");--> statement-breakpoint
CREATE INDEX "logrecord_index_2" ON "cokdb1"."logrecord" USING btree ("user","category","type","timeStamp");--> statement-breakpoint
CREATE INDEX "logrecord_fight_index" ON "cokdb1"."logrecord_fight" USING btree ("timeStamp","user","category","type");--> statement-breakpoint
CREATE INDEX "logrecord_fight_index_2" ON "cokdb1"."logrecord_fight" USING btree ("user","category","type","timeStamp");--> statement-breakpoint
CREATE INDEX "logstat_index" ON "cokdb1"."logstat" USING btree ("timeStamp","user","type","param1","param2","param3");--> statement-breakpoint
CREATE INDEX "logstat_index2" ON "cokdb1"."logstat" USING btree ("type","timeStamp","user");--> statement-breakpoint
CREATE INDEX "logtemp_index" ON "cokdb1"."logtemp" USING btree ("timeStamp","user","type","param1","param2","param3");--> statement-breakpoint
CREATE INDEX "logtemp_index2" ON "cokdb1"."logtemp" USING btree ("type","timeStamp","user");--> statement-breakpoint
CREATE INDEX "logtmp_index" ON "cokdb1"."logtmp" USING btree ("timeStamp","user","type","param1","param2","param3");--> statement-breakpoint
CREATE INDEX "logtmp_index2" ON "cokdb1"."logtmp" USING btree ("type","timeStamp","user");--> statement-breakpoint
CREATE INDEX "mail_index_toFrom" ON "cokdb1"."mail" USING btree ("toUser","type","fromUser");--> statement-breakpoint
CREATE INDEX "mail_index_toUserTime" ON "cokdb1"."mail" USING btree ("toUser","createTime");--> statement-breakpoint
CREATE INDEX "mail_20150212_index_toFrom" ON "cokdb1"."mail_20150212" USING btree ("toUser","type","fromUser");--> statement-breakpoint
CREATE INDEX "mail_20150212_index_toUserTime" ON "cokdb1"."mail_20150212" USING btree ("toUser","createTime");--> statement-breakpoint
CREATE INDEX "mail_contents_user_idx" ON "cokdb1"."mail_contents" USING btree ("toUser");--> statement-breakpoint
CREATE INDEX "material_cost_record_index_user" ON "cokdb1"."material_cost_record" USING btree ("time","userId","type");--> statement-breakpoint
CREATE INDEX "material_cost_record_index_type" ON "cokdb1"."material_cost_record" USING btree ("userId","time","type");--> statement-breakpoint
CREATE INDEX "military_cost_record_index_user" ON "cokdb1"."military_cost_record" USING btree ("time","userId","type");--> statement-breakpoint
CREATE INDEX "military_cost_record_index_type" ON "cokdb1"."military_cost_record" USING btree ("userId","time","type");--> statement-breakpoint
CREATE INDEX "mod_record_from_idx" ON "cokdb1"."mod_record" USING btree ("fromUser");--> statement-breakpoint
CREATE INDEX "mod_record_to_idx" ON "cokdb1"."mod_record" USING btree ("toUser");--> statement-breakpoint
CREATE INDEX "mod_record_time_Idx" ON "cokdb1"."mod_record" USING btree ("createTime");--> statement-breakpoint
CREATE INDEX "new_exped_history_winServerId_index" ON "cokdb1"."new_exped_history" USING btree ("winServerId");--> statement-breakpoint
CREATE INDEX "new_exped_history_loseServerId_index" ON "cokdb1"."new_exped_history" USING btree ("loseServerId");--> statement-breakpoint
CREATE INDEX "new_general_predatoruid_index" ON "cokdb1"."new_general" USING btree ("predatoruid");--> statement-breakpoint
CREATE INDEX "new_general_uid" ON "cokdb1"."new_general" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "new_user_score_uid_idx" ON "cokdb1"."new_user_score" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "new_user_score_uid_stage_index" ON "cokdb1"."new_user_score" USING btree ("uid","stage");--> statement-breakpoint
CREATE INDEX "ob_record_uid" ON "cokdb1"."ob_record" USING btree ("uid","serverId","areaId");--> statement-breakpoint
CREATE INDEX "ob_report_createTime" ON "cokdb1"."ob_report" USING btree ("createTime");--> statement-breakpoint
CREATE INDEX "pay_order_count_log_index_time" ON "cokdb1"."pay_order_count_log" USING btree ("time");--> statement-breakpoint
CREATE INDEX "pay_order_count_log_index_uid_class" ON "cokdb1"."pay_order_count_log" USING btree ("uid","className");--> statement-breakpoint
CREATE INDEX "pay_request_index_uid_pf_purchaseId" ON "cokdb1"."pay_request" USING btree ("uid","pf","purchaseId");--> statement-breakpoint
CREATE INDEX "pay_request_index_uid_pf_productId" ON "cokdb1"."pay_request" USING btree ("uid","pf","productId");--> statement-breakpoint
CREATE INDEX "paycheck_index_time_status" ON "cokdb1"."paycheck" USING btree ("time","status");--> statement-breakpoint
CREATE INDEX "paylog_index_time_pf" ON "cokdb1"."paylog" USING btree ("time","pf");--> statement-breakpoint
CREATE INDEX "pic_upload_record_time_idx" ON "cokdb1"."pic_upload_record" USING btree ("updateTime");--> statement-breakpoint
CREATE INDEX "pic_upload_record_report_idx" ON "cokdb1"."pic_upload_record" USING btree ("report");--> statement-breakpoint
CREATE INDEX "pic_upload_record_stat_idx" ON "cokdb1"."pic_upload_record" USING btree ("stat");--> statement-breakpoint
CREATE INDEX "playerinfo_power_index" ON "cokdb1"."playerinfo" USING btree ("power");--> statement-breakpoint
CREATE INDEX "post_box_index_from" ON "cokdb1"."post_box" USING btree ("from");--> statement-breakpoint
CREATE INDEX "post_box_index_time" ON "cokdb1"."post_box" USING btree ("time");--> statement-breakpoint
CREATE INDEX "post_mail_index_toUserTime" ON "cokdb1"."post_mail" USING btree ("toUser","createTime");--> statement-breakpoint
CREATE INDEX "post_relation_index_time" ON "cokdb1"."post_relation" USING btree ("time");--> statement-breakpoint
CREATE INDEX "pray_record_uid_idx" ON "cokdb1"."pray_record" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "pray_record_resource_idx" ON "cokdb1"."pray_record" USING btree ("resource");--> statement-breakpoint
CREATE INDEX "pray_record_time_idx" ON "cokdb1"."pray_record" USING btree ("prayTime");--> statement-breakpoint
CREATE INDEX "princess_task_stat_index_type" ON "cokdb1"."princess_task_stat" USING btree ("state","taskType");--> statement-breakpoint
CREATE INDEX "princess_task_stat_index_param" ON "cokdb1"."princess_task_stat" USING btree ("state","param1");--> statement-breakpoint
CREATE INDEX "push_record_index_type" ON "cokdb1"."push_record" USING btree ("type");--> statement-breakpoint
CREATE INDEX "queue_ownerId_index_001" ON "cokdb1"."queue" USING btree ("ownerId");--> statement-breakpoint
CREATE INDEX "queue_updateTime_index" ON "cokdb1"."queue" USING btree ("updateTime");--> statement-breakpoint
CREATE INDEX "red_packets_state_index" ON "cokdb1"."red_packets" USING btree ("state");--> statement-breakpoint
CREATE INDEX "red_packets_records_index_player" ON "cokdb1"."red_packets_records" USING btree ("player");--> statement-breakpoint
CREATE INDEX "refund_log_index_time" ON "cokdb1"."refund_log" USING btree ("time","userId","type","itemId");--> statement-breakpoint
CREATE INDEX "refund_log_index_user" ON "cokdb1"."refund_log" USING btree ("userId","time");--> statement-breakpoint
CREATE INDEX "report_index_time" ON "cokdb1"."report" USING btree ("createTime");--> statement-breakpoint
CREATE INDEX "rescue_skill_record_uid_idx" ON "cokdb1"."rescue_skill_record" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "rescue_skill_record_tuid_idx" ON "cokdb1"."rescue_skill_record" USING btree ("targetUid");--> statement-breakpoint
CREATE INDEX "rescue_skill_record_att_time_idx" ON "cokdb1"."rescue_skill_record" USING btree ("attackTime");--> statement-breakpoint
CREATE INDEX "rescue_skill_record_return_time_idx" ON "cokdb1"."rescue_skill_record" USING btree ("returnTime");--> statement-breakpoint
CREATE INDEX "rescue_skill_record_muid_idx" ON "cokdb1"."rescue_skill_record" USING btree ("marchUuid");--> statement-breakpoint
CREATE INDEX "reward_107_time_idx" ON "cokdb1"."reward_107" USING btree ("endTime");--> statement-breakpoint
CREATE INDEX "reward_107_stat_idx" ON "cokdb1"."reward_107" USING btree ("rewardStatus");--> statement-breakpoint
CREATE INDEX "sampleuser_tag_index" ON "cokdb1"."sampleuser" USING btree ("tag");--> statement-breakpoint
CREATE INDEX "score_act_actId_idx" ON "cokdb1"."score_act" USING btree ("actId");--> statement-breakpoint
CREATE INDEX "score_act_in_actId" ON "cokdb1"."score_act_in" USING btree ("actId");--> statement-breakpoint
CREATE INDEX "score_act_in_al_idx" ON "cokdb1"."score_act_in" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "score_act_record_actid_idx" ON "cokdb1"."score_act_record" USING btree ("actId");--> statement-breakpoint
CREATE INDEX "score_act_record_rw_idx" ON "cokdb1"."score_act_record" USING btree ("rewardFlag");--> statement-breakpoint
CREATE INDEX "score_act_record_lv_idx" ON "cokdb1"."score_act_record" USING btree ("level");--> statement-breakpoint
CREATE INDEX "server_mail_record_index_uid" ON "cokdb1"."server_mail_record" USING btree ("uid","record","state");--> statement-breakpoint
CREATE INDEX "server_mail_record_index_record" ON "cokdb1"."server_mail_record" USING btree ("record","state");--> statement-breakpoint
CREATE INDEX "server_push_index_startTime" ON "cokdb1"."server_push" USING btree ("startTime");--> statement-breakpoint
CREATE INDEX "server_push_index_stateType" ON "cokdb1"."server_push" USING btree ("state","type");--> statement-breakpoint
CREATE INDEX "server_push_20141106_index_startTime" ON "cokdb1"."server_push_20141106" USING btree ("startTime");--> statement-breakpoint
CREATE INDEX "server_push_config_index_startTime" ON "cokdb1"."server_push_config" USING btree ("startTime");--> statement-breakpoint
CREATE INDEX "server_usermail_index_sendTime" ON "cokdb1"."server_usermail" USING btree ("sendTime");--> statement-breakpoint
CREATE INDEX "soccer_match_idx_sbt" ON "cokdb1"."soccer_match" USING btree ("startBetTime");--> statement-breakpoint
CREATE INDEX "soccer_match_idx_st" ON "cokdb1"."soccer_match" USING btree ("startTime");--> statement-breakpoint
CREATE INDEX "stat_adjust_index_query" ON "cokdb1"."stat_adjust" USING btree ("device","country","channel","campain");--> statement-breakpoint
CREATE INDEX "stat_af_index_af" ON "cokdb1"."stat_af" USING btree ("afuid");--> statement-breakpoint
CREATE INDEX "stat_af_index_query" ON "cokdb1"."stat_af" USING btree ("device","country","channel","campain");--> statement-breakpoint
CREATE INDEX "stat_login_index_timeStamp" ON "cokdb1"."stat_login" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_login_2024_0_index_timeStamp" ON "cokdb1"."stat_login_2024_0" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_login_2024_1_index_timeStamp" ON "cokdb1"."stat_login_2024_1" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_login_2024_10_index_timeStamp" ON "cokdb1"."stat_login_2024_10" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_login_2024_11_index_timeStamp" ON "cokdb1"."stat_login_2024_11" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_login_2024_2_index_timeStamp" ON "cokdb1"."stat_login_2024_2" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_login_2024_3_index_timeStamp" ON "cokdb1"."stat_login_2024_3" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_login_2024_4_index_timeStamp" ON "cokdb1"."stat_login_2024_4" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_login_2024_5_index_timeStamp" ON "cokdb1"."stat_login_2024_5" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_login_2024_6_index_timeStamp" ON "cokdb1"."stat_login_2024_6" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_login_2024_7_index_timeStamp" ON "cokdb1"."stat_login_2024_7" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_login_2024_8_index_timeStamp" ON "cokdb1"."stat_login_2024_8" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_login_2024_9_index_timeStamp" ON "cokdb1"."stat_login_2024_9" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_login_2026_9_index_timeStamp" ON "cokdb1"."stat_login_2026_9" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_phone_log_idx" ON "cokdb1"."stat_phone_log" USING btree ("uid","time");--> statement-breakpoint
CREATE INDEX "stat_reg_index_time_pf_country" ON "cokdb1"."stat_reg" USING btree ("time","pf","country");--> statement-breakpoint
CREATE INDEX "stat_reg_country_index" ON "cokdb1"."stat_reg" USING btree ("country");--> statement-breakpoint
CREATE INDEX "stat_tutorial_index_time" ON "cokdb1"."stat_tutorial" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_tutorial_index_tutorial" ON "cokdb1"."stat_tutorial" USING btree ("tutorial");--> statement-breakpoint
CREATE INDEX "stat_tutorial_analyze_index_time" ON "cokdb1"."stat_tutorial_analyze" USING btree ("time");--> statement-breakpoint
CREATE INDEX "stat_tutorial_analyze_index_tutorial" ON "cokdb1"."stat_tutorial_analyze" USING btree ("tutorial");--> statement-breakpoint
CREATE INDEX "stat_tutorial_v2_index_time" ON "cokdb1"."stat_tutorial_v2" USING btree ("time","appVersion");--> statement-breakpoint
CREATE INDEX "subscription_log_index_uid_itemId" ON "cokdb1"."subscription_log" USING btree ("uid","itemId");--> statement-breakpoint
CREATE INDEX "suggest_log_index" ON "cokdb1"."suggest_log" USING btree ("user","timeStamp");--> statement-breakpoint
CREATE INDEX "suggest_log_index_2" ON "cokdb1"."suggest_log" USING btree ("user");--> statement-breakpoint
CREATE INDEX "suggest_log_index_3" ON "cokdb1"."suggest_log" USING btree ("param1","param2");--> statement-breakpoint
CREATE INDEX "suggestion_ownerId" ON "cokdb1"."suggestion" USING btree ("ownerId");--> statement-breakpoint
CREATE INDEX "suit_decompose_effect_owner_suit" ON "cokdb1"."suit_decompose_effect" USING btree ("owner","suitid");--> statement-breakpoint
CREATE INDEX "super_army_log_createTime_index" ON "cokdb1"."super_army_log" USING btree ("createTime");--> statement-breakpoint
CREATE INDEX "super_army_log_uid_index" ON "cokdb1"."super_army_log" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "t_hero_Index_uid" ON "cokdb1"."t_hero" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "t_worldbossrank_Index_bossid" ON "cokdb1"."t_worldbossrank" USING btree ("bossid");--> statement-breakpoint
CREATE INDEX "territory_trap_log_allianceid_index" ON "cokdb1"."territory_trap_log" USING btree ("allianceid");--> statement-breakpoint
CREATE INDEX "territory_user_effect_alliance_idx" ON "cokdb1"."territory_user_effect" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "translation_index_content" ON "cokdb1"."translation" USING btree (substring("content" from 1 for 50));--> statement-breakpoint
CREATE INDEX "translationv2_index_en" ON "cokdb1"."translationv2" USING btree (substring("en" from 1 for 50));--> statement-breakpoint
CREATE INDEX "translationv2_index_zh-Hans" ON "cokdb1"."translationv2" USING btree (substring("zh-Hans" from 1 for 20));--> statement-breakpoint
CREATE INDEX "translationv2_index_zh-Hant" ON "cokdb1"."translationv2" USING btree (substring("zh-Hant" from 1 for 20));--> statement-breakpoint
CREATE INDEX "translationv2_index_ja" ON "cokdb1"."translationv2" USING btree (substring("ja" from 1 for 20));--> statement-breakpoint
CREATE INDEX "translationv2_index_ko" ON "cokdb1"."translationv2" USING btree (substring("ko" from 1 for 20));--> statement-breakpoint
CREATE INDEX "translationv2_index_ru" ON "cokdb1"."translationv2" USING btree (substring("ru" from 1 for 20));--> statement-breakpoint
CREATE INDEX "translationv2_index_es" ON "cokdb1"."translationv2" USING btree (substring("es" from 1 for 20));--> statement-breakpoint
CREATE INDEX "translationv2_index_ms" ON "cokdb1"."translationv2" USING btree (substring("ms" from 1 for 20));--> statement-breakpoint
CREATE INDEX "translationv2_index_fr" ON "cokdb1"."translationv2" USING btree (substring("fr" from 1 for 20));--> statement-breakpoint
CREATE INDEX "translationv2_index_de" ON "cokdb1"."translationv2" USING btree (substring("de" from 1 for 20));--> statement-breakpoint
CREATE INDEX "translationv2_index_it" ON "cokdb1"."translationv2" USING btree (substring("it" from 1 for 20));--> statement-breakpoint
CREATE INDEX "translationv2_index_pt" ON "cokdb1"."translationv2" USING btree (substring("pt" from 1 for 20));--> statement-breakpoint
CREATE INDEX "translationv2_index_count" ON "cokdb1"."translationv2" USING btree ("count");--> statement-breakpoint
CREATE INDEX "treasure_map_index_o_m" ON "cokdb1"."treasure_map" USING btree ("currentOwner","marchId");--> statement-breakpoint
CREATE INDEX "treasure_map_index_o_t" ON "cokdb1"."treasure_map" USING btree ("currentOwner","targetId");--> statement-breakpoint
CREATE INDEX "treasure_map_index_o_s_c" ON "cokdb1"."treasure_map" USING btree ("currentOwner","state","colour");--> statement-breakpoint
CREATE INDEX "trigger_var_type_key" ON "cokdb1"."trigger_var" USING btree ("type","key");--> statement-breakpoint
CREATE INDEX "trigger_var_uid" ON "cokdb1"."trigger_var" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "trigger_var_createTime" ON "cokdb1"."trigger_var" USING btree ("createTime");--> statement-breakpoint
CREATE INDEX "trigger_var_lastUpdateTime" ON "cokdb1"."trigger_var" USING btree ("lastUpdateTime");--> statement-breakpoint
CREATE INDEX "trouble_log_trouble_log_uid_index" ON "cokdb1"."trouble_log" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "turret_shooting_task_uuid_idx" ON "cokdb1"."turret_shooting_task" USING btree ("marchUuid");--> statement-breakpoint
CREATE INDEX "turret_shooting_task_startTime_idx" ON "cokdb1"."turret_shooting_task" USING btree ("startTime");--> statement-breakpoint
CREATE INDEX "turret_shooting_task_endTime_idx" ON "cokdb1"."turret_shooting_task" USING btree ("endTime");--> statement-breakpoint
CREATE INDEX "turret_shooting_task_uid_idx" ON "cokdb1"."turret_shooting_task" USING btree ("turretUid");--> statement-breakpoint
CREATE INDEX "user_14day_login_day_index" ON "cokdb1"."user_14day_login" USING btree ("day");--> statement-breakpoint
CREATE INDEX "user_alliance_task_id_idx" ON "cokdb1"."user_alliance_task" USING btree ("id");--> statement-breakpoint
CREATE INDEX "user_auction_goods_key_user_auction_goods_uid" ON "cokdb1"."user_auction_goods" USING btree ("uid");--> statement-breakpoint
CREATE UNIQUE INDEX "user_auction_history_unique_user_auction_history_uuid" ON "cokdb1"."user_auction_history" USING btree ("uuid");--> statement-breakpoint
CREATE INDEX "user_auction_history_key_user_auction_history_uid" ON "cokdb1"."user_auction_history" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "user_balance_history_0_uid_bank_type" ON "cokdb1"."user_balance_history_0" USING btree ("uid","bank_type");--> statement-breakpoint
CREATE INDEX "user_balance_history_0_time" ON "cokdb1"."user_balance_history_0" USING btree ("time");--> statement-breakpoint
CREATE INDEX "user_balance_history_1_uid_bank_type" ON "cokdb1"."user_balance_history_1" USING btree ("uid","bank_type");--> statement-breakpoint
CREATE INDEX "user_balance_history_1_time" ON "cokdb1"."user_balance_history_1" USING btree ("time");--> statement-breakpoint
CREATE INDEX "user_balance_history_2_uid_bank_type" ON "cokdb1"."user_balance_history_2" USING btree ("uid","bank_type");--> statement-breakpoint
CREATE INDEX "user_balance_history_2_time" ON "cokdb1"."user_balance_history_2" USING btree ("time");--> statement-breakpoint
CREATE INDEX "user_balance_history_3_uid_bank_type" ON "cokdb1"."user_balance_history_3" USING btree ("uid","bank_type");--> statement-breakpoint
CREATE INDEX "user_balance_history_3_time" ON "cokdb1"."user_balance_history_3" USING btree ("time");--> statement-breakpoint
CREATE INDEX "user_balance_history_4_uid_bank_type" ON "cokdb1"."user_balance_history_4" USING btree ("uid","bank_type");--> statement-breakpoint
CREATE INDEX "user_balance_history_4_time" ON "cokdb1"."user_balance_history_4" USING btree ("time");--> statement-breakpoint
CREATE INDEX "user_balance_history_5_uid_bank_type" ON "cokdb1"."user_balance_history_5" USING btree ("uid","bank_type");--> statement-breakpoint
CREATE INDEX "user_balance_history_5_time" ON "cokdb1"."user_balance_history_5" USING btree ("time");--> statement-breakpoint
CREATE INDEX "user_balance_history_6_uid_bank_type" ON "cokdb1"."user_balance_history_6" USING btree ("uid","bank_type");--> statement-breakpoint
CREATE INDEX "user_balance_history_6_time" ON "cokdb1"."user_balance_history_6" USING btree ("time");--> statement-breakpoint
CREATE INDEX "user_balance_history_7_uid_bank_type" ON "cokdb1"."user_balance_history_7" USING btree ("uid","bank_type");--> statement-breakpoint
CREATE INDEX "user_balance_history_7_time" ON "cokdb1"."user_balance_history_7" USING btree ("time");--> statement-breakpoint
CREATE INDEX "user_balance_history_8_uid_bank_type" ON "cokdb1"."user_balance_history_8" USING btree ("uid","bank_type");--> statement-breakpoint
CREATE INDEX "user_balance_history_8_time" ON "cokdb1"."user_balance_history_8" USING btree ("time");--> statement-breakpoint
CREATE INDEX "user_balance_history_9_uid_bank_type" ON "cokdb1"."user_balance_history_9" USING btree ("uid","bank_type");--> statement-breakpoint
CREATE INDEX "user_balance_history_9_time" ON "cokdb1"."user_balance_history_9" USING btree ("time");--> statement-breakpoint
CREATE INDEX "user_bet_idx_uid" ON "cokdb1"."user_bet" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "user_bet_idx_mid" ON "cokdb1"."user_bet" USING btree ("matchId");--> statement-breakpoint
CREATE INDEX "user_bet_idx_e" ON "cokdb1"."user_bet" USING btree ("ended");--> statement-breakpoint
CREATE INDEX "user_bet_idx_r" ON "cokdb1"."user_bet" USING btree ("rewarded");--> statement-breakpoint
CREATE INDEX "user_branch_city_reward_uid_id_index" ON "cokdb1"."user_branch_city_reward" USING btree ("uid","id");--> statement-breakpoint
CREATE INDEX "user_building_ub_uid_index" ON "cokdb1"."user_building" USING btree ("uid","itemId");--> statement-breakpoint
CREATE INDEX "user_building_item_index" ON "cokdb1"."user_building" USING btree ("itemId");--> statement-breakpoint
CREATE INDEX "user_building_itemId_level_index" ON "cokdb1"."user_building" USING btree ("itemId","level");--> statement-breakpoint
CREATE INDEX "user_building_itemId_star_index" ON "cokdb1"."user_building" USING btree ("itemId","star");--> statement-breakpoint
CREATE INDEX "user_building_bak_ub_uid_index" ON "cokdb1"."user_building_bak" USING btree ("uid","itemId");--> statement-breakpoint
CREATE INDEX "user_building_bak_item_index" ON "cokdb1"."user_building_bak" USING btree ("itemId");--> statement-breakpoint
CREATE INDEX "user_cross_fight_history_user_startTime" ON "cokdb1"."user_cross_fight_history" USING btree ("uid","startTime");--> statement-breakpoint
CREATE INDEX "user_cross_fight_history_startTime" ON "cokdb1"."user_cross_fight_history" USING btree ("startTime");--> statement-breakpoint
CREATE INDEX "user_dragon_uid_index" ON "cokdb1"."user_dragon" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "user_equip_index_uid_on" ON "cokdb1"."user_equip" USING btree ("uid","on");--> statement-breakpoint
CREATE INDEX "user_equip_bak_index_uid_on" ON "cokdb1"."user_equip_bak" USING btree ("uid","on");--> statement-breakpoint
CREATE INDEX "user_general_uid_index_001" ON "cokdb1"."user_general" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "user_gold_wheel_histo_uid" ON "cokdb1"."user_gold_wheel_histo" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "user_hero_ownerUid_index" ON "cokdb1"."user_hero" USING btree ("ownerUid");--> statement-breakpoint
CREATE INDEX "user_item_uitem_ownerId_index" ON "cokdb1"."user_item" USING btree ("ownerId","itemId","value");--> statement-breakpoint
CREATE INDEX "user_item_bak_uitem_ownerId_index" ON "cokdb1"."user_item_bak" USING btree ("ownerId","itemId","value");--> statement-breakpoint
CREATE INDEX "user_login_ip_index_uid_count" ON "cokdb1"."user_login_ip" USING btree ("uid","count");--> statement-breakpoint
CREATE INDEX "user_military_military_score_index" ON "cokdb1"."user_military" USING btree ("score");--> statement-breakpoint
CREATE INDEX "user_military_military_exp_index" ON "cokdb1"."user_military" USING btree ("exp");--> statement-breakpoint
CREATE INDEX "user_military_rank_index_militaryScore" ON "cokdb1"."user_military_rank" USING btree ("militaryScore");--> statement-breakpoint
CREATE INDEX "user_military_rank_index_rankingExp" ON "cokdb1"."user_military_rank" USING btree ("rankingExp");--> statement-breakpoint
CREATE INDEX "user_mine_index_fId" ON "cokdb1"."user_mine" USING btree ("fId");--> statement-breakpoint
CREATE INDEX "user_mixed_info_protectEndTime" ON "cokdb1"."user_mixed_info" USING btree ("protectEndTime");--> statement-breakpoint
CREATE INDEX "user_mixed_info_protectEndSendTimes" ON "cokdb1"."user_mixed_info" USING btree ("protectEndSendTimes");--> statement-breakpoint
CREATE INDEX "user_monster_siege_state_index" ON "cokdb1"."user_monster_siege" USING btree ("state");--> statement-breakpoint
CREATE INDEX "user_monster_siege_data_state_index" ON "cokdb1"."user_monster_siege_data" USING btree ("state");--> statement-breakpoint
CREATE INDEX "user_new_resource_log_uid_index" ON "cokdb1"."user_new_resource_log" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "user_pet_dragon_index_uid" ON "cokdb1"."user_pet_dragon" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "user_pet_dragon_skill_uid" ON "cokdb1"."user_pet_dragon_skill" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "user_pray_count_idx" ON "cokdb1"."user_pray" USING btree ("prayCount");--> statement-breakpoint
CREATE INDEX "user_pray_date_idx" ON "cokdb1"."user_pray" USING btree ("lastPrayTime");--> statement-breakpoint
CREATE INDEX "user_push_userId" ON "cokdb1"."user_push" USING btree (left("userId", 255));--> statement-breakpoint
CREATE INDEX "user_report_uid" ON "cokdb1"."user_report" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "user_report_target_uid" ON "cokdb1"."user_report" USING btree ("target_uid");--> statement-breakpoint
CREATE INDEX "user_report_time" ON "cokdb1"."user_report" USING btree ("time");--> statement-breakpoint
CREATE INDEX "user_resource_record_uid_idx" ON "cokdb1"."user_resource_record" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "user_resource_record_item_idx" ON "cokdb1"."user_resource_record" USING btree ("itemId");--> statement-breakpoint
CREATE INDEX "user_science_Index_ownerId" ON "cokdb1"."user_science" USING btree ("uid","itemId");--> statement-breakpoint
CREATE INDEX "user_score_index_actId" ON "cokdb1"."user_score" USING btree ("actId");--> statement-breakpoint
CREATE INDEX "user_score_bak_index_actId" ON "cokdb1"."user_score_bak" USING btree ("actId");--> statement-breakpoint
CREATE INDEX "user_skill_ownerId_index" ON "cokdb1"."user_skill" USING btree ("ownerId");--> statement-breakpoint
CREATE INDEX "user_skill_starttime_index" ON "cokdb1"."user_skill" USING btree ("startTime");--> statement-breakpoint
CREATE INDEX "user_skill_endtime_index" ON "cokdb1"."user_skill" USING btree ("endTime");--> statement-breakpoint
CREATE INDEX "user_state_index_uid_type2" ON "cokdb1"."user_state" USING btree ("uid","type2");--> statement-breakpoint
CREATE INDEX "user_state_index_uid_stateId" ON "cokdb1"."user_state" USING btree ("uid","stateId");--> statement-breakpoint
CREATE INDEX "user_state_index_stateId" ON "cokdb1"."user_state" USING btree ("stateId");--> statement-breakpoint
CREATE INDEX "user_territory_resource_al_idx" ON "cokdb1"."user_territory_resource" USING btree ("allianceId");--> statement-breakpoint
CREATE INDEX "user_thumbup_type" ON "cokdb1"."user_thumbup" USING btree ("type");--> statement-breakpoint
CREATE INDEX "user_true_info_bind_uid, trueInfo" ON "cokdb1"."user_true_info_bind" USING btree ("uid","trueInfo");--> statement-breakpoint
CREATE INDEX "userprofile_name_index" ON "cokdb1"."userprofile" USING btree ("name");--> statement-breakpoint
CREATE INDEX "userprofile_time_level_index" ON "cokdb1"."userprofile" USING btree ("regTime","level","lastOnlineTime","pf");--> statement-breakpoint
CREATE INDEX "userprofile_allianceid_lasttime_index" ON "cokdb1"."userprofile" USING btree ("allianceId","lastOnlineTime");--> statement-breakpoint
CREATE INDEX "userprofile_lang_index" ON "cokdb1"."userprofile" USING btree ("lang");--> statement-breakpoint
CREATE INDEX "userprofile_deviceId" ON "cokdb1"."userprofile" USING btree ("deviceId");--> statement-breakpoint
CREATE INDEX "userprofile_index_crossServerId" ON "cokdb1"."userprofile" USING btree ("crossFightSrcServerId");--> statement-breakpoint
CREATE INDEX "userprofile_active_uid" ON "cokdb1"."userprofile_active" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "userprofile_bak_name_index" ON "cokdb1"."userprofile_bak" USING btree ("name");--> statement-breakpoint
CREATE INDEX "userprofile_bak_time_level_index" ON "cokdb1"."userprofile_bak" USING btree ("regTime","level","lastOnlineTime","pf");--> statement-breakpoint
CREATE INDEX "userprofile_bak_allianceid_lasttime_index" ON "cokdb1"."userprofile_bak" USING btree ("allianceId","lastOnlineTime");--> statement-breakpoint
CREATE INDEX "userprofile_bak_lang_index" ON "cokdb1"."userprofile_bak" USING btree ("lang");--> statement-breakpoint
CREATE INDEX "userprofile_del_name_index" ON "cokdb1"."userprofile_del" USING btree ("name");--> statement-breakpoint
CREATE INDEX "userprofile_del_time_level_index" ON "cokdb1"."userprofile_del" USING btree ("regTime","level","lastOnlineTime","pf");--> statement-breakpoint
CREATE INDEX "userprofile_del_allianceid_lasttime_index" ON "cokdb1"."userprofile_del" USING btree ("allianceId","lastOnlineTime");--> statement-breakpoint
CREATE INDEX "userprofile_del_lang_index" ON "cokdb1"."userprofile_del" USING btree ("lang");--> statement-breakpoint
CREATE INDEX "world_barbarion_dead_dead_res_time" ON "cokdb1"."world_barbarion_dead" USING btree ("deadFinishTime");--> statement-breakpoint
CREATE INDEX "world_barbarion_dead_areaId_index" ON "cokdb1"."world_barbarion_dead" USING btree ("areaId");--> statement-breakpoint
CREATE INDEX "world_basttile_dead_dead_res_time" ON "cokdb1"."world_basttile_dead" USING btree ("deadFinishTime");--> statement-breakpoint
CREATE INDEX "world_basttile_dead_areaId_index" ON "cokdb1"."world_basttile_dead" USING btree ("areaId");--> statement-breakpoint
CREATE INDEX "world_favorite_time_idx" ON "cokdb1"."world_favorite" USING btree ("createTime");--> statement-breakpoint
CREATE INDEX "world_field_monster_dead_dead_monster_time" ON "cokdb1"."world_field_monster_dead" USING btree ("deadFinishTime");--> statement-breakpoint
CREATE INDEX "world_march_ownerId_index_001" ON "cokdb1"."world_march" USING btree ("ownerUid");--> statement-breakpoint
CREATE INDEX "world_march_targetUid_index" ON "cokdb1"."world_march" USING btree ("targetUid");--> statement-breakpoint
CREATE INDEX "world_res_dead_dead_res_time" ON "cokdb1"."world_res_dead" USING btree ("deadFinishTime");--> statement-breakpoint
CREATE INDEX "world_res_dead_areaId_index" ON "cokdb1"."world_res_dead" USING btree ("areaId");--> statement-breakpoint
CREATE INDEX "world_res_new_dead_dead_res_time" ON "cokdb1"."world_res_new_dead" USING btree ("deadFinishTime");--> statement-breakpoint
CREATE INDEX "world_res_new_dead_areaId_index" ON "cokdb1"."world_res_new_dead" USING btree ("areaId");--> statement-breakpoint
CREATE INDEX "worldpoint_world_res_area_id" ON "cokdb1"."worldpoint" USING btree ("areaId","gridType");--> statement-breakpoint
CREATE INDEX "worldpoint_world_monster_area_id" ON "cokdb1"."worldpoint" USING btree ("monsterAreaId","pointType","gridType","ownerId","grid2Type");--> statement-breakpoint
CREATE INDEX "worldpoint_world_pointType_flushTime_index" ON "cokdb1"."worldpoint" USING btree ("pointType","pointItem","flushTime","gridType","grid2Type");--> statement-breakpoint
CREATE INDEX "worldpoint_world_xy_type_country_index" ON "cokdb1"."worldpoint" USING btree ("x","y","pointType");--> statement-breakpoint
CREATE INDEX "worldpoint_worldId_pointType_gridType_grid2Type" ON "cokdb1"."worldpoint" USING btree ("worldId","pointType","gridType","grid2Type");