CREATE SCHEMA legacy_meta;
CREATE COLLATION legacy_meta.ci (provider = icu, locale = 'und-u-ks-level1', deterministic = false);
CREATE COLLATION legacy_meta.sv_ci (provider = icu, locale = 'sv-u-ks-level1', deterministic = false);
CREATE TABLE legacy_meta.manifest (hash text PRIMARY KEY, role text NOT NULL CHECK (role IN ('global','realm')));
CREATE TABLE legacy_meta.unsigned_sequences (name text PRIMARY KEY, next_value numeric(21,0) NOT NULL CHECK (next_value BETWEEN 1 AND 18446744073709551616));
CREATE FUNCTION legacy_meta.next_unsigned(sequence_name text) RETURNS numeric LANGUAGE plpgsql AS $body$
DECLARE result numeric;
BEGIN
  SELECT next_value INTO result FROM legacy_meta.unsigned_sequences WHERE name=sequence_name FOR UPDATE;
  IF result IS NULL OR result > 18446744073709551615 THEN RAISE EXCEPTION USING ERRCODE='22003', MESSAGE='Unsigned sequence exhausted or absent'; END IF;
  UPDATE legacy_meta.unsigned_sequences SET next_value=result+1 WHERE name=sequence_name;
  RETURN result;
END $body$;
CREATE FUNCTION legacy_meta.utc_now(precision_digits integer) RETURNS text LANGUAGE sql VOLATILE AS $body$
  SELECT to_char(statement_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') ||
    CASE WHEN precision_digits > 0 THEN '.' || left(to_char(statement_timestamp() AT TIME ZONE 'UTC', 'US'), precision_digits) ELSE '' END
$body$;
CREATE FUNCTION legacy_meta.valid_temporal(value text, kind text, precision_digits integer) RETURNS boolean LANGUAGE plpgsql IMMUTABLE STRICT AS $body$
DECLARE year_value integer; month_value integer; day_value integer; pattern text;
BEGIN
  pattern := '^[0-9]{4}-[0-9]{2}-[0-9]{2}' || CASE WHEN kind='date' THEN '$' ELSE ' [0-9]{2}:[0-9]{2}:[0-9]{2}' || CASE WHEN precision_digits>0 THEN '[.][0-9]{' || precision_digits || '}' ELSE '' END || '$' END;
  IF value !~ pattern THEN RETURN false; END IF;
  year_value := substring(value,1,4)::integer; month_value := substring(value,6,2)::integer; day_value := substring(value,9,2)::integer;
  IF month_value > 12 OR day_value > 31 THEN RETURN false; END IF;
  IF kind <> 'date' AND (substring(value,12,2)::integer>23 OR substring(value,15,2)::integer>59 OR substring(value,18,2)::integer>59) THEN RETURN false; END IF;
  IF year_value>0 AND month_value>0 AND day_value>0 THEN PERFORM make_date(year_value,month_value,day_value); END IF;
  RETURN true;
EXCEPTION WHEN datetime_field_overflow THEN RETURN false;
END $body$;
CREATE FUNCTION legacy_meta.reset_explicit_timestamp() RETURNS trigger LANGUAGE plpgsql AS $body$
BEGIN PERFORM set_config('legacy_meta.explicit_timestamp','off',true); RETURN NEW; END $body$;
CREATE FUNCTION legacy_meta.mark_explicit_timestamp() RETURNS trigger LANGUAGE plpgsql AS $body$
BEGIN PERFORM set_config('legacy_meta.explicit_timestamp','on',true); RETURN NEW; END $body$;
--> statement-breakpoint
CREATE SCHEMA "cokdb_global";
--> statement-breakpoint
CREATE SCHEMA "cokdb_pay";
--> statement-breakpoint
CREATE SCHEMA "opencok_chat";
--> statement-breakpoint
INSERT INTO legacy_meta.manifest VALUES ('224e7a718dad6a9d807fc1bec92857e2a3ca23e98a91d6c7d39739b09e8ffedd', 'global');
--> statement-breakpoint
CREATE TABLE "cokdb_global"."account_device_mapping" (
  "gameUid" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "deviceId" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer,
  "time" bigint,
  CONSTRAINT "account_device_mapping_PRIMARY" PRIMARY KEY ("gameUid", "deviceId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "account_device_mapping_PRIMARY_pad" ON "cokdb_global"."account_device_mapping" ((rtrim("gameUid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("deviceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."account_new" (
  "gameUid" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "server" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uuid" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "deviceId" character varying(200) COLLATE "legacy_meta"."ci",
  "gaid" character varying(40) COLLATE "legacy_meta"."ci",
  "country" character varying(40) COLLATE "legacy_meta"."ci",
  "emailAccount" character varying(200) COLLATE "legacy_meta"."ci",
  "googleAccount" character varying(200) COLLATE "legacy_meta"."ci",
  "googleAccountName" character varying(200) COLLATE "legacy_meta"."ci",
  "facebookAccount" character varying(200) COLLATE "legacy_meta"."ci",
  "facebookAccountName" character varying(200) COLLATE "legacy_meta"."ci",
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "pfId" character varying(40) COLLATE "legacy_meta"."ci",
  "gameUserName" character varying(200) COLLATE "legacy_meta"."ci",
  "gameUserLevel" integer NOT NULL,
  "lastTime" bigint NOT NULL,
  "emailConfirm" integer DEFAULT 0,
  "passmd5" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '',
  "active" integer DEFAULT 0,
  CONSTRAINT "account_new_PRIMARY" PRIMARY KEY ("gameUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "account_new_PRIMARY_pad" ON "cokdb_global"."account_new" ((rtrim("gameUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."account_new_oldbigone" (
  "gameUid" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "server" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uuid" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "deviceId" character varying(200) COLLATE "legacy_meta"."ci",
  "gaid" character varying(40) COLLATE "legacy_meta"."ci",
  "country" character varying(40) COLLATE "legacy_meta"."ci",
  "emailAccount" character varying(200) COLLATE "legacy_meta"."ci",
  "googleAccount" character varying(200) COLLATE "legacy_meta"."ci",
  "googleAccountName" character varying(200) COLLATE "legacy_meta"."ci",
  "facebookAccount" character varying(200) COLLATE "legacy_meta"."ci",
  "facebookAccountName" character varying(200) COLLATE "legacy_meta"."ci",
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "pfId" character varying(40) COLLATE "legacy_meta"."ci",
  "gameUserName" character varying(200) COLLATE "legacy_meta"."ci",
  "gameUserLevel" integer NOT NULL,
  "lastTime" bigint NOT NULL,
  "emailConfirm" integer DEFAULT 0,
  "passmd5" character varying(40) COLLATE "legacy_meta"."ci",
  "active" integer DEFAULT 0,
  CONSTRAINT "account_new_oldbigone_PRIMARY" PRIMARY KEY ("gameUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "account_new_oldbigone_PRIMARY_pad" ON "cokdb_global"."account_new_oldbigone" ((rtrim("gameUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_google_lasttime_index" ON "cokdb_global"."account_new_oldbigone" ((rtrim("googleAccount", ' ') COLLATE "legacy_meta"."ci"), ("lastTime"));
--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_facebook_lasttime_index" ON "cokdb_global"."account_new_oldbigone" ((rtrim("facebookAccount", ' ') COLLATE "legacy_meta"."ci"), ("lastTime"));
--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_deviceId_lasttime_index" ON "cokdb_global"."account_new_oldbigone" ((rtrim("deviceId", ' ') COLLATE "legacy_meta"."ci"), ("lastTime"));
--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_email_lasttime_index" ON "cokdb_global"."account_new_oldbigone" ((rtrim("emailAccount", ' ') COLLATE "legacy_meta"."ci"), ("lastTime"));
--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_pf_pi_lasttime_index" ON "cokdb_global"."account_new_oldbigone" ((rtrim("pf", ' ') COLLATE "legacy_meta"."ci"), (rtrim("pfId", ' ') COLLATE "legacy_meta"."ci"), ("lastTime"));
--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_server_id_index" ON "cokdb_global"."account_new_oldbigone" ((rtrim("server", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_username_index" ON "cokdb_global"."account_new_oldbigone" ((rtrim("gameUserName", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "account_new_oldbigone_gaid_index" ON "cokdb_global"."account_new_oldbigone" ((rtrim("gaid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."activation" (
  "code" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "series" integer,
  "type" integer DEFAULT 0,
  "user" character varying(40) COLLATE "legacy_meta"."ci",
  "useTime" bigint,
  "state" integer DEFAULT 0,
  "timeId" integer DEFAULT 0,
  "count" integer DEFAULT 0,
  CONSTRAINT "activation_PRIMARY" PRIMARY KEY ("code")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "activation_PRIMARY_pad" ON "cokdb_global"."activation" ((rtrim("code", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "activation_index_user" ON "cokdb_global"."activation" ((rtrim("user", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."activation_bak" (
  "code" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "series" integer,
  "user" character varying(40) COLLATE "legacy_meta"."ci",
  "state" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."activation_config" (
  "seriesId" integer NOT NULL,
  "title" bytea,
  "contents" bytea,
  "reward" bytea,
  "num" integer,
  "proUser" character varying(40) COLLATE "legacy_meta"."ci",
  "type" integer DEFAULT 0,
  "count" integer DEFAULT 0,
  "beginTime" bigint DEFAULT 0,
  "endTime" bigint DEFAULT 0,
  "regStart" bigint DEFAULT 0,
  "regEnd" bigint DEFAULT 0,
  "country" character varying(256) COLLATE "legacy_meta"."ci" DEFAULT '',
  "bLvMin" integer DEFAULT 0,
  "bLvMax" integer DEFAULT 0,
  "uLvMin" integer DEFAULT 0,
  "uLvMax" integer DEFAULT 0,
  "powerMin" bigint DEFAULT 0,
  "powerMax" bigint DEFAULT 0,
  "payGold" integer DEFAULT 0,
  "deviceLimit" integer DEFAULT 0,
  CONSTRAINT "activation_config_title_length" CHECK (octet_length("title") <= 65535),
  CONSTRAINT "activation_config_contents_length" CHECK (octet_length("contents") <= 65535),
  CONSTRAINT "activation_config_reward_length" CHECK (octet_length("reward") <= 65535),
  CONSTRAINT "activation_config_PRIMARY" PRIMARY KEY ("seriesId")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."activation_device_record" (
  "code" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  CONSTRAINT "activation_device_record_PRIMARY" PRIMARY KEY ("code", "deviceId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "activation_device_record_PRIMARY_pad" ON "cokdb_global"."activation_device_record" ((rtrim("code", ' ') COLLATE "legacy_meta"."ci"), (rtrim("deviceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."activity" (
  "id" bigint NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "type" integer NOT NULL,
  "openTime" bigint,
  "startTime" bigint,
  "endTime" bigint,
  "info1" character varying(60) COLLATE "legacy_meta"."ci",
  CONSTRAINT "activity_id_range" CHECK ("id" >= 0 AND "id" <= 4294967295),
  CONSTRAINT "activity_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."adcost" (
  "date" text NOT NULL,
  "googleplay" numeric(12,2),
  "facebook" numeric(12,2),
  "cn" numeric(12,2),
  "kr" numeric(12,2),
  "jp" numeric(12,2),
  "th" numeric(12,2),
  "ru" numeric(12,2),
  "tw" numeric(12,2),
  CONSTRAINT "adcost_date_temporal" CHECK (legacy_meta.valid_temporal("date", 'date', 0)),
  CONSTRAINT "adcost_PRIMARY" PRIMARY KEY ("date")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."addata" (
  "device" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "time" bigint DEFAULT 0,
  "tracker" character varying(200) COLLATE "legacy_meta"."ci",
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "data" bytea,
  CONSTRAINT "addata_data_length" CHECK (octet_length("data") <= 65535),
  CONSTRAINT "addata_PRIMARY" PRIMARY KEY ("device")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "addata_PRIMARY_pad" ON "cokdb_global"."addata" ((rtrim("device", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "addata_index_time_tracker_country" ON "cokdb_global"."addata" (("time"), (rtrim("tracker", ' ') COLLATE "legacy_meta"."ci"), (rtrim("country", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."admin_audit_log" (
  "serial_id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "adminname" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "target_uid" character varying(50) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "target_server" character varying(8) COLLATE "legacy_meta"."ci",
  "action_type" smallint NOT NULL,
  "action_detail" character varying(2000) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "ip" character varying(24) COLLATE "legacy_meta"."ci" DEFAULT '0' NOT NULL,
  "create_time" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "admin_audit_log_action_type_range" CHECK ("action_type" BETWEEN -128 AND 127),
  CONSTRAINT "admin_audit_log_PRIMARY" PRIMARY KEY ("serial_id")
);
--> statement-breakpoint
CREATE INDEX "admin_audit_log_tuid" ON "cokdb_global"."admin_audit_log" ((rtrim("target_uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "admin_audit_log_uname" ON "cokdb_global"."admin_audit_log" ((rtrim("adminname", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "admin_audit_log_atype" ON "cokdb_global"."admin_audit_log" (("action_type"));
--> statement-breakpoint
CREATE INDEX "admin_audit_log_ctime" ON "cokdb_global"."admin_audit_log" (("create_time"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."adreward" (
  "device" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL,
  "reward" character varying(200) COLLATE "legacy_meta"."ci",
  "user" character varying(40) COLLATE "legacy_meta"."ci",
  "state" integer DEFAULT 0,
  "sendTime" bigint,
  "tryTimes" integer DEFAULT 0,
  CONSTRAINT "adreward_PRIMARY" PRIMARY KEY ("device", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "adreward_PRIMARY_pad" ON "cokdb_global"."adreward" ((rtrim("device", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "adreward_index_time" ON "cokdb_global"."adreward" (("time"));
--> statement-breakpoint
CREATE INDEX "adreward_index_state_tryTime" ON "cokdb_global"."adreward" (("state"), ("tryTimes"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."alliance" (
  "allianceId" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "alliancename" character varying(255) COLLATE "legacy_meta"."ci",
  "serverId" integer,
  CONSTRAINT "alliance_PRIMARY" PRIMARY KEY ("allianceId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_PRIMARY_pad" ON "cokdb_global"."alliance" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_alliancename_index" ON "cokdb_global"."alliance" ((rtrim("alliancename", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_name_idx" ON "cokdb_global"."alliance" ((rtrim("alliancename", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."auction" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "groupId" integer NOT NULL,
  "cfgId" character varying(30) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "num" integer NOT NULL,
  "color" integer NOT NULL,
  "endTime" bigint NOT NULL,
  "zoneId" integer,
  "uid" character varying(255) COLLATE "legacy_meta"."ci",
  "name" character varying(255) COLLATE "legacy_meta"."ci",
  "price" integer NOT NULL,
  "add" integer NOT NULL,
  "decision" integer NOT NULL,
  "end" integer NOT NULL,
  "type" integer NOT NULL,
  CONSTRAINT "auction_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "auction_PRIMARY_pad" ON "cokdb_global"."auction" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."auction_activity" (
  "id" integer DEFAULT 0 NOT NULL,
  "startTime" bigint NOT NULL,
  "endTime" bigint NOT NULL,
  CONSTRAINT "auction_activity_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."auction_history" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "groupId" integer,
  "name" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemNum" integer NOT NULL,
  "price" integer,
  "time" bigint NOT NULL,
  CONSTRAINT "auction_history_PRIMARY" PRIMARY KEY ("uid", "uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "auction_history_PRIMARY_pad" ON "cokdb_global"."auction_history" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."auction_server_group" (
  "id" integer NOT NULL,
  "zoneIdStr" character varying(2000) COLLATE "legacy_meta"."ci" NOT NULL,
  CONSTRAINT "auction_server_group_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."ban_move_set" (
  "country" character varying(256) COLLATE "legacy_meta"."ci",
  "pf" character varying(255) COLLATE "legacy_meta"."ci",
  "serverPf" character varying(255) COLLATE "legacy_meta"."ci",
  "sid" character varying(255) COLLATE "legacy_meta"."ci",
  "val" character varying(255) COLLATE "legacy_meta"."ci"
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."ban_record" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "serverId" integer NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "time" bigint DEFAULT 0,
  "operator" character varying(40) COLLATE "legacy_meta"."ci",
  "reason" character varying(250) COLLATE "legacy_meta"."ci",
  "opDate" character varying(20) COLLATE "legacy_meta"."ci" DEFAULT '',
  CONSTRAINT "ban_record_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "ban_record_PRIMARY_pad" ON "cokdb_global"."ban_record" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "ban_record_index_uid" ON "cokdb_global"."ban_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."bantime_reason" (
  "serverId" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(200) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "operator" character varying(40) COLLATE "legacy_meta"."ci",
  "reason" character varying(250) COLLATE "legacy_meta"."ci",
  "opeDate" character varying(20) COLLATE "legacy_meta"."ci" DEFAULT '',
  "status" integer DEFAULT 0,
  CONSTRAINT "bantime_reason_PRIMARY" PRIMARY KEY ("serverId", "uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "bantime_reason_PRIMARY_pad" ON "cokdb_global"."bantime_reason" ((rtrim("serverId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."banwordrecord" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "server" integer NOT NULL,
  "banTimes" integer DEFAULT 0,
  CONSTRAINT "banwordrecord_PRIMARY" PRIMARY KEY ("uid", "server")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "banwordrecord_PRIMARY_pad" ON "cokdb_global"."banwordrecord" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("server"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."charge_activity" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "exchangeId" character varying(255) COLLATE "legacy_meta"."ci",
  "startTime" bigint,
  "rewardTime" bigint,
  "buyEndTime" bigint,
  "buyCount" integer,
  "maxBuyCount" integer,
  "rewardStatus" integer,
  "round" integer,
  CONSTRAINT "charge_activity_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "charge_activity_PRIMARY_pad" ON "cokdb_global"."charge_activity" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."cn_regpay" (
  "date" integer NOT NULL,
  "pf" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "dau" integer DEFAULT 0 NOT NULL,
  "reg" integer DEFAULT 0,
  "payucnt" integer DEFAULT 0,
  "paysum" integer DEFAULT 0,
  CONSTRAINT "cn_regpay_PRIMARY" PRIMARY KEY ("date", "pf")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "cn_regpay_PRIMARY_pad" ON "cokdb_global"."cn_regpay" (("date"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."cn_regpay_accumulative" (
  "date" integer NOT NULL,
  "pf" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "reg" integer DEFAULT 0,
  "payucnt" integer DEFAULT 0,
  "paysum" integer DEFAULT 0,
  CONSTRAINT "cn_regpay_accumulative_PRIMARY" PRIMARY KEY ("date", "pf")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "cn_regpay_accumulative_PRIMARY_pad" ON "cokdb_global"."cn_regpay_accumulative" (("date"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."cross_throne_king_info" (
  "uuid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "version" integer DEFAULT 0 NOT NULL,
  "king_type" integer DEFAULT 0 NOT NULL,
  "config_type" integer DEFAULT 0 NOT NULL,
  "name" character varying(50) COLLATE "legacy_meta"."ci",
  "uid" character varying(50) COLLATE "legacy_meta"."ci",
  "pic" character varying(50) COLLATE "legacy_meta"."ci",
  "pic_ver" integer DEFAULT 0 NOT NULL,
  "king_server_id" integer DEFAULT 0 NOT NULL,
  "alliance_abbr" character varying(50) COLLATE "legacy_meta"."ci",
  "occupy_seconds" integer DEFAULT 0 NOT NULL,
  "induction_time" bigint DEFAULT 0 NOT NULL,
  "throne_dead_count" integer DEFAULT 0 NOT NULL,
  "trebuchet_dead_count" integer DEFAULT 0 NOT NULL,
  "battle_user_count" integer DEFAULT 0 NOT NULL,
  "battle_alliance_count" integer DEFAULT 0 NOT NULL,
  "scout_count" integer DEFAULT 0 NOT NULL,
  "create_time" bigint,
  "last_update_time" bigint,
  CONSTRAINT "cross_throne_king_info_PRIMARY" PRIMARY KEY ("config_type", "king_type", "version")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb_global"."cross_throne_king_info"."king_type" IS '1 overlord  2 emperor';
--> statement-breakpoint
CREATE UNIQUE INDEX "cross_throne_king_info_uuid" ON "cokdb_global"."cross_throne_king_info" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."cross_throne_occupy_record" (
  "uuid" character varying(50) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "king_info_id" character varying(50) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(50) COLLATE "legacy_meta"."ci",
  "name" character varying(50) COLLATE "legacy_meta"."ci",
  "alliance_abbr" character varying(50) COLLATE "legacy_meta"."ci",
  "server_id" integer,
  "kingdom_name" character varying(50) COLLATE "legacy_meta"."ci",
  "start_millis" bigint,
  CONSTRAINT "cross_throne_occupy_record_PRIMARY" PRIMARY KEY ("king_info_id", "uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "cross_throne_occupy_record_PRIMARY_pad" ON "cokdb_global"."cross_throne_occupy_record" ((rtrim("king_info_id", ' ') COLLATE "legacy_meta"."ci"), (rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."cross_throne_reward_record" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 10) NOT NULL,
  "version" integer NOT NULL,
  "from_uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "target_uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '-1' NOT NULL,
  "from_server_id" integer NOT NULL,
  "target_server_id" integer NOT NULL,
  "reward_type" smallint NOT NULL,
  "reward_id" integer NOT NULL,
  "record_time" bigint,
  "pic" character varying(50) COLLATE "legacy_meta"."ci",
  "pic_ver" integer DEFAULT 0 NOT NULL,
  "name" character varying(50) COLLATE "legacy_meta"."ci",
  "alliance_abbr" character varying(50) COLLATE "legacy_meta"."ci",
  "throne_type" integer DEFAULT 0 NOT NULL,
  "overlord_type" integer NOT NULL,
  CONSTRAINT "cross_throne_reward_record_reward_type_range" CHECK ("reward_type" BETWEEN -128 AND 127),
  CONSTRAINT "cross_throne_reward_record_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."exchange" (
  "orderId" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."exchange_log" (
  "Id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 64) NOT NULL,
  "orderId" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "productId" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  CONSTRAINT "exchange_log_PRIMARY" PRIMARY KEY ("Id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."exchange_top" (
  "serverId" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "exchange_top_PRIMARY" PRIMARY KEY ("serverId")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."fb_bind" (
  "fbid" bigint NOT NULL,
  "time" bigint NOT NULL,
  CONSTRAINT "fb_bind_PRIMARY" PRIMARY KEY ("fbid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."fb_friend" (
  "fid" bigint NOT NULL,
  "tid" bigint NOT NULL,
  "tserver" integer,
  "tuid" character varying(40) COLLATE "legacy_meta"."ci",
  "time" bigint,
  CONSTRAINT "fb_friend_PRIMARY" PRIMARY KEY ("fid", "tid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."fb_invite" (
  "fid" bigint NOT NULL,
  "tid" bigint NOT NULL,
  "time" bigint NOT NULL,
  CONSTRAINT "fb_invite_PRIMARY" PRIMARY KEY ("fid", "tid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."fight_arena_info" (
  "worldId" integer NOT NULL,
  "state" integer,
  "endTime" bigint,
  "version" integer,
  CONSTRAINT "fight_arena_info_PRIMARY" PRIMARY KEY ("worldId")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."formation_info" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "formation" character varying(1024) COLLATE "legacy_meta"."ci",
  "index1" integer NOT NULL,
  "customName" character varying(21) COLLATE "legacy_meta"."ci",
  "dragonFormation" character varying(300) COLLATE "legacy_meta"."ci",
  "heroFormation" character varying(300) COLLATE "legacy_meta"."ci",
  "angelArmy" character varying(50) COLLATE "legacy_meta"."ci",
  CONSTRAINT "formation_info_PRIMARY" PRIMARY KEY ("uid", "index1")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb_global"."formation_info"."customName" IS '???????';
--> statement-breakpoint
CREATE UNIQUE INDEX "formation_info_PRIMARY_pad" ON "cokdb_global"."formation_info" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("index1"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."gashrequest" (
  "tradeid" bigint NOT NULL,
  "method" character varying(20) COLLATE "legacy_meta"."ci",
  "orderinfo" character varying(200) COLLATE "legacy_meta"."ci",
  "amount" integer,
  "trans" bytea,
  "state" integer,
  CONSTRAINT "gashrequest_trans_length" CHECK (octet_length("trans") <= 65535),
  CONSTRAINT "gashrequest_PRIMARY" PRIMARY KEY ("tradeid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."gashsuccess" (
  "tradeid" bigint NOT NULL,
  "finishTime" bigint NOT NULL,
  "type" character varying(20) COLLATE "legacy_meta"."ci",
  "confirm" integer DEFAULT 0,
  CONSTRAINT "gashsuccess_PRIMARY" PRIMARY KEY ("tradeid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."global_paylog" (
  "sid" integer NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "orderId" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "productId" character varying(10) COLLATE "legacy_meta"."ci" DEFAULT '0' NOT NULL,
  "orderInfo" character varying(200) COLLATE "legacy_meta"."ci",
  "orderParam" bytea,
  "time" bigint,
  "currency" integer DEFAULT 0,
  "spend" numeric(10,2) DEFAULT 0.00 NOT NULL,
  "paid" numeric(10,2) DEFAULT 0.00,
  "status" integer DEFAULT 0,
  "payLevel" integer NOT NULL,
  "buildingLv" integer,
  "receiverId" character varying(40) COLLATE "legacy_meta"."ci",
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "ip" character varying(20) COLLATE "legacy_meta"."ci" DEFAULT '',
  CONSTRAINT "global_paylog_orderParam_length" CHECK (octet_length("orderParam") <= 65535),
  CONSTRAINT "global_paylog_PRIMARY" PRIMARY KEY ("sid", "uid", "orderId", "pf")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "global_paylog_PRIMARY_pad" ON "cokdb_global"."global_paylog" (("sid"), (rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("orderId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "global_paylog_ipAndTime" ON "cokdb_global"."global_paylog" ((rtrim("ip", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."gold_group" (
  "itemId" integer DEFAULT 0 NOT NULL,
  "num" bigint DEFAULT 0 NOT NULL,
  "startTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "gold_group_PRIMARY" PRIMARY KEY ("itemId", "startTime")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."hero_kingdom_activity" (
  "uuid" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 9000003) NOT NULL,
  "sid" integer,
  "delay" character varying(255) COLLATE "legacy_meta"."ci",
  "power" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "hero_kingdom_activity_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."logging_event" (
  "timestmp" bigint NOT NULL,
  "formatted_message" text COLLATE "legacy_meta"."ci" NOT NULL,
  "logger_name" character varying(254) COLLATE "legacy_meta"."ci" NOT NULL,
  "level_string" character varying(254) COLLATE "legacy_meta"."ci" NOT NULL,
  "thread_name" character varying(254) COLLATE "legacy_meta"."ci",
  "reference_flag" smallint,
  "arg0" character varying(254) COLLATE "legacy_meta"."ci",
  "arg1" character varying(254) COLLATE "legacy_meta"."ci",
  "arg2" character varying(254) COLLATE "legacy_meta"."ci",
  "arg3" character varying(254) COLLATE "legacy_meta"."ci",
  "caller_filename" character varying(254) COLLATE "legacy_meta"."ci" NOT NULL,
  "caller_class" character varying(254) COLLATE "legacy_meta"."ci" NOT NULL,
  "caller_method" character varying(254) COLLATE "legacy_meta"."ci" NOT NULL,
  "caller_line" character varying(4) COLLATE "legacy_meta"."ci" NOT NULL,
  "event_id" bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  CONSTRAINT "logging_event_PRIMARY" PRIMARY KEY ("event_id")
);
--> statement-breakpoint
CREATE INDEX "logging_event_format_msg_idx" ON "cokdb_global"."logging_event" ((rtrim(left("formatted_message", 100), ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "logging_event_arg_index" ON "cokdb_global"."logging_event" ((rtrim("arg0", ' ') COLLATE "legacy_meta"."ci"), (rtrim("arg1", ' ') COLLATE "legacy_meta"."ci"), (rtrim("arg2", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."logging_event_exception" (
  "event_id" bigint NOT NULL,
  "i" smallint NOT NULL,
  "trace_line" character varying(1024) COLLATE "legacy_meta"."ci" NOT NULL,
  CONSTRAINT "logging_event_exception_PRIMARY" PRIMARY KEY ("event_id", "i")
);
--> statement-breakpoint
CREATE INDEX "logging_event_exception_trace_line_idx" ON "cokdb_global"."logging_event_exception" ((rtrim(left("trace_line", 255), ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."logging_event_property" (
  "event_id" bigint NOT NULL,
  "mapped_key" character varying(254) COLLATE "legacy_meta"."ci" NOT NULL,
  "mapped_value" text COLLATE "legacy_meta"."ci",
  CONSTRAINT "logging_event_property_PRIMARY" PRIMARY KEY ("event_id", "mapped_key")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "logging_event_property_PRIMARY_pad" ON "cokdb_global"."logging_event_property" (("event_id"), (rtrim("mapped_key", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."logging_event_stat" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "count" integer DEFAULT 0,
  "time" bigint DEFAULT 0,
  CONSTRAINT "logging_event_stat_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."mail_gift_log" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "fromUid" character varying(40) COLLATE "legacy_meta"."ci",
  "fromName" character varying(200) COLLATE "legacy_meta"."ci",
  "toUid" character varying(40) COLLATE "legacy_meta"."ci",
  "toName" character varying(200) COLLATE "legacy_meta"."ci",
  "contents" bytea,
  "rewards" character varying(1000) COLLATE "legacy_meta"."ci",
  "isOpened" smallint,
  "isRewarded" smallint,
  "isThanks" smallint,
  "sendTime" bigint DEFAULT 0 NOT NULL,
  "receiveTime" bigint,
  CONSTRAINT "mail_gift_log_contents_length" CHECK (octet_length("contents") <= 65535),
  CONSTRAINT "mail_gift_log_isOpened_range" CHECK ("isOpened" BETWEEN -128 AND 127),
  CONSTRAINT "mail_gift_log_isRewarded_range" CHECK ("isRewarded" BETWEEN -128 AND 127),
  CONSTRAINT "mail_gift_log_isThanks_range" CHECK ("isThanks" BETWEEN -128 AND 127),
  CONSTRAINT "mail_gift_log_PRIMARY" PRIMARY KEY ("uid", "sendTime")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "mail_gift_log_PRIMARY_pad" ON "cokdb_global"."mail_gift_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("sendTime"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."mod_info" (
  "uid" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "lang" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "server" character varying(255) COLLATE "C",
  CONSTRAINT "mod_info_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "mod_info_PRIMARY_pad" ON "cokdb_global"."mod_info" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "mod_info_mod_info_fk_01" ON "cokdb_global"."mod_info" ((rtrim("server", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "mod_info_lang_index" ON "cokdb_global"."mod_info" ((rtrim("lang", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."monitor_test" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "value" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "monitor_test_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_PRIMARY_pad" ON "cokdb_global"."move_server_record" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_0" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_0_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_0_PRIMARY_pad" ON "cokdb_global"."move_server_record_2024_0" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_1" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_1_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_1_PRIMARY_pad" ON "cokdb_global"."move_server_record_2024_1" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_10" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_10_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_10_PRIMARY_pad" ON "cokdb_global"."move_server_record_2024_10" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_11" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_11_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_11_PRIMARY_pad" ON "cokdb_global"."move_server_record_2024_11" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_12" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_12_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_12_PRIMARY_pad" ON "cokdb_global"."move_server_record_2024_12" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_2" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_2_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_2_PRIMARY_pad" ON "cokdb_global"."move_server_record_2024_2" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_3" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_3_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_3_PRIMARY_pad" ON "cokdb_global"."move_server_record_2024_3" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_4" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_4_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_4_PRIMARY_pad" ON "cokdb_global"."move_server_record_2024_4" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_5" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_5_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_5_PRIMARY_pad" ON "cokdb_global"."move_server_record_2024_5" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_6" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_6_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_6_PRIMARY_pad" ON "cokdb_global"."move_server_record_2024_6" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_7" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_7_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_7_PRIMARY_pad" ON "cokdb_global"."move_server_record_2024_7" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_8" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_8_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_8_PRIMARY_pad" ON "cokdb_global"."move_server_record_2024_8" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."move_server_record_2024_9" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_9_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_9_PRIMARY_pad" ON "cokdb_global"."move_server_record_2024_9" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."mycardrequest" (
  "factradeseq" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "authcode" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "method" character varying(20) COLLATE "legacy_meta"."ci",
  "methodparam" character varying(10) COLLATE "legacy_meta"."ci",
  "tradeseq" character varying(200) COLLATE "legacy_meta"."ci",
  "orderInfo" character varying(300) COLLATE "legacy_meta"."ci" NOT NULL,
  "amount" integer NOT NULL,
  "state" integer DEFAULT 0,
  CONSTRAINT "mycardrequest_PRIMARY" PRIMARY KEY ("factradeseq")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "mycardrequest_PRIMARY_pad" ON "cokdb_global"."mycardrequest" ((rtrim("factradeseq", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."mycardsuccess" (
  "tradeseq" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "mycardid" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "type" character varying(20) COLLATE "legacy_meta"."ci",
  "fulldata" bytea NOT NULL,
  "state" integer DEFAULT 0,
  CONSTRAINT "mycardsuccess_fulldata_length" CHECK (octet_length("fulldata") <= 65535),
  CONSTRAINT "mycardsuccess_PRIMARY" PRIMARY KEY ("tradeseq")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "mycardsuccess_PRIMARY_pad" ON "cokdb_global"."mycardsuccess" ((rtrim("tradeseq", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "mycardsuccess_index_time" ON "cokdb_global"."mycardsuccess" (("time"));
--> statement-breakpoint
CREATE INDEX "mycardsuccess_index_mycardid" ON "cokdb_global"."mycardsuccess" ((rtrim("mycardid", ' ') COLLATE "legacy_meta"."ci"));
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
  "resTypeList" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "neutral_server_info_open_range" CHECK ("open" BETWEEN -128 AND 127),
  CONSTRAINT "neutral_server_info_PRIMARY" PRIMARY KEY ("serverId")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."new_expedition" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "state" integer DEFAULT 0,
  "startTime" bigint DEFAULT 0,
  "endTime" bigint DEFAULT 0,
  "count" integer DEFAULT 0,
  CONSTRAINT "new_expedition_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "new_expedition_PRIMARY_pad" ON "cokdb_global"."new_expedition" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."new_recall_relation" (
  "activeUid" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."outer_mail" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer DEFAULT 0,
  "mailType" integer DEFAULT 0,
  "startTime" bigint,
  "endTime" bigint,
  "regStartTime" bigint,
  "regEndTime" bigint,
  "lastOnlineTime" bigint,
  "levelMin" integer,
  "levelMax" integer,
  "title" bytea,
  "contents" bytea,
  "reward" bytea,
  "updateVersion" character varying(40) COLLATE "legacy_meta"."ci",
  "state" integer,
  "parse" integer,
  "notification" character varying(128) COLLATE "legacy_meta"."ci",
  "addr" bytea,
  CONSTRAINT "outer_mail_title_length" CHECK (octet_length("title") <= 65535),
  CONSTRAINT "outer_mail_contents_length" CHECK (octet_length("contents") <= 65535),
  CONSTRAINT "outer_mail_reward_length" CHECK (octet_length("reward") <= 65535),
  CONSTRAINT "outer_mail_addr_length" CHECK (octet_length("addr") <= 65535),
  CONSTRAINT "outer_mail_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "outer_mail_PRIMARY_pad" ON "cokdb_global"."outer_mail" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "outer_mail_index_startTime" ON "cokdb_global"."outer_mail" (("startTime"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."pay_lottery" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci",
  "remainGold" integer,
  "startTime" integer,
  "endTime" integer,
  "count" character varying(255) COLLATE "legacy_meta"."ci"
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."pay_switch" (
  "Id" integer NOT NULL,
  "status" integer,
  "time" text COLLATE "legacy_meta"."ci"
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."paylog_tmp" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "orderId" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "productId" character varying(10) COLLATE "legacy_meta"."ci" DEFAULT '0' NOT NULL,
  "orderInfo" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '',
  "time" bigint,
  "currency" integer DEFAULT 0,
  "spend" numeric(10,2) DEFAULT 0.00 NOT NULL,
  "paid" numeric(10,2) DEFAULT 0.00,
  "status" integer DEFAULT 0,
  "payLevel" integer NOT NULL,
  "buildingLv" integer DEFAULT 0
);
--> statement-breakpoint
CREATE INDEX "paylog_tmp_index_time_pf" ON "cokdb_global"."paylog_tmp" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("orderId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."paylog_tmp_2" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "orderId" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "productId" character varying(10) COLLATE "legacy_meta"."ci" DEFAULT '0' NOT NULL,
  "orderInfo" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '',
  "time" bigint,
  "currency" integer DEFAULT 0,
  "spend" numeric(10,2) DEFAULT 0.00 NOT NULL,
  "paid" numeric(10,2) DEFAULT 0.00,
  "status" integer DEFAULT 0,
  "payLevel" integer NOT NULL,
  "buildingLv" integer DEFAULT 0,
  "receiverId" character varying(40) COLLATE "legacy_meta"."ci"
);
--> statement-breakpoint
CREATE INDEX "paylog_tmp_2_index_time_pf" ON "cokdb_global"."paylog_tmp_2" (("time"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "paylog_tmp_2_index_orderid" ON "cokdb_global"."paylog_tmp_2" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("orderId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."push_137" (
  "id" smallint NOT NULL,
  "time" smallint DEFAULT 0,
  "title" bytea,
  "contents" bytea,
  "reward" bytea,
  "notification" bytea,
  CONSTRAINT "push_137_id_range" CHECK ("id" BETWEEN -128 AND 127),
  CONSTRAINT "push_137_title_length" CHECK (octet_length("title") <= 65535),
  CONSTRAINT "push_137_contents_length" CHECK (octet_length("contents") <= 65535),
  CONSTRAINT "push_137_reward_length" CHECK (octet_length("reward") <= 65535),
  CONSTRAINT "push_137_notification_length" CHECK (octet_length("notification") <= 65535),
  CONSTRAINT "push_137_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."repeat_name" (
  "gameUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "gameUserName" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "server" character varying(40) COLLATE "legacy_meta"."ci",
  "minServer" character varying(40) COLLATE "legacy_meta"."ci",
  CONSTRAINT "repeat_name_PRIMARY" PRIMARY KEY ("gameUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "repeat_name_PRIMARY_pad" ON "cokdb_global"."repeat_name" ((rtrim("gameUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "repeat_name_server_index" ON "cokdb_global"."repeat_name" ((rtrim("server", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "repeat_name_name_index" ON "cokdb_global"."repeat_name" ((rtrim("gameUserName", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."risk_setting" (
  "id" character varying(40) COLLATE "C" NOT NULL,
  "k1" integer,
  "k2" integer,
  "k3" integer,
  CONSTRAINT "risk_setting_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "risk_setting_PRIMARY_pad" ON "cokdb_global"."risk_setting" ((rtrim("id", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."s10_us1000" (
  "uid" character varying(40) COLLATE "C" DEFAULT '' NOT NULL,
  CONSTRAINT "s10_us1000_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "s10_us1000_PRIMARY_pad" ON "cokdb_global"."s10_us1000" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."server_info" (
  "id" integer NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "cross_fight_server_id" integer,
  "fightRoomSize" integer,
  "beginTime" bigint,
  "endTime" bigint,
  "open_time_info" bytea,
  CONSTRAINT "server_info_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."server_king_info" (
  "Id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 3) NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci",
  "banner" character varying(255) COLLATE "legacy_meta"."ci",
  "kingName" character varying(255) COLLATE "legacy_meta"."ci",
  "kingAllianceName" character varying(255) COLLATE "legacy_meta"."ci",
  "kingAllianceAbbr" character varying(255) COLLATE "legacy_meta"."ci",
  "kingAllianceIcon" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "server_king_info_PRIMARY" PRIMARY KEY ("Id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_global"."server_list" (
  "id" integer DEFAULT 0 NOT NULL,
  "port" integer,
  "name" character varying(64) COLLATE "legacy_meta"."ci",
  "zone" character varying(8) COLLATE "legacy_meta"."ci",
  "ip" character varying(128) COLLATE "legacy_meta"."ci",
  "state" integer DEFAULT 0,
  CONSTRAINT "server_list_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE INDEX "server_list_index_ip" ON "cokdb_global"."server_list" ((rtrim("ip", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."server_merge_task" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "src_server" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "dst_server" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "merge_reason" text COLLATE "legacy_meta"."ci" NOT NULL,
  "apply_time" bigint DEFAULT 0 NOT NULL,
  "merge_time" bigint DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "server_merge_task_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb_global"."server_merge_task"."state" IS '0 Ã¥Â¾â€¦Ã¥Â®Â¡Ã¦Â Â¸ 1 Ã¥Å’Â¹Ã©â€¦Â 2 Ã¨Â¶â€¦Ã¦â€”Â¶ 3 Ã¤Â¸ÂÃ¥ÂÅ’Ã¦â€žÂ 4 Ã§Â­â€°Ã¥Â¾â€¦Ã¥ÂË†Ã¦Å“Â 5 Ã¥ÂË†Ã¦Å“ÂÃ¥Â®Å’Ã¦Ë†Â';
--> statement-breakpoint
CREATE UNIQUE INDEX "server_merge_task_PRIMARY_pad" ON "cokdb_global"."server_merge_task" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."server_push_auxiliary" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "serverStr" bytea,
  "sqlStr" bytea,
  "status" integer DEFAULT 0,
  "operationTime" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "server_push_auxiliary_serverStr_length" CHECK (octet_length("serverStr") <= 65535),
  CONSTRAINT "server_push_auxiliary_sqlStr_length" CHECK (octet_length("sqlStr") <= 16777215),
  CONSTRAINT "server_push_auxiliary_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_push_auxiliary_PRIMARY_pad" ON "cokdb_global"."server_push_auxiliary" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."sign_in_feed" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "feed" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint DEFAULT 0,
  CONSTRAINT "sign_in_feed_PRIMARY" PRIMARY KEY ("feed", "type", "uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "sign_in_feed_PRIMARY_pad" ON "cokdb_global"."sign_in_feed" ((rtrim("feed", ' ') COLLATE "legacy_meta"."ci"), ("type"), (rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "sign_in_feed_index_uid_time" ON "cokdb_global"."sign_in_feed" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."specialreward" (
  "gameuid" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "type" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "state" integer DEFAULT 0,
  "sendTime" bigint,
  CONSTRAINT "specialreward_PRIMARY" PRIMARY KEY ("gameuid", "type")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "specialreward_PRIMARY_pad" ON "cokdb_global"."specialreward" ((rtrim("gameuid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("type", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."user_logging_events" (
  "email" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "event_id" integer NOT NULL,
  "receiveTime" bigint DEFAULT 0,
  "completeTime" bigint DEFAULT 0,
  CONSTRAINT "user_logging_events_PRIMARY" PRIMARY KEY ("email", "event_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_logging_events_PRIMARY_pad" ON "cokdb_global"."user_logging_events" ((rtrim("email", ' ') COLLATE "legacy_meta"."ci"), ("event_id"));
--> statement-breakpoint
CREATE INDEX "user_logging_events_ULE_EVENTID_INDEX_01" ON "cokdb_global"."user_logging_events" (("event_id"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."user_tasks" (
  "email" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "event_id" bigint NOT NULL,
  "type" integer NOT NULL,
  "receiveTime" bigint DEFAULT 0,
  "completeTime" bigint DEFAULT 0,
  CONSTRAINT "user_tasks_PRIMARY" PRIMARY KEY ("email", "event_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_tasks_PRIMARY_pad" ON "cokdb_global"."user_tasks" ((rtrim("email", ' ') COLLATE "legacy_meta"."ci"), ("event_id"));
--> statement-breakpoint
CREATE INDEX "user_tasks_event_id" ON "cokdb_global"."user_tasks" (("event_id"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."userbindmapping" (
  "gameUid" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "mappingType" character varying(20) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "mappingValue" character varying(200) COLLATE "legacy_meta"."ci",
  "lastTime" bigint DEFAULT 0,
  "active" integer DEFAULT 0,
  CONSTRAINT "userbindmapping_PRIMARY" PRIMARY KEY ("gameUid", "mappingType")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "userbindmapping_PRIMARY_pad" ON "cokdb_global"."userbindmapping" ((rtrim("gameUid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("mappingType", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "userbindmapping_pf_pi_lasttime_index" ON "cokdb_global"."userbindmapping" ((rtrim("mappingType", ' ') COLLATE "legacy_meta"."ci"), (rtrim("mappingValue", ' ') COLLATE "legacy_meta"."ci"), ("lastTime"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."userbindmapping_oldbigone" (
  "gameUid" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "mappingType" character varying(20) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "mappingValue" character varying(200) COLLATE "legacy_meta"."ci",
  "lastTime" bigint DEFAULT 0,
  "active" integer DEFAULT 0,
  CONSTRAINT "userbindmapping_oldbigone_PRIMARY" PRIMARY KEY ("gameUid", "mappingType")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "userbindmapping_oldbigone_PRIMARY_pad" ON "cokdb_global"."userbindmapping_oldbigone" ((rtrim("gameUid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("mappingType", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "userbindmapping_oldbigone_pf_pi_lasttime_index" ON "cokdb_global"."userbindmapping_oldbigone" ((rtrim("mappingType", ' ') COLLATE "legacy_meta"."ci"), (rtrim("mappingValue", ' ') COLLATE "legacy_meta"."ci"), ("lastTime"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."userbindmappingreverse" (
  "gameUid" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "mappingType" character varying(20) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "mappingValue" character varying(200) COLLATE "legacy_meta"."ci",
  "lastTime" bigint DEFAULT 0,
  "active" integer DEFAULT 0,
  CONSTRAINT "userbindmappingreverse_PRIMARY" PRIMARY KEY ("gameUid", "mappingType")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "userbindmappingreverse_PRIMARY_pad" ON "cokdb_global"."userbindmappingreverse" ((rtrim("gameUid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("mappingType", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "userbindmappingreverse_pf_pi_lasttime_index" ON "cokdb_global"."userbindmappingreverse" ((rtrim("mappingType", ' ') COLLATE "legacy_meta"."ci"), (rtrim("mappingValue", ' ') COLLATE "legacy_meta"."ci"), ("lastTime"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."userbindmappingreverse_oldbigone" (
  "gameUid" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "mappingType" character varying(20) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "mappingValue" character varying(200) COLLATE "legacy_meta"."ci",
  "lastTime" bigint DEFAULT 0,
  "active" integer DEFAULT 0,
  CONSTRAINT "userbindmappingreverse_oldbigone_PRIMARY" PRIMARY KEY ("gameUid", "mappingType")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "userbindmappingreverse_oldbigone_PRIMARY_pad" ON "cokdb_global"."userbindmappingreverse_oldbigone" ((rtrim("gameUid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("mappingType", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "userbindmappingreverse_oldbigone_pf_pi_lasttime_index" ON "cokdb_global"."userbindmappingreverse_oldbigone" ((rtrim("mappingType", ' ') COLLATE "legacy_meta"."ci"), (rtrim("mappingValue", ' ') COLLATE "legacy_meta"."ci"), ("lastTime"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."usermapping" (
  "gameUid" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "mappingType" character varying(20) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "mappingValue" character varying(200) COLLATE "legacy_meta"."ci",
  "lastTime" bigint DEFAULT 0,
  "active" integer DEFAULT 0,
  CONSTRAINT "usermapping_PRIMARY" PRIMARY KEY ("gameUid", "mappingType")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "usermapping_PRIMARY_pad" ON "cokdb_global"."usermapping" ((rtrim("gameUid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("mappingType", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "usermapping_pf_pi_lasttime_index" ON "cokdb_global"."usermapping" ((rtrim("mappingType", ' ') COLLATE "legacy_meta"."ci"), (rtrim("mappingValue", ' ') COLLATE "legacy_meta"."ci"), ("lastTime"));
--> statement-breakpoint
CREATE TABLE "cokdb_global"."worldcup_team" (
  "version" character varying(255) COLLATE "legacy_meta"."ci",
  "allianceId" character varying(255) COLLATE "legacy_meta"."ci",
  "allianceName" character varying(255) COLLATE "legacy_meta"."ci",
  "fighting" character varying(255) COLLATE "legacy_meta"."ci",
  "leaderUid" character varying(255) COLLATE "legacy_meta"."ci",
  "leaderName" character varying(255) COLLATE "legacy_meta"."ci",
  "addr" character varying(255) COLLATE "legacy_meta"."ci",
  "abbr" character varying(255) COLLATE "legacy_meta"."ci",
  "icon" character varying(255) COLLATE "legacy_meta"."ci",
  "language" character varying(255) COLLATE "legacy_meta"."ci",
  "country" character varying(255) COLLATE "legacy_meta"."ci",
  "createTime" character varying(255) COLLATE "legacy_meta"."ci",
  "serverId" character varying(255) COLLATE "legacy_meta"."ci",
  "regionId" character varying(255) COLLATE "legacy_meta"."ci",
  "score" character varying(255) COLLATE "legacy_meta"."ci",
  "lastTimeIndex" character varying(255) COLLATE "legacy_meta"."ci",
  "timeIndex" character varying(255) COLLATE "legacy_meta"."ci",
  "chooseTimes" character varying(255) COLLATE "legacy_meta"."ci",
  "thumbUps" character varying(255) COLLATE "legacy_meta"."ci",
  "areaId" character varying(255) COLLATE "legacy_meta"."ci",
  "fightServerId" character varying(255) COLLATE "legacy_meta"."ci",
  "fightersJson" text COLLATE "legacy_meta"."ci",
  "rankNum" character varying(255) COLLATE "legacy_meta"."ci",
  "winCount" character varying(255) COLLATE "legacy_meta"."ci",
  "battleCount" character varying(255) COLLATE "legacy_meta"."ci",
  "groupId" character varying(255) COLLATE "legacy_meta"."ci",
  "groupIndex" character varying(255) COLLATE "legacy_meta"."ci",
  "enemyId" character varying(255) COLLATE "legacy_meta"."ci",
  "areaEnemys" character varying(255) COLLATE "legacy_meta"."ci",
  "areaResults" character varying(255) COLLATE "legacy_meta"."ci",
  "finalResult" character varying(255) COLLATE "legacy_meta"."ci",
  "camp" character varying(255) COLLATE "legacy_meta"."ci",
  "groupChampion" character varying(255) COLLATE "legacy_meta"."ci",
  "fightTurns" character varying(255) COLLATE "legacy_meta"."ci",
  "announcement" character varying(255) COLLATE "legacy_meta"."ci",
  "lastAnnounceMillis" character varying(255) COLLATE "legacy_meta"."ci"
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."download" (
  "Id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 12) NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci",
  "app_icon" character varying(255) COLLATE "legacy_meta"."ci",
  "platform" character varying(255) COLLATE "legacy_meta"."ci",
  "link" text COLLATE "legacy_meta"."ci",
  "version" character varying(11) COLLATE "legacy_meta"."ci",
  "status" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "download_PRIMARY" PRIMARY KEY ("Id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."exchange" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 9) NOT NULL,
  "orderId" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '11001' NOT NULL,
  "paidGold" bigint DEFAULT 0 NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci",
  "price" numeric(10,2),
  "images" character varying(255) COLLATE "legacy_meta"."ci",
  "ItemId" text COLLATE "legacy_meta"."ci",
  "monthly_card" integer DEFAULT 2 NOT NULL,
  "status" character varying(255) COLLATE "legacy_meta"."ci",
  "currency" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT 'USD' NOT NULL,
  "pack_type" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '1' NOT NULL,
  "discount" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "exchange_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."goods" (
  "id" character varying(255) COLLATE "legacy_meta"."ci",
  "name" character varying(255) COLLATE "legacy_meta"."ci",
  "icon" character varying(255) COLLATE "legacy_meta"."ci",
  "description" character varying(255) COLLATE "legacy_meta"."ci",
  "type" character varying(255) COLLATE "legacy_meta"."ci",
  "type2" character varying(255) COLLATE "legacy_meta"."ci"
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."goods_name" (
  "id" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci",
  "icon" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "goods_name_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_name_PRIMARY_pad" ON "cokdb_pay"."goods_name" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."logs_packages" (
  "usn" integer,
  "uid" character varying(40) COLLATE "legacy_meta"."ci",
  "packid" integer,
  "price" integer,
  "originalpoints" character varying(50) COLLATE "legacy_meta"."ci",
  "points" character varying(50) COLLATE "legacy_meta"."ci",
  "time" text DEFAULT '0000-00-00 00:00:00',
  "serverid" integer DEFAULT 0,
  "db" character varying(10) COLLATE "legacy_meta"."ci",
  "ip" character varying(40) COLLATE "legacy_meta"."ci",
  "browser" character varying(40) COLLATE "legacy_meta"."ci",
  "os" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "logs_packages_time_temporal" CHECK (legacy_meta.valid_temporal("time", 'datetime', 0))
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."logs_password" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci",
  "name" character varying(50) COLLATE "legacy_meta"."ci",
  "old_password" character varying(50) COLLATE "legacy_meta"."ci",
  "new_password" character varying(50) COLLATE "legacy_meta"."ci",
  "time" text DEFAULT '0000-00-00 00:00:00',
  "serverid" integer DEFAULT 0,
  "ip" character varying(40) COLLATE "legacy_meta"."ci",
  CONSTRAINT "logs_password_time_temporal" CHECK (legacy_meta.valid_temporal("time", 'datetime', 0))
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."logs_points" (
  "usn" integer,
  "Transaction_ID" character varying(255) COLLATE "legacy_meta"."ci",
  "points" character varying(50) COLLATE "legacy_meta"."ci",
  "old_points" character varying(50) COLLATE "legacy_meta"."ci",
  "new_points" character varying(50) COLLATE "legacy_meta"."ci",
  "time" text DEFAULT '0000-00-00 00:00:00',
  CONSTRAINT "logs_points_time_temporal" CHECK (legacy_meta.valid_temporal("time", 'datetime', 0))
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."orders" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "name" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "email" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."sv_ci" DEFAULT '0' NOT NULL,
  "serverId" character varying(255) COLLATE "legacy_meta"."sv_ci",
  "orderId" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "ItemId" text COLLATE "legacy_meta"."ci" NOT NULL,
  "ItemName" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "gold" character varying(255) COLLATE "legacy_meta"."sv_ci",
  "item_number" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "item_price" character varying(10) COLLATE "legacy_meta"."sv_ci" DEFAULT '',
  "item_price_currency" character varying(10) COLLATE "legacy_meta"."ci" NOT NULL,
  "paid_amount" character varying(10) COLLATE "legacy_meta"."sv_ci",
  "paid_amount_currency" character varying(10) COLLATE "legacy_meta"."ci" NOT NULL,
  "txn_id" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "payment_status" character varying(25) COLLATE "legacy_meta"."ci" NOT NULL,
  "created" text NOT NULL,
  "modified" text NOT NULL,
  CONSTRAINT "orders_created_temporal" CHECK (legacy_meta.valid_temporal("created", 'datetime', 0)),
  CONSTRAINT "orders_modified_temporal" CHECK (legacy_meta.valid_temporal("modified", 'datetime', 0)),
  CONSTRAINT "orders_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."package" (
  "Id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "usd" integer DEFAULT 0 NOT NULL,
  "itemId" text COLLATE "legacy_meta"."ci",
  "price" numeric(10,2) DEFAULT 100.00 NOT NULL,
  "status" character varying(255) COLLATE "legacy_meta"."ci",
  "images" bytea DEFAULT '57067_ad1_new' NOT NULL,
  "currency" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT 'USD' NOT NULL,
  "monthly_card" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '1' NOT NULL,
  "gold_pack_only" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '0' NOT NULL,
  "festival_item" character varying(255) COLLATE "legacy_meta"."ci",
  "pack_type" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "package_images_length" CHECK (octet_length("images") <= 255),
  CONSTRAINT "package_PRIMARY" PRIMARY KEY ("Id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."packs" (
  "Id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 96) NOT NULL,
  "name" character varying(100) COLLATE "legacy_meta"."ci",
  "description" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT 'NRAGON MOD SHOP' NOT NULL,
  "contents" text COLLATE "legacy_meta"."ci",
  "images" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT 'novia' NOT NULL,
  "gold" integer DEFAULT 0,
  "price" integer DEFAULT 1000,
  "items" text COLLATE "legacy_meta"."ci",
  "group" character varying(255) COLLATE "legacy_meta"."ci",
  "pack_type" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT 'gold' NOT NULL,
  "status" integer DEFAULT 0 NOT NULL,
  "popup_image" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT 'novia' NOT NULL,
  CONSTRAINT "packs_PRIMARY" PRIMARY KEY ("Id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."payfive" (
  "date" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "country" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "paysum" numeric(20,2),
  "paytimes" integer,
  CONSTRAINT "payfive_PRIMARY" PRIMARY KEY ("date", "pf", "country")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "payfive_PRIMARY_pad" ON "cokdb_pay"."payfive" ((rtrim("date", ' ') COLLATE "legacy_meta"."ci"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"), (rtrim("country", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "payfive_index" ON "cokdb_pay"."payfive" ((rtrim("country", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."payments" (
  "payment_id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci",
  "uid" character varying(11) COLLATE "legacy_meta"."ci",
  "item_name" character varying(255) COLLATE "legacy_meta"."ci",
  "item_number" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "txn_id" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "payment_gross" numeric(10,2) NOT NULL,
  "currency_code" character varying(5) COLLATE "legacy_meta"."ci" NOT NULL,
  "payment_status" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  CONSTRAINT "payments_PRIMARY" PRIMARY KEY ("payment_id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."payments_api" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "paymentId" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "orderId" character varying(255) COLLATE "legacy_meta"."ci",
  "productId" character varying(255) COLLATE "legacy_meta"."ci",
  "gameUid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "payerId" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "successTimestamp" text DEFAULT legacy_meta.utc_now(0) NOT NULL,
  "status" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '0' NOT NULL,
  CONSTRAINT "payments_api_successTimestamp_temporal" CHECK (legacy_meta.valid_temporal("successTimestamp", 'timestamp', 0)),
  CONSTRAINT "payments_api_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE FUNCTION legacy_meta."ts_8858daa3dc44eaa16a13"() RETURNS trigger LANGUAGE plpgsql AS $body$
BEGIN
  IF NEW."successTimestamp" IS NULL THEN
    NEW."successTimestamp" := legacy_meta.utc_now(0);
  END IF;
  RETURN NEW;
END $body$;
--> statement-breakpoint
CREATE TRIGGER c_ts_8858daa3dc44eaa16a13 BEFORE INSERT OR UPDATE ON "cokdb_pay"."payments_api" FOR EACH ROW EXECUTE FUNCTION legacy_meta."ts_8858daa3dc44eaa16a13"();
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."paypal_payments" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 2) NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci",
  "name" character varying(255) COLLATE "legacy_meta"."ci",
  "pack_type" character varying(255) COLLATE "legacy_meta"."ci",
  "item_number" character varying(50) COLLATE "legacy_meta"."ci",
  "item_name" character varying(255) COLLATE "legacy_meta"."ci",
  "item_price" numeric(10,2),
  "item_price_currency" character varying(10) COLLATE "legacy_meta"."ci",
  "payer_id" character varying(50) COLLATE "legacy_meta"."ci",
  "payer_name" character varying(50) COLLATE "legacy_meta"."ci",
  "payer_email" character varying(50) COLLATE "legacy_meta"."ci",
  "payer_country" character varying(20) COLLATE "legacy_meta"."ci",
  "merchant_id" character varying(255) COLLATE "legacy_meta"."ci",
  "merchant_email" character varying(50) COLLATE "legacy_meta"."ci",
  "order_id" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "transaction_id" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "paid_amount" numeric(10,2) NOT NULL,
  "paid_amount_currency" character varying(10) COLLATE "legacy_meta"."ci" NOT NULL,
  "payment_source" character varying(50) COLLATE "legacy_meta"."ci",
  "payment_status" character varying(25) COLLATE "legacy_meta"."ci" NOT NULL,
  "created" text NOT NULL,
  "modified" text NOT NULL,
  CONSTRAINT "paypal_payments_created_temporal" CHECK (legacy_meta.valid_temporal("created", 'datetime', 0)),
  CONSTRAINT "paypal_payments_modified_temporal" CHECK (legacy_meta.valid_temporal("modified", 'datetime', 0)),
  CONSTRAINT "paypal_payments_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."payrecord" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "orderId" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "method" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "request" bytea,
  "postParam" bytea,
  "result" bytea,
  "time" bigint,
  "lastCheckTime" integer,
  "checkTimes" integer DEFAULT 0,
  "checkHistory" bytea,
  "checkResult" integer DEFAULT 0,
  CONSTRAINT "payrecord_request_length" CHECK (octet_length("request") <= 65535),
  CONSTRAINT "payrecord_postParam_length" CHECK (octet_length("postParam") <= 65535),
  CONSTRAINT "payrecord_result_length" CHECK (octet_length("result") <= 65535),
  CONSTRAINT "payrecord_checkHistory_length" CHECK (octet_length("checkHistory") <= 65535),
  CONSTRAINT "payrecord_PRIMARY" PRIMARY KEY ("uid", "orderId", "method")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "payrecord_PRIMARY_pad" ON "cokdb_pay"."payrecord" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("orderId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("method", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "payrecord_index" ON "cokdb_pay"."payrecord" (("time"), (rtrim("method", ' ') COLLATE "legacy_meta"."ci"), ("checkResult"));
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."points_packages" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 2) NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "points" integer NOT NULL,
  "price" numeric(10,2) NOT NULL,
  CONSTRAINT "points_packages_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."products" (
  "id" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT 'Land of WaR Shop' NOT NULL,
  "price" character varying(255) COLLATE "legacy_meta"."ci",
  "shop_type" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT 'inapp' NOT NULL,
  CONSTRAINT "products_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "products_PRIMARY_pad" ON "cokdb_pay"."products" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."products_web" (
  "Id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 2) NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci",
  "price" character varying(255) COLLATE "legacy_meta"."ci",
  "type" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "products_web_PRIMARY" PRIMARY KEY ("Id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."transactions" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 3) NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci",
  "orderId" character varying(255) COLLATE "legacy_meta"."ci",
  "ItemId" character varying(255) COLLATE "legacy_meta"."ci",
  "ItemName" character varying(255) COLLATE "legacy_meta"."ci",
  "item_number" character varying(50) COLLATE "legacy_meta"."ci",
  "item_name" character varying(255) COLLATE "legacy_meta"."ci",
  "item_price" numeric(10,2),
  "item_price_currency" character varying(10) COLLATE "legacy_meta"."ci",
  "payer_id" character varying(50) COLLATE "legacy_meta"."ci",
  "payer_name" character varying(50) COLLATE "legacy_meta"."ci",
  "payer_email" character varying(50) COLLATE "legacy_meta"."ci",
  "payer_country" character varying(20) COLLATE "legacy_meta"."ci",
  "merchant_id" character varying(255) COLLATE "legacy_meta"."ci",
  "merchant_email" character varying(50) COLLATE "legacy_meta"."ci",
  "order_id" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "transaction_id" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "paid_amount" numeric(10,2) NOT NULL,
  "paid_amount_currency" character varying(10) COLLATE "legacy_meta"."ci" NOT NULL,
  "payment_source" character varying(50) COLLATE "legacy_meta"."ci",
  "payment_status" character varying(25) COLLATE "legacy_meta"."ci" NOT NULL,
  "created" text NOT NULL,
  "modified" text NOT NULL,
  CONSTRAINT "transactions_created_temporal" CHECK (legacy_meta.valid_temporal("created", 'datetime', 0)),
  CONSTRAINT "transactions_modified_temporal" CHECK (legacy_meta.valid_temporal("modified", 'datetime', 0)),
  CONSTRAINT "transactions_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."users" (
  "usn" bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1216) NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "usd" integer DEFAULT 0 NOT NULL,
  "name" character varying(15) COLLATE "legacy_meta"."ci",
  "password" character varying(255) COLLATE "legacy_meta"."ci",
  "totalpaid" integer DEFAULT 0,
  "lastbuytime" text DEFAULT '0000-00-00 00:00:00',
  "server" integer DEFAULT 0,
  "db" character varying(8) COLLATE "legacy_meta"."ci",
  "email" character varying(40) COLLATE "legacy_meta"."ci",
  "deviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "profile_image" character varying(255) COLLATE "legacy_meta"."ci",
  "banned" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "users_lastbuytime_temporal" CHECK (legacy_meta.valid_temporal("lastbuytime", 'datetime', 0)),
  CONSTRAINT "users_PRIMARY" PRIMARY KEY ("usn")
);
--> statement-breakpoint
CREATE TABLE "cokdb_pay"."video" (
  "Id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 3) NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci",
  "video_key" text COLLATE "legacy_meta"."ci" NOT NULL,
  "status" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '0',
  CONSTRAINT "video_PRIMARY" PRIMARY KEY ("Id")
);
--> statement-breakpoint
CREATE TABLE "opencok_chat"."chat_message" (
  "sequence_id" numeric(20,0) DEFAULT legacy_meta.next_unsigned('opencok_chat.chat_message') NOT NULL,
  "room_key" character varying(160) COLLATE "C" NOT NULL,
  "sender_uid" character varying(40) COLLATE "C" NOT NULL,
  "idempotency_key" bytea NOT NULL,
  "body" text COLLATE "C" NOT NULL,
  "created_at" text NOT NULL,
  "expires_at" text NOT NULL,
  CONSTRAINT "chat_message_sequence_id_range" CHECK ("sequence_id" >= 0 AND "sequence_id" <= 18446744073709551615),
  CONSTRAINT "chat_message_idempotency_key_length" CHECK (octet_length("idempotency_key") <= 64),
  CONSTRAINT "chat_message_created_at_temporal" CHECK (legacy_meta.valid_temporal("created_at", 'datetime', 3)),
  CONSTRAINT "chat_message_expires_at_temporal" CHECK (legacy_meta.valid_temporal("expires_at", 'datetime', 3)),
  CONSTRAINT "chat_message_PRIMARY" PRIMARY KEY ("sequence_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "chat_message_uq_sender_room_client" ON "opencok_chat"."chat_message" ((rtrim("sender_uid", ' ') COLLATE "C"), (rtrim("room_key", ' ') COLLATE "C"), ("idempotency_key"));
--> statement-breakpoint
CREATE INDEX "chat_message_idx_room_sequence" ON "opencok_chat"."chat_message" ((rtrim("room_key", ' ') COLLATE "C"), ("sequence_id"));
--> statement-breakpoint
CREATE INDEX "chat_message_idx_message_expiry" ON "opencok_chat"."chat_message" (("expires_at"));
--> statement-breakpoint
INSERT INTO legacy_meta.unsigned_sequences VALUES ('opencok_chat.chat_message', 1);
--> statement-breakpoint
CREATE TABLE "opencok_chat"."chat_session" (
  "token_hash" bytea NOT NULL,
  "uid" character varying(40) COLLATE "C" NOT NULL,
  "created_at" text NOT NULL,
  "expires_at" text NOT NULL,
  CONSTRAINT "chat_session_token_hash_length" CHECK (octet_length("token_hash") = 32),
  CONSTRAINT "chat_session_created_at_temporal" CHECK (legacy_meta.valid_temporal("created_at", 'datetime', 3)),
  CONSTRAINT "chat_session_expires_at_temporal" CHECK (legacy_meta.valid_temporal("expires_at", 'datetime', 3)),
  CONSTRAINT "chat_session_PRIMARY" PRIMARY KEY ("token_hash")
);
--> statement-breakpoint
CREATE INDEX "chat_session_idx_session_uid_expiry" ON "opencok_chat"."chat_session" ((rtrim("uid", ' ') COLLATE "C"), ("expires_at"));
--> statement-breakpoint
CREATE INDEX "chat_session_idx_session_expiry" ON "opencok_chat"."chat_session" (("expires_at"));
--> statement-breakpoint
ALTER TABLE "cokdb_global"."logging_event_property" ADD CONSTRAINT "logging_event_property_logging_event_property_ibfk_1" FOREIGN KEY ("event_id") REFERENCES "cokdb_global"."logging_event" ("event_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
--> statement-breakpoint
ALTER TABLE "cokdb_global"."user_tasks" ADD CONSTRAINT "user_tasks_user_tasks_ibfk_1" FOREIGN KEY ("event_id") REFERENCES "cokdb_global"."logging_event" ("event_id") ON DELETE CASCADE ON UPDATE CASCADE;
