CREATE SCHEMA "cokdb_global";
--> statement-breakpoint
CREATE SCHEMA "cokdb_pay";
--> statement-breakpoint
CREATE SCHEMA "opencok_chat";
--> statement-breakpoint
CREATE SEQUENCE "opencok_chat"."chat_message_sequence_id_seq" INCREMENT BY 1 MINVALUE -9223372036854775807 MAXVALUE 9223372036854775807 START WITH -9223372036854775807 CACHE 1;--> statement-breakpoint
CREATE TABLE "cokdb_global"."account_device_mapping" (
	"gameUid" varchar(100) NOT NULL,
	"deviceId" varchar(200) NOT NULL,
	"type" integer,
	"time" bigint,
	CONSTRAINT "account_device_mapping_PRIMARY" PRIMARY KEY("gameUid","deviceId")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."account_new" (
	"gameUid" varchar(100) DEFAULT '' NOT NULL,
	"server" varchar(40) NOT NULL,
	"uuid" varchar(100) NOT NULL,
	"deviceId" varchar(200),
	"gaid" varchar(40),
	"country" varchar(40),
	"emailAccount" varchar(200),
	"googleAccount" varchar(200),
	"googleAccountName" varchar(200),
	"facebookAccount" varchar(200),
	"facebookAccountName" varchar(200),
	"pf" varchar(20),
	"pfId" varchar(40),
	"gameUserName" varchar(200),
	"gameUserLevel" integer NOT NULL,
	"lastTime" bigint NOT NULL,
	"emailConfirm" integer DEFAULT 0,
	"passmd5" varchar(40) DEFAULT '',
	"active" integer DEFAULT 0,
	CONSTRAINT "account_new_PRIMARY" PRIMARY KEY("gameUid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."account_new_oldbigone" (
	"gameUid" varchar(100) NOT NULL,
	"server" varchar(40) NOT NULL,
	"uuid" varchar(100) NOT NULL,
	"deviceId" varchar(200),
	"gaid" varchar(40),
	"country" varchar(40),
	"emailAccount" varchar(200),
	"googleAccount" varchar(200),
	"googleAccountName" varchar(200),
	"facebookAccount" varchar(200),
	"facebookAccountName" varchar(200),
	"pf" varchar(20),
	"pfId" varchar(40),
	"gameUserName" varchar(200),
	"gameUserLevel" integer NOT NULL,
	"lastTime" bigint NOT NULL,
	"emailConfirm" integer DEFAULT 0,
	"passmd5" varchar(40),
	"active" integer DEFAULT 0,
	CONSTRAINT "account_new_oldbigone_PRIMARY" PRIMARY KEY("gameUid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."activation" (
	"code" varchar(40) NOT NULL,
	"series" integer,
	"type" integer DEFAULT 0,
	"user" varchar(40),
	"useTime" bigint,
	"state" integer DEFAULT 0,
	"timeId" integer DEFAULT 0,
	"count" integer DEFAULT 0,
	CONSTRAINT "activation_PRIMARY" PRIMARY KEY("code")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."activation_bak" (
	"code" varchar(40) NOT NULL,
	"series" integer,
	"user" varchar(40),
	"state" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."activation_config" (
	"seriesId" integer NOT NULL,
	"title" "bytea",
	"contents" "bytea",
	"reward" "bytea",
	"num" integer,
	"proUser" varchar(40),
	"type" integer DEFAULT 0,
	"count" integer DEFAULT 0,
	"beginTime" bigint DEFAULT 0,
	"endTime" bigint DEFAULT 0,
	"regStart" bigint DEFAULT 0,
	"regEnd" bigint DEFAULT 0,
	"country" varchar(256) DEFAULT '',
	"bLvMin" integer DEFAULT 0,
	"bLvMax" integer DEFAULT 0,
	"uLvMin" integer DEFAULT 0,
	"uLvMax" integer DEFAULT 0,
	"powerMin" bigint DEFAULT 0,
	"powerMax" bigint DEFAULT 0,
	"payGold" integer DEFAULT 0,
	"deviceLimit" integer DEFAULT 0,
	CONSTRAINT "activation_config_PRIMARY" PRIMARY KEY("seriesId"),
	CONSTRAINT "activation_config_title_length" CHECK (octet_length("title") <= 65535),
	CONSTRAINT "activation_config_contents_length" CHECK (octet_length("contents") <= 65535),
	CONSTRAINT "activation_config_reward_length" CHECK (octet_length("reward") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."activation_device_record" (
	"code" varchar(40) NOT NULL,
	"deviceId" varchar(255) DEFAULT '' NOT NULL,
	CONSTRAINT "activation_device_record_PRIMARY" PRIMARY KEY("code","deviceId")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."activity" (
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
CREATE TABLE "cokdb_global"."adcost" (
	"date" text NOT NULL,
	"googleplay" numeric(12, 2),
	"facebook" numeric(12, 2),
	"cn" numeric(12, 2),
	"kr" numeric(12, 2),
	"jp" numeric(12, 2),
	"th" numeric(12, 2),
	"ru" numeric(12, 2),
	"tw" numeric(12, 2),
	CONSTRAINT "adcost_PRIMARY" PRIMARY KEY("date"),
	CONSTRAINT "adcost_date_temporal" CHECK (("date" IS NULL OR (CASE WHEN "date" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01])$' THEN CASE WHEN left("date",4) <> '0000' AND substring("date",6,2) <> '00' AND substring("date",9,2) <> '00' THEN to_char(to_date(left("date",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("date",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."addata" (
	"device" varchar(100) DEFAULT '' NOT NULL,
	"time" bigint DEFAULT 0,
	"tracker" varchar(200),
	"country" varchar(10),
	"data" "bytea",
	CONSTRAINT "addata_PRIMARY" PRIMARY KEY("device"),
	CONSTRAINT "addata_data_length" CHECK (octet_length("data") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."admin_audit_log" (
	"serial_id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_global"."admin_audit_log_serial_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"adminname" varchar(50) NOT NULL,
	"target_uid" varchar(50) DEFAULT '' NOT NULL,
	"target_server" varchar(8),
	"action_type" smallint NOT NULL,
	"action_detail" varchar(2000) DEFAULT '' NOT NULL,
	"ip" varchar(24) DEFAULT '0' NOT NULL,
	"create_time" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "admin_audit_log_PRIMARY" PRIMARY KEY("serial_id"),
	CONSTRAINT "admin_audit_log_action_type_range" CHECK ("action_type" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."adreward" (
	"device" varchar(100) DEFAULT '' NOT NULL,
	"time" bigint DEFAULT 0 NOT NULL,
	"reward" varchar(200),
	"user" varchar(40),
	"state" integer DEFAULT 0,
	"sendTime" bigint,
	"tryTimes" integer DEFAULT 0,
	CONSTRAINT "adreward_PRIMARY" PRIMARY KEY("device","time")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."alliance" (
	"allianceId" varchar(100) NOT NULL,
	"alliancename" varchar(255),
	"serverId" integer,
	CONSTRAINT "alliance_PRIMARY" PRIMARY KEY("allianceId")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."auction" (
	"uuid" varchar(255) DEFAULT '' NOT NULL,
	"groupId" integer NOT NULL,
	"cfgId" varchar(30) NOT NULL,
	"itemId" varchar(20) NOT NULL,
	"num" integer NOT NULL,
	"color" integer NOT NULL,
	"endTime" bigint NOT NULL,
	"zoneId" integer,
	"uid" varchar(255),
	"name" varchar(255),
	"price" integer NOT NULL,
	"add" integer NOT NULL,
	"decision" integer NOT NULL,
	"end" integer NOT NULL,
	"type" integer NOT NULL,
	CONSTRAINT "auction_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."auction_activity" (
	"id" integer DEFAULT 0 NOT NULL,
	"startTime" bigint NOT NULL,
	"endTime" bigint NOT NULL,
	CONSTRAINT "auction_activity_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."auction_history" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"uuid" varchar(255) DEFAULT '' NOT NULL,
	"groupId" integer,
	"name" varchar(255) NOT NULL,
	"itemId" varchar(20) NOT NULL,
	"itemNum" integer NOT NULL,
	"price" integer,
	"time" bigint NOT NULL,
	CONSTRAINT "auction_history_PRIMARY" PRIMARY KEY("uid","uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."auction_server_group" (
	"id" integer NOT NULL,
	"zoneIdStr" varchar(2000) NOT NULL,
	CONSTRAINT "auction_server_group_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."ban_move_set" (
	"country" varchar(256),
	"pf" varchar(255),
	"serverPf" varchar(255),
	"sid" varchar(255),
	"val" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."ban_record" (
	"uuid" varchar(40) NOT NULL,
	"serverId" integer NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"time" bigint DEFAULT 0,
	"operator" varchar(40),
	"reason" varchar(250),
	"opDate" varchar(20) DEFAULT '',
	CONSTRAINT "ban_record_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."bantime_reason" (
	"serverId" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(200) DEFAULT '' NOT NULL,
	"operator" varchar(40),
	"reason" varchar(250),
	"opeDate" varchar(20) DEFAULT '',
	"status" integer DEFAULT 0,
	CONSTRAINT "bantime_reason_PRIMARY" PRIMARY KEY("serverId","uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."banwordrecord" (
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"server" integer NOT NULL,
	"banTimes" integer DEFAULT 0,
	CONSTRAINT "banwordrecord_PRIMARY" PRIMARY KEY("uid","server")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."charge_activity" (
	"uuid" varchar(255) DEFAULT '' NOT NULL,
	"exchangeId" varchar(255),
	"startTime" bigint,
	"rewardTime" bigint,
	"buyEndTime" bigint,
	"buyCount" integer,
	"maxBuyCount" integer,
	"rewardStatus" integer,
	"round" integer,
	CONSTRAINT "charge_activity_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."cn_regpay" (
	"date" integer NOT NULL,
	"pf" varchar(40) DEFAULT '' NOT NULL,
	"dau" integer DEFAULT 0 NOT NULL,
	"reg" integer DEFAULT 0,
	"payucnt" integer DEFAULT 0,
	"paysum" integer DEFAULT 0,
	CONSTRAINT "cn_regpay_PRIMARY" PRIMARY KEY("date","pf")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."cn_regpay_accumulative" (
	"date" integer NOT NULL,
	"pf" varchar(40) DEFAULT '' NOT NULL,
	"reg" integer DEFAULT 0,
	"payucnt" integer DEFAULT 0,
	"paysum" integer DEFAULT 0,
	CONSTRAINT "cn_regpay_accumulative_PRIMARY" PRIMARY KEY("date","pf")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."cross_throne_king_info" (
	"uuid" varchar(50) NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"king_type" integer DEFAULT 0 NOT NULL,
	"config_type" integer DEFAULT 0 NOT NULL,
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
	CONSTRAINT "cross_throne_king_info_PRIMARY" PRIMARY KEY("config_type","king_type","version")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."cross_throne_occupy_record" (
	"uuid" varchar(50) DEFAULT '' NOT NULL,
	"king_info_id" varchar(50) DEFAULT '' NOT NULL,
	"uid" varchar(50),
	"name" varchar(50),
	"alliance_abbr" varchar(50),
	"server_id" integer,
	"kingdom_name" varchar(50),
	"start_millis" bigint,
	CONSTRAINT "cross_throne_occupy_record_PRIMARY" PRIMARY KEY("king_info_id","uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."cross_throne_reward_record" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_global"."cross_throne_reward_record_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 10 CACHE 1),
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
	"overlord_type" integer NOT NULL,
	CONSTRAINT "cross_throne_reward_record_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "cross_throne_reward_record_reward_type_range" CHECK ("reward_type" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."exchange" (
	"orderId" varchar(200) NOT NULL,
	"pf" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."exchange_log" (
	"Id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_global"."exchange_log_Id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 64 CACHE 1),
	"orderId" varchar(255) DEFAULT '' NOT NULL,
	"uid" varchar(255) DEFAULT '' NOT NULL,
	"productId" varchar(255) DEFAULT '' NOT NULL,
	CONSTRAINT "exchange_log_PRIMARY" PRIMARY KEY("Id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."exchange_top" (
	"serverId" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "exchange_top_PRIMARY" PRIMARY KEY("serverId")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."fb_bind" (
	"fbid" bigint NOT NULL,
	"time" bigint NOT NULL,
	CONSTRAINT "fb_bind_PRIMARY" PRIMARY KEY("fbid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."fb_friend" (
	"fid" bigint NOT NULL,
	"tid" bigint NOT NULL,
	"tserver" integer,
	"tuid" varchar(40),
	"time" bigint,
	CONSTRAINT "fb_friend_PRIMARY" PRIMARY KEY("fid","tid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."fb_invite" (
	"fid" bigint NOT NULL,
	"tid" bigint NOT NULL,
	"time" bigint NOT NULL,
	CONSTRAINT "fb_invite_PRIMARY" PRIMARY KEY("fid","tid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."fight_arena_info" (
	"worldId" integer NOT NULL,
	"state" integer,
	"endTime" bigint,
	"version" integer,
	CONSTRAINT "fight_arena_info_PRIMARY" PRIMARY KEY("worldId")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."formation_info" (
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
CREATE TABLE "cokdb_global"."gashrequest" (
	"tradeid" bigint NOT NULL,
	"method" varchar(20),
	"orderinfo" varchar(200),
	"amount" integer,
	"trans" "bytea",
	"state" integer,
	CONSTRAINT "gashrequest_PRIMARY" PRIMARY KEY("tradeid"),
	CONSTRAINT "gashrequest_trans_length" CHECK (octet_length("trans") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."gashsuccess" (
	"tradeid" bigint NOT NULL,
	"finishTime" bigint NOT NULL,
	"type" varchar(20),
	"confirm" integer DEFAULT 0,
	CONSTRAINT "gashsuccess_PRIMARY" PRIMARY KEY("tradeid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."global_paylog" (
	"sid" integer NOT NULL,
	"uid" varchar(40) NOT NULL,
	"orderId" varchar(200) NOT NULL,
	"pf" varchar(20) NOT NULL,
	"productId" varchar(10) DEFAULT '0' NOT NULL,
	"orderInfo" varchar(200),
	"orderParam" "bytea",
	"time" bigint,
	"currency" integer DEFAULT 0,
	"spend" numeric(10, 2) DEFAULT 0.00 NOT NULL,
	"paid" numeric(10, 2) DEFAULT 0.00,
	"status" integer DEFAULT 0,
	"payLevel" integer NOT NULL,
	"buildingLv" integer,
	"receiverId" varchar(40),
	"deviceId" varchar(255),
	"ip" varchar(20) DEFAULT '',
	CONSTRAINT "global_paylog_PRIMARY" PRIMARY KEY("sid","uid","orderId","pf"),
	CONSTRAINT "global_paylog_orderParam_length" CHECK (octet_length("orderParam") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."gold_group" (
	"itemId" integer DEFAULT 0 NOT NULL,
	"num" bigint DEFAULT 0 NOT NULL,
	"startTime" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "gold_group_PRIMARY" PRIMARY KEY("itemId","startTime")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."hero_kingdom_activity" (
	"uuid" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_global"."hero_kingdom_activity_uuid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 9000003 CACHE 1),
	"sid" integer,
	"delay" varchar(255),
	"power" varchar(255),
	CONSTRAINT "hero_kingdom_activity_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."logging_event" (
	"timestmp" bigint NOT NULL,
	"formatted_message" text NOT NULL,
	"logger_name" varchar(254) NOT NULL,
	"level_string" varchar(254) NOT NULL,
	"thread_name" varchar(254),
	"reference_flag" smallint,
	"arg0" varchar(254),
	"arg1" varchar(254),
	"arg2" varchar(254),
	"arg3" varchar(254),
	"caller_filename" varchar(254) NOT NULL,
	"caller_class" varchar(254) NOT NULL,
	"caller_method" varchar(254) NOT NULL,
	"caller_line" varchar(4) NOT NULL,
	"event_id" bigint GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_global"."logging_event_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	CONSTRAINT "logging_event_PRIMARY" PRIMARY KEY("event_id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."logging_event_exception" (
	"event_id" bigint NOT NULL,
	"i" smallint NOT NULL,
	"trace_line" varchar(1024) NOT NULL,
	CONSTRAINT "logging_event_exception_PRIMARY" PRIMARY KEY("event_id","i")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."logging_event_property" (
	"event_id" bigint NOT NULL,
	"mapped_key" varchar(254) NOT NULL,
	"mapped_value" text,
	CONSTRAINT "logging_event_property_PRIMARY" PRIMARY KEY("event_id","mapped_key")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."logging_event_stat" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_global"."logging_event_stat_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"count" integer DEFAULT 0,
	"time" bigint DEFAULT 0,
	CONSTRAINT "logging_event_stat_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."mail_gift_log" (
	"uid" varchar(40) NOT NULL,
	"fromUid" varchar(40),
	"fromName" varchar(200),
	"toUid" varchar(40),
	"toName" varchar(200),
	"contents" "bytea",
	"rewards" varchar(1000),
	"isOpened" smallint,
	"isRewarded" smallint,
	"isThanks" smallint,
	"sendTime" bigint DEFAULT 0 NOT NULL,
	"receiveTime" bigint,
	CONSTRAINT "mail_gift_log_PRIMARY" PRIMARY KEY("uid","sendTime"),
	CONSTRAINT "mail_gift_log_contents_length" CHECK (octet_length("contents") <= 65535),
	CONSTRAINT "mail_gift_log_isOpened_range" CHECK ("isOpened" BETWEEN -128 AND 127),
	CONSTRAINT "mail_gift_log_isRewarded_range" CHECK ("isRewarded" BETWEEN -128 AND 127),
	CONSTRAINT "mail_gift_log_isThanks_range" CHECK ("isThanks" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."mod_info" (
	"uid" varchar(100) NOT NULL,
	"lang" varchar(40) NOT NULL,
	"server" varchar(255),
	CONSTRAINT "mod_info_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."monitor_test" (
	"id" bigint GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_global"."monitor_test_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"value" varchar(255),
	CONSTRAINT "monitor_test_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_0" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_0_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_1" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_1_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_10" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_10_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_11" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_11_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_12" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_12_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_2" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_2_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_3" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_3_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_4" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_4_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_5" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_5_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_6" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_6_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_7" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_7_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_8" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_8_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_9" (
	"uuid" varchar(40) DEFAULT '' NOT NULL,
	"uid" varchar(40) DEFAULT '' NOT NULL,
	"name" varchar(40),
	"src" integer NOT NULL,
	"dst" integer NOT NULL,
	"time" bigint,
	CONSTRAINT "move_server_record_2024_9_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."mycardrequest" (
	"factradeseq" varchar(40) NOT NULL,
	"authcode" varchar(200) NOT NULL,
	"method" varchar(20),
	"methodparam" varchar(10),
	"tradeseq" varchar(200),
	"orderInfo" varchar(300) NOT NULL,
	"amount" integer NOT NULL,
	"state" integer DEFAULT 0,
	CONSTRAINT "mycardrequest_PRIMARY" PRIMARY KEY("factradeseq")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."mycardsuccess" (
	"tradeseq" varchar(200) NOT NULL,
	"mycardid" varchar(200) NOT NULL,
	"time" bigint NOT NULL,
	"type" varchar(20),
	"fulldata" "bytea" NOT NULL,
	"state" integer DEFAULT 0,
	CONSTRAINT "mycardsuccess_PRIMARY" PRIMARY KEY("tradeseq"),
	CONSTRAINT "mycardsuccess_fulldata_length" CHECK (octet_length("fulldata") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."neutral_server_info" (
	"serverId" integer NOT NULL,
	"groupId" integer NOT NULL,
	"stateId" integer DEFAULT 0 NOT NULL,
	"startTime" bigint DEFAULT 0,
	"endTime" bigint DEFAULT 0,
	"ownerServerId" integer DEFAULT 0,
	"open" smallint DEFAULT 0,
	"resType" integer DEFAULT 0,
	"awardTime" bigint,
	"isKickFinish" integer,
	"resTypeList" varchar(255),
	CONSTRAINT "neutral_server_info_PRIMARY" PRIMARY KEY("serverId"),
	CONSTRAINT "neutral_server_info_open_range" CHECK ("open" BETWEEN -128 AND 127)
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."new_expedition" (
	"uuid" varchar(40) NOT NULL,
	"state" integer DEFAULT 0,
	"startTime" bigint DEFAULT 0,
	"endTime" bigint DEFAULT 0,
	"count" integer DEFAULT 0,
	CONSTRAINT "new_expedition_PRIMARY" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."new_recall_relation" (
	"activeUid" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."outer_mail" (
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
	"addr" "bytea",
	CONSTRAINT "outer_mail_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "outer_mail_title_length" CHECK (octet_length("title") <= 65535),
	CONSTRAINT "outer_mail_contents_length" CHECK (octet_length("contents") <= 65535),
	CONSTRAINT "outer_mail_reward_length" CHECK (octet_length("reward") <= 65535),
	CONSTRAINT "outer_mail_addr_length" CHECK (octet_length("addr") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."pay_lottery" (
	"uid" varchar(255),
	"remainGold" integer,
	"startTime" integer,
	"endTime" integer,
	"count" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."pay_switch" (
	"Id" integer NOT NULL,
	"status" integer,
	"time" text
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."paylog_tmp" (
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
	"buildingLv" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."paylog_tmp_2" (
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
	"buildingLv" integer DEFAULT 0,
	"receiverId" varchar(40)
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."push_137" (
	"id" smallint NOT NULL,
	"time" smallint DEFAULT 0,
	"title" "bytea",
	"contents" "bytea",
	"reward" "bytea",
	"notification" "bytea",
	CONSTRAINT "push_137_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "push_137_id_range" CHECK ("id" BETWEEN -128 AND 127),
	CONSTRAINT "push_137_title_length" CHECK (octet_length("title") <= 65535),
	CONSTRAINT "push_137_contents_length" CHECK (octet_length("contents") <= 65535),
	CONSTRAINT "push_137_reward_length" CHECK (octet_length("reward") <= 65535),
	CONSTRAINT "push_137_notification_length" CHECK (octet_length("notification") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."repeat_name" (
	"gameUid" varchar(255) NOT NULL,
	"gameUserName" varchar(255) NOT NULL,
	"server" varchar(40),
	"minServer" varchar(40),
	CONSTRAINT "repeat_name_PRIMARY" PRIMARY KEY("gameUid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."risk_setting" (
	"id" varchar(40) NOT NULL,
	"k1" integer,
	"k2" integer,
	"k3" integer,
	CONSTRAINT "risk_setting_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."s10_us1000" (
	"uid" varchar(40) DEFAULT '' NOT NULL,
	CONSTRAINT "s10_us1000_PRIMARY" PRIMARY KEY("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."server_info" (
	"id" integer NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"cross_fight_server_id" integer,
	"fightRoomSize" integer,
	"beginTime" bigint,
	"endTime" bigint,
	"open_time_info" "bytea",
	CONSTRAINT "server_info_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."server_king_info" (
	"Id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_global"."server_king_info_Id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 3 CACHE 1),
	"name" varchar(255),
	"banner" varchar(255),
	"kingName" varchar(255),
	"kingAllianceName" varchar(255),
	"kingAllianceAbbr" varchar(255),
	"kingAllianceIcon" varchar(255),
	CONSTRAINT "server_king_info_PRIMARY" PRIMARY KEY("Id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."server_list" (
	"id" integer DEFAULT 0 NOT NULL,
	"port" integer,
	"name" varchar(64),
	"zone" varchar(8),
	"ip" varchar(128),
	"state" integer DEFAULT 0,
	CONSTRAINT "server_list_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."server_merge_task" (
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
CREATE TABLE "cokdb_global"."server_push_auxiliary" (
	"uid" varchar(40) NOT NULL,
	"serverStr" "bytea",
	"sqlStr" "bytea",
	"status" integer DEFAULT 0,
	"operationTime" varchar(20),
	CONSTRAINT "server_push_auxiliary_PRIMARY" PRIMARY KEY("uid"),
	CONSTRAINT "server_push_auxiliary_serverStr_length" CHECK (octet_length("serverStr") <= 65535),
	CONSTRAINT "server_push_auxiliary_sqlStr_length" CHECK (octet_length("sqlStr") <= 16777215)
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."sign_in_feed" (
	"uid" varchar(255) NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"feed" varchar(40) NOT NULL,
	"time" bigint DEFAULT 0,
	CONSTRAINT "sign_in_feed_PRIMARY" PRIMARY KEY("feed","type","uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."specialreward" (
	"gameuid" varchar(100) DEFAULT '' NOT NULL,
	"type" varchar(40) DEFAULT '' NOT NULL,
	"state" integer DEFAULT 0,
	"sendTime" bigint,
	CONSTRAINT "specialreward_PRIMARY" PRIMARY KEY("gameuid","type")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."user_logging_events" (
	"email" varchar(40) DEFAULT '' NOT NULL,
	"event_id" integer NOT NULL,
	"receiveTime" bigint DEFAULT 0,
	"completeTime" bigint DEFAULT 0,
	CONSTRAINT "user_logging_events_PRIMARY" PRIMARY KEY("email","event_id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."user_tasks" (
	"email" varchar(40) DEFAULT '' NOT NULL,
	"event_id" bigint NOT NULL,
	"type" integer NOT NULL,
	"receiveTime" bigint DEFAULT 0,
	"completeTime" bigint DEFAULT 0,
	CONSTRAINT "user_tasks_PRIMARY" PRIMARY KEY("email","event_id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."userbindmapping" (
	"gameUid" varchar(100) NOT NULL,
	"mappingType" varchar(20) DEFAULT '' NOT NULL,
	"mappingValue" varchar(200),
	"lastTime" bigint DEFAULT 0,
	"active" integer DEFAULT 0,
	CONSTRAINT "userbindmapping_PRIMARY" PRIMARY KEY("gameUid","mappingType")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."userbindmapping_oldbigone" (
	"gameUid" varchar(100) NOT NULL,
	"mappingType" varchar(20) DEFAULT '' NOT NULL,
	"mappingValue" varchar(200),
	"lastTime" bigint DEFAULT 0,
	"active" integer DEFAULT 0,
	CONSTRAINT "userbindmapping_oldbigone_PRIMARY" PRIMARY KEY("gameUid","mappingType")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."userbindmappingreverse" (
	"gameUid" varchar(100) NOT NULL,
	"mappingType" varchar(20) DEFAULT '' NOT NULL,
	"mappingValue" varchar(200),
	"lastTime" bigint DEFAULT 0,
	"active" integer DEFAULT 0,
	CONSTRAINT "userbindmappingreverse_PRIMARY" PRIMARY KEY("gameUid","mappingType")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."userbindmappingreverse_oldbigone" (
	"gameUid" varchar(100) NOT NULL,
	"mappingType" varchar(20) DEFAULT '' NOT NULL,
	"mappingValue" varchar(200),
	"lastTime" bigint DEFAULT 0,
	"active" integer DEFAULT 0,
	CONSTRAINT "userbindmappingreverse_oldbigone_PRIMARY" PRIMARY KEY("gameUid","mappingType")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."usermapping" (
	"gameUid" varchar(100) NOT NULL,
	"mappingType" varchar(20) DEFAULT '' NOT NULL,
	"mappingValue" varchar(200),
	"lastTime" bigint DEFAULT 0,
	"active" integer DEFAULT 0,
	CONSTRAINT "usermapping_PRIMARY" PRIMARY KEY("gameUid","mappingType")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."worldcup_team" (
	"version" varchar(255),
	"allianceId" varchar(255),
	"allianceName" varchar(255),
	"fighting" varchar(255),
	"leaderUid" varchar(255),
	"leaderName" varchar(255),
	"addr" varchar(255),
	"abbr" varchar(255),
	"icon" varchar(255),
	"language" varchar(255),
	"country" varchar(255),
	"createTime" varchar(255),
	"serverId" varchar(255),
	"regionId" varchar(255),
	"score" varchar(255),
	"lastTimeIndex" varchar(255),
	"timeIndex" varchar(255),
	"chooseTimes" varchar(255),
	"thumbUps" varchar(255),
	"areaId" varchar(255),
	"fightServerId" varchar(255),
	"fightersJson" text,
	"rankNum" varchar(255),
	"winCount" varchar(255),
	"battleCount" varchar(255),
	"groupId" varchar(255),
	"groupIndex" varchar(255),
	"enemyId" varchar(255),
	"areaEnemys" varchar(255),
	"areaResults" varchar(255),
	"finalResult" varchar(255),
	"camp" varchar(255),
	"groupChampion" varchar(255),
	"fightTurns" varchar(255),
	"announcement" varchar(255),
	"lastAnnounceMillis" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."download" (
	"Id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_pay"."download_Id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 12 CACHE 1),
	"name" varchar(255),
	"app_icon" varchar(255),
	"platform" varchar(255),
	"link" text,
	"version" varchar(11),
	"status" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "download_PRIMARY" PRIMARY KEY("Id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."exchange" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_pay"."exchange_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 9 CACHE 1),
	"orderId" varchar(255) DEFAULT '11001' NOT NULL,
	"paidGold" bigint DEFAULT 0 NOT NULL,
	"name" varchar(255),
	"price" numeric(10, 2),
	"images" varchar(255),
	"ItemId" text,
	"monthly_card" integer DEFAULT 2 NOT NULL,
	"status" varchar(255),
	"currency" varchar(255) DEFAULT 'USD' NOT NULL,
	"pack_type" varchar(255) DEFAULT '1' NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "exchange_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."goods" (
	"id" varchar(255),
	"name" varchar(255),
	"icon" varchar(255),
	"description" varchar(255),
	"type" varchar(255),
	"type2" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."goods_name" (
	"id" varchar(255) NOT NULL,
	"name" varchar(255),
	"icon" varchar(255),
	CONSTRAINT "goods_name_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."logs_packages" (
	"usn" integer,
	"uid" varchar(40),
	"packid" integer,
	"price" integer,
	"originalpoints" varchar(50),
	"points" varchar(50),
	"time" text DEFAULT '0000-00-00 00:00:00',
	"serverid" integer DEFAULT 0,
	"db" varchar(10),
	"ip" varchar(40),
	"browser" varchar(40),
	"os" varchar(255),
	CONSTRAINT "logs_packages_time_temporal" CHECK (("time" IS NULL OR (CASE WHEN "time" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("time",4) <> '0000' AND substring("time",6,2) <> '00' AND substring("time",9,2) <> '00' THEN to_char(to_date(left("time",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("time",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."logs_password" (
	"uid" varchar(40),
	"name" varchar(50),
	"old_password" varchar(50),
	"new_password" varchar(50),
	"time" text DEFAULT '0000-00-00 00:00:00',
	"serverid" integer DEFAULT 0,
	"ip" varchar(40),
	CONSTRAINT "logs_password_time_temporal" CHECK (("time" IS NULL OR (CASE WHEN "time" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("time",4) <> '0000' AND substring("time",6,2) <> '00' AND substring("time",9,2) <> '00' THEN to_char(to_date(left("time",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("time",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."logs_points" (
	"usn" integer,
	"Transaction_ID" varchar(255),
	"points" varchar(50),
	"old_points" varchar(50),
	"new_points" varchar(50),
	"time" text DEFAULT '0000-00-00 00:00:00',
	CONSTRAINT "logs_points_time_temporal" CHECK (("time" IS NULL OR (CASE WHEN "time" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("time",4) <> '0000' AND substring("time",6,2) <> '00' AND substring("time",9,2) <> '00' THEN to_char(to_date(left("time",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("time",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."orders" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_pay"."orders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(50) NOT NULL,
	"email" varchar(50) NOT NULL,
	"uid" varchar(255) DEFAULT '0' NOT NULL,
	"serverId" varchar(255),
	"orderId" varchar(255) DEFAULT '' NOT NULL,
	"ItemId" text NOT NULL,
	"ItemName" varchar(255) DEFAULT '' NOT NULL,
	"gold" varchar(255),
	"item_number" varchar(50) NOT NULL,
	"item_price" varchar(10) DEFAULT '',
	"item_price_currency" varchar(10) NOT NULL,
	"paid_amount" varchar(10),
	"paid_amount_currency" varchar(10) NOT NULL,
	"txn_id" varchar(50) NOT NULL,
	"payment_status" varchar(25) NOT NULL,
	"created" text NOT NULL,
	"modified" text NOT NULL,
	CONSTRAINT "orders_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "orders_created_temporal" CHECK (("created" IS NULL OR (CASE WHEN "created" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("created",4) <> '0000' AND substring("created",6,2) <> '00' AND substring("created",9,2) <> '00' THEN to_char(to_date(left("created",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("created",10) ELSE true END ELSE false END))),
	CONSTRAINT "orders_modified_temporal" CHECK (("modified" IS NULL OR (CASE WHEN "modified" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("modified",4) <> '0000' AND substring("modified",6,2) <> '00' AND substring("modified",9,2) <> '00' THEN to_char(to_date(left("modified",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("modified",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."package" (
	"Id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_pay"."package_Id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) DEFAULT '',
	"usd" integer DEFAULT 0 NOT NULL,
	"itemId" text,
	"price" numeric(10, 2) DEFAULT 100.00 NOT NULL,
	"status" varchar(255),
	"images" "bytea" DEFAULT '57067_ad1_new' NOT NULL,
	"currency" varchar(255) DEFAULT 'USD' NOT NULL,
	"monthly_card" varchar(255) DEFAULT '1' NOT NULL,
	"gold_pack_only" varchar(255) DEFAULT '0' NOT NULL,
	"festival_item" varchar(255),
	"pack_type" varchar(255),
	CONSTRAINT "package_PRIMARY" PRIMARY KEY("Id"),
	CONSTRAINT "package_images_length" CHECK (octet_length("images") <= 255)
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."packs" (
	"Id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_pay"."packs_Id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 96 CACHE 1),
	"name" varchar(100),
	"description" varchar(255) DEFAULT 'NRAGON MOD SHOP' NOT NULL,
	"contents" text,
	"images" varchar(255) DEFAULT 'novia' NOT NULL,
	"gold" integer DEFAULT 0,
	"price" integer DEFAULT 1000,
	"items" text,
	"group" varchar(255),
	"pack_type" varchar(255) DEFAULT 'gold' NOT NULL,
	"status" integer DEFAULT 0 NOT NULL,
	"popup_image" varchar(255) DEFAULT 'novia' NOT NULL,
	CONSTRAINT "packs_PRIMARY" PRIMARY KEY("Id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."payfive" (
	"date" varchar(40) NOT NULL,
	"pf" varchar(20) NOT NULL,
	"country" varchar(20) NOT NULL,
	"paysum" numeric(20, 2),
	"paytimes" integer,
	CONSTRAINT "payfive_PRIMARY" PRIMARY KEY("date","pf","country")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."payments" (
	"payment_id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_pay"."payments_payment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255),
	"uid" varchar(11),
	"item_name" varchar(255),
	"item_number" varchar(50) NOT NULL,
	"txn_id" varchar(50) NOT NULL,
	"payment_gross" numeric(10, 2) NOT NULL,
	"currency_code" varchar(5) NOT NULL,
	"payment_status" varchar(20) NOT NULL,
	CONSTRAINT "payments_PRIMARY" PRIMARY KEY("payment_id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."payments_api" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_pay"."payments_api_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"paymentId" varchar(255) DEFAULT '' NOT NULL,
	"orderId" varchar(255),
	"productId" varchar(255),
	"gameUid" varchar(255) DEFAULT '' NOT NULL,
	"payerId" varchar(255) DEFAULT '' NOT NULL,
	"successTimestamp" text DEFAULT to_char(statement_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') NOT NULL,
	"status" varchar(255) DEFAULT '0' NOT NULL,
	CONSTRAINT "payments_api_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "payments_api_successTimestamp_temporal" CHECK (("successTimestamp" IS NULL OR (CASE WHEN "successTimestamp" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("successTimestamp",4) <> '0000' AND substring("successTimestamp",6,2) <> '00' AND substring("successTimestamp",9,2) <> '00' THEN to_char(to_date(left("successTimestamp",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("successTimestamp",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."paypal_payments" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_pay"."paypal_payments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 2 CACHE 1),
	"uid" varchar(255),
	"name" varchar(255),
	"pack_type" varchar(255),
	"item_number" varchar(50),
	"item_name" varchar(255),
	"item_price" numeric(10, 2),
	"item_price_currency" varchar(10),
	"payer_id" varchar(50),
	"payer_name" varchar(50),
	"payer_email" varchar(50),
	"payer_country" varchar(20),
	"merchant_id" varchar(255),
	"merchant_email" varchar(50),
	"order_id" varchar(50) NOT NULL,
	"transaction_id" varchar(50) NOT NULL,
	"paid_amount" numeric(10, 2) NOT NULL,
	"paid_amount_currency" varchar(10) NOT NULL,
	"payment_source" varchar(50),
	"payment_status" varchar(25) NOT NULL,
	"created" text NOT NULL,
	"modified" text NOT NULL,
	CONSTRAINT "paypal_payments_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "paypal_payments_created_temporal" CHECK (("created" IS NULL OR (CASE WHEN "created" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("created",4) <> '0000' AND substring("created",6,2) <> '00' AND substring("created",9,2) <> '00' THEN to_char(to_date(left("created",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("created",10) ELSE true END ELSE false END))),
	CONSTRAINT "paypal_payments_modified_temporal" CHECK (("modified" IS NULL OR (CASE WHEN "modified" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("modified",4) <> '0000' AND substring("modified",6,2) <> '00' AND substring("modified",9,2) <> '00' THEN to_char(to_date(left("modified",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("modified",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."payrecord" (
	"uid" varchar(40) NOT NULL,
	"orderId" varchar(200) NOT NULL,
	"method" varchar(20) NOT NULL,
	"request" "bytea",
	"postParam" "bytea",
	"result" "bytea",
	"time" bigint,
	"lastCheckTime" integer,
	"checkTimes" integer DEFAULT 0,
	"checkHistory" "bytea",
	"checkResult" integer DEFAULT 0,
	CONSTRAINT "payrecord_PRIMARY" PRIMARY KEY("uid","orderId","method"),
	CONSTRAINT "payrecord_request_length" CHECK (octet_length("request") <= 65535),
	CONSTRAINT "payrecord_postParam_length" CHECK (octet_length("postParam") <= 65535),
	CONSTRAINT "payrecord_result_length" CHECK (octet_length("result") <= 65535),
	CONSTRAINT "payrecord_checkHistory_length" CHECK (octet_length("checkHistory") <= 65535)
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."points_packages" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_pay"."points_packages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 2 CACHE 1),
	"name" varchar(255) NOT NULL,
	"points" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	CONSTRAINT "points_packages_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."products" (
	"id" varchar(255) NOT NULL,
	"name" varchar(255) DEFAULT 'Land of WaR Shop' NOT NULL,
	"price" varchar(255),
	"shop_type" varchar(255) DEFAULT 'inapp' NOT NULL,
	CONSTRAINT "products_PRIMARY" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."products_web" (
	"Id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_pay"."products_web_Id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 2 CACHE 1),
	"name" varchar(255),
	"price" varchar(255),
	"type" varchar(255),
	CONSTRAINT "products_web_PRIMARY" PRIMARY KEY("Id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."transactions" (
	"id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_pay"."transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 3 CACHE 1),
	"uid" varchar(255),
	"orderId" varchar(255),
	"ItemId" varchar(255),
	"ItemName" varchar(255),
	"item_number" varchar(50),
	"item_name" varchar(255),
	"item_price" numeric(10, 2),
	"item_price_currency" varchar(10),
	"payer_id" varchar(50),
	"payer_name" varchar(50),
	"payer_email" varchar(50),
	"payer_country" varchar(20),
	"merchant_id" varchar(255),
	"merchant_email" varchar(50),
	"order_id" varchar(50) NOT NULL,
	"transaction_id" varchar(50) NOT NULL,
	"paid_amount" numeric(10, 2) NOT NULL,
	"paid_amount_currency" varchar(10) NOT NULL,
	"payment_source" varchar(50),
	"payment_status" varchar(25) NOT NULL,
	"created" text NOT NULL,
	"modified" text NOT NULL,
	CONSTRAINT "transactions_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "transactions_created_temporal" CHECK (("created" IS NULL OR (CASE WHEN "created" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("created",4) <> '0000' AND substring("created",6,2) <> '00' AND substring("created",9,2) <> '00' THEN to_char(to_date(left("created",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("created",10) ELSE true END ELSE false END))),
	CONSTRAINT "transactions_modified_temporal" CHECK (("modified" IS NULL OR (CASE WHEN "modified" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("modified",4) <> '0000' AND substring("modified",6,2) <> '00' AND substring("modified",9,2) <> '00' THEN to_char(to_date(left("modified",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("modified",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."users" (
	"usn" bigint GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_pay"."users_usn_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1216 CACHE 1),
	"uid" varchar(40) NOT NULL,
	"usd" integer DEFAULT 0 NOT NULL,
	"name" varchar(15),
	"password" varchar(255),
	"totalpaid" integer DEFAULT 0,
	"lastbuytime" text DEFAULT '0000-00-00 00:00:00',
	"server" integer DEFAULT 0,
	"db" varchar(8),
	"email" varchar(40),
	"deviceid" varchar(255),
	"profile_image" varchar(255),
	"banned" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "users_PRIMARY" PRIMARY KEY("usn"),
	CONSTRAINT "users_lastbuytime_temporal" CHECK (("lastbuytime" IS NULL OR (CASE WHEN "lastbuytime" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left("lastbuytime",4) <> '0000' AND substring("lastbuytime",6,2) <> '00' AND substring("lastbuytime",9,2) <> '00' THEN to_char(to_date(left("lastbuytime",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("lastbuytime",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."video" (
	"Id" integer GENERATED BY DEFAULT AS IDENTITY (sequence name "cokdb_pay"."video_Id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 3 CACHE 1),
	"name" varchar(255),
	"video_key" text NOT NULL,
	"status" varchar(255) DEFAULT '0',
	CONSTRAINT "video_PRIMARY" PRIMARY KEY("Id")
);
--> statement-breakpoint
CREATE TABLE "opencok_chat"."chat_message" (
	"sequence_id" numeric(20, 0) DEFAULT nextval('"opencok_chat"."chat_message_sequence_id_seq"'::regclass)::numeric + 9223372036854775808 NOT NULL,
	"room_key" varchar(160) NOT NULL,
	"sender_uid" varchar(40) NOT NULL,
	"idempotency_key" "bytea" NOT NULL,
	"body" text NOT NULL,
	"created_at" text NOT NULL,
	"expires_at" text NOT NULL,
	CONSTRAINT "chat_message_PRIMARY" PRIMARY KEY("sequence_id"),
	CONSTRAINT "chat_message_sequence_id_range" CHECK ("sequence_id" >= 0 AND "sequence_id" <= 18446744073709551615),
	CONSTRAINT "chat_message_idempotency_key_length" CHECK (octet_length("idempotency_key") <= 64),
	CONSTRAINT "chat_message_created_at_temporal" CHECK (("created_at" IS NULL OR (CASE WHEN "created_at" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9][.][0-9]{3}$' THEN CASE WHEN left("created_at",4) <> '0000' AND substring("created_at",6,2) <> '00' AND substring("created_at",9,2) <> '00' THEN to_char(to_date(left("created_at",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("created_at",10) ELSE true END ELSE false END))),
	CONSTRAINT "chat_message_expires_at_temporal" CHECK (("expires_at" IS NULL OR (CASE WHEN "expires_at" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9][.][0-9]{3}$' THEN CASE WHEN left("expires_at",4) <> '0000' AND substring("expires_at",6,2) <> '00' AND substring("expires_at",9,2) <> '00' THEN to_char(to_date(left("expires_at",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("expires_at",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
CREATE TABLE "opencok_chat"."chat_session" (
	"token_hash" "bytea" NOT NULL,
	"uid" varchar(40) NOT NULL,
	"created_at" text NOT NULL,
	"expires_at" text NOT NULL,
	CONSTRAINT "chat_session_PRIMARY" PRIMARY KEY("token_hash"),
	CONSTRAINT "chat_session_token_hash_length" CHECK (octet_length("token_hash") = 32),
	CONSTRAINT "chat_session_created_at_temporal" CHECK (("created_at" IS NULL OR (CASE WHEN "created_at" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9][.][0-9]{3}$' THEN CASE WHEN left("created_at",4) <> '0000' AND substring("created_at",6,2) <> '00' AND substring("created_at",9,2) <> '00' THEN to_char(to_date(left("created_at",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("created_at",10) ELSE true END ELSE false END))),
	CONSTRAINT "chat_session_expires_at_temporal" CHECK (("expires_at" IS NULL OR (CASE WHEN "expires_at" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9][.][0-9]{3}$' THEN CASE WHEN left("expires_at",4) <> '0000' AND substring("expires_at",6,2) <> '00' AND substring("expires_at",9,2) <> '00' THEN to_char(to_date(left("expires_at",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left("expires_at",10) ELSE true END ELSE false END)))
);
--> statement-breakpoint
ALTER TABLE "cokdb_global"."logging_event_property" ADD CONSTRAINT "logging_event_property_logging_event_property_ibfk_1" FOREIGN KEY ("event_id") REFERENCES "cokdb_global"."logging_event"("event_id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "cokdb_global"."user_tasks" ADD CONSTRAINT "user_tasks_user_tasks_ibfk_1" FOREIGN KEY ("event_id") REFERENCES "cokdb_global"."logging_event"("event_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_google_lasttime_index" ON "cokdb_global"."account_new_oldbigone" USING btree ("googleAccount","lastTime");--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_facebook_lasttime_index" ON "cokdb_global"."account_new_oldbigone" USING btree ("facebookAccount","lastTime");--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_deviceId_lasttime_index" ON "cokdb_global"."account_new_oldbigone" USING btree ("deviceId","lastTime");--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_email_lasttime_index" ON "cokdb_global"."account_new_oldbigone" USING btree ("emailAccount","lastTime");--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_pf_pi_lasttime_index" ON "cokdb_global"."account_new_oldbigone" USING btree ("pf","pfId","lastTime");--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_server_id_index" ON "cokdb_global"."account_new_oldbigone" USING btree ("server");--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_username_index" ON "cokdb_global"."account_new_oldbigone" USING btree ("gameUserName");--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_gaid_index" ON "cokdb_global"."account_new_oldbigone" USING btree ("gaid");--> statement-breakpoint
CREATE INDEX "activation_index_user" ON "cokdb_global"."activation" USING btree ("user");--> statement-breakpoint
CREATE INDEX "addata_index_time_tracker_country" ON "cokdb_global"."addata" USING btree ("time","tracker","country");--> statement-breakpoint
CREATE INDEX "admin_audit_log_tuid" ON "cokdb_global"."admin_audit_log" USING btree ("target_uid");--> statement-breakpoint
CREATE INDEX "admin_audit_log_uname" ON "cokdb_global"."admin_audit_log" USING btree ("adminname");--> statement-breakpoint
CREATE INDEX "admin_audit_log_atype" ON "cokdb_global"."admin_audit_log" USING btree ("action_type");--> statement-breakpoint
CREATE INDEX "admin_audit_log_ctime" ON "cokdb_global"."admin_audit_log" USING btree ("create_time");--> statement-breakpoint
CREATE INDEX "adreward_index_time" ON "cokdb_global"."adreward" USING btree ("time");--> statement-breakpoint
CREATE INDEX "adreward_index_state_tryTime" ON "cokdb_global"."adreward" USING btree ("state","tryTimes");--> statement-breakpoint
CREATE INDEX "alliance_alliancename_index" ON "cokdb_global"."alliance" USING btree ("alliancename");--> statement-breakpoint
CREATE INDEX "alliance_name_idx" ON "cokdb_global"."alliance" USING btree ("alliancename");--> statement-breakpoint
CREATE INDEX "ban_record_index_uid" ON "cokdb_global"."ban_record" USING btree ("uid");--> statement-breakpoint
CREATE UNIQUE INDEX "cross_throne_king_info_uuid" ON "cokdb_global"."cross_throne_king_info" USING btree ("uuid");--> statement-breakpoint
CREATE INDEX "global_paylog_ipAndTime" ON "cokdb_global"."global_paylog" USING btree ("ip","time");--> statement-breakpoint
CREATE INDEX "logging_event_format_msg_idx" ON "cokdb_global"."logging_event" USING btree (left("formatted_message", 100));--> statement-breakpoint
CREATE INDEX "logging_event_arg_index" ON "cokdb_global"."logging_event" USING btree ("arg0","arg1","arg2");--> statement-breakpoint
CREATE INDEX "logging_event_exception_trace_line_idx" ON "cokdb_global"."logging_event_exception" USING btree (left("trace_line", 255));--> statement-breakpoint
CREATE INDEX "mod_info_mod_info_fk_01" ON "cokdb_global"."mod_info" USING btree ("server");--> statement-breakpoint
CREATE INDEX "mod_info_lang_index" ON "cokdb_global"."mod_info" USING btree ("lang");--> statement-breakpoint
CREATE INDEX "mycardsuccess_index_time" ON "cokdb_global"."mycardsuccess" USING btree ("time");--> statement-breakpoint
CREATE INDEX "mycardsuccess_index_mycardid" ON "cokdb_global"."mycardsuccess" USING btree ("mycardid");--> statement-breakpoint
CREATE INDEX "outer_mail_index_startTime" ON "cokdb_global"."outer_mail" USING btree ("startTime");--> statement-breakpoint
CREATE INDEX "paylog_tmp_index_time_pf" ON "cokdb_global"."paylog_tmp" USING btree ("uid","orderId","time");--> statement-breakpoint
CREATE INDEX "paylog_tmp_2_index_time_pf" ON "cokdb_global"."paylog_tmp_2" USING btree ("time","pf");--> statement-breakpoint
CREATE INDEX "paylog_tmp_2_index_orderid" ON "cokdb_global"."paylog_tmp_2" USING btree ("uid","orderId");--> statement-breakpoint
CREATE INDEX "repeat_name_server_index" ON "cokdb_global"."repeat_name" USING btree ("server");--> statement-breakpoint
CREATE INDEX "repeat_name_name_index" ON "cokdb_global"."repeat_name" USING btree ("gameUserName");--> statement-breakpoint
CREATE INDEX "server_list_index_ip" ON "cokdb_global"."server_list" USING btree ("ip");--> statement-breakpoint
CREATE INDEX "sign_in_feed_index_uid_time" ON "cokdb_global"."sign_in_feed" USING btree ("uid","time");--> statement-breakpoint
CREATE INDEX "user_logging_events_ULE_EVENTID_INDEX_01" ON "cokdb_global"."user_logging_events" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "user_tasks_event_id" ON "cokdb_global"."user_tasks" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "userbindmapping_pf_pi_lasttime_index" ON "cokdb_global"."userbindmapping" USING btree ("mappingType","mappingValue","lastTime");--> statement-breakpoint
CREATE INDEX "userbindmapping_oldbigone_pf_pi_lasttime_index" ON "cokdb_global"."userbindmapping_oldbigone" USING btree ("mappingType","mappingValue","lastTime");--> statement-breakpoint
CREATE INDEX "userbindmappingreverse_pf_pi_lasttime_index" ON "cokdb_global"."userbindmappingreverse" USING btree ("mappingType","mappingValue","lastTime");--> statement-breakpoint
CREATE INDEX "userbindmappingreverse_oldbigone_pf_pi_lasttime_index" ON "cokdb_global"."userbindmappingreverse_oldbigone" USING btree ("mappingType","mappingValue","lastTime");--> statement-breakpoint
CREATE INDEX "usermapping_pf_pi_lasttime_index" ON "cokdb_global"."usermapping" USING btree ("mappingType","mappingValue","lastTime");--> statement-breakpoint
CREATE INDEX "payfive_index" ON "cokdb_pay"."payfive" USING btree ("country");--> statement-breakpoint
CREATE INDEX "payrecord_index" ON "cokdb_pay"."payrecord" USING btree ("time","method","checkResult");--> statement-breakpoint
CREATE UNIQUE INDEX "chat_message_uq_sender_room_client" ON "opencok_chat"."chat_message" USING btree ("sender_uid","room_key","idempotency_key");--> statement-breakpoint
CREATE INDEX "chat_message_idx_room_sequence" ON "opencok_chat"."chat_message" USING btree ("room_key","sequence_id");--> statement-breakpoint
CREATE INDEX "chat_message_idx_message_expiry" ON "opencok_chat"."chat_message" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "chat_session_idx_session_uid_expiry" ON "opencok_chat"."chat_session" USING btree ("uid","expires_at");--> statement-breakpoint
CREATE INDEX "chat_session_idx_session_expiry" ON "opencok_chat"."chat_session" USING btree ("expires_at");