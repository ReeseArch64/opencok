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
CREATE SCHEMA "cokdb1";
--> statement-breakpoint
INSERT INTO legacy_meta.manifest VALUES ('224e7a718dad6a9d807fc1bec92857e2a3ca23e98a91d6c7d39739b09e8ffedd', 'realm');
--> statement-breakpoint
CREATE TABLE "cokdb1"."ability_page" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "page" integer DEFAULT 0 NOT NULL,
  "ability" bytea,
  CONSTRAINT "ability_page_ability_length" CHECK (octet_length("ability") <= 65535),
  CONSTRAINT "ability_page_PRIMARY" PRIMARY KEY ("uid", "page")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "ability_page_PRIMARY_pad" ON "cokdb1"."ability_page" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("page"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."accept_fb_record" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  CONSTRAINT "accept_fb_record_PRIMARY" PRIMARY KEY ("uid", "uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "accept_fb_record_PRIMARY_pad" ON "cokdb1"."accept_fb_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."account_lock" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "lastLoginIp" character varying(50) COLLATE "legacy_meta"."ci",
  "lastDeviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "lockSwitch" smallint,
  "locked" smallint,
  "emailAddr" character varying(200) COLLATE "legacy_meta"."ci",
  "password" character varying(20) COLLATE "legacy_meta"."ci",
  "verifCode" character varying(4) COLLATE "legacy_meta"."ci",
  "verifCodeTime" bigint,
  "todayTime" bigint,
  "passwordErrorNum" integer,
  "passwordErrorTime" bigint,
  CONSTRAINT "account_lock_lockSwitch_range" CHECK ("lockSwitch" BETWEEN -128 AND 127),
  CONSTRAINT "account_lock_locked_range" CHECK ("locked" BETWEEN -128 AND 127),
  CONSTRAINT "account_lock_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "account_lock_PRIMARY_pad" ON "cokdb1"."account_lock" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_0" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2024_0_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2024_0_PRIMARY_pad" ON "cokdb1"."action_cost_record_2024_0" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_1" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2024_1_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2024_1_PRIMARY_pad" ON "cokdb1"."action_cost_record_2024_1" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_2" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2024_2_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2024_2_PRIMARY_pad" ON "cokdb1"."action_cost_record_2024_2" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_3" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2024_3_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2024_3_PRIMARY_pad" ON "cokdb1"."action_cost_record_2024_3" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_4" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2024_4_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2024_4_PRIMARY_pad" ON "cokdb1"."action_cost_record_2024_4" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_5" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2024_5_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2024_5_PRIMARY_pad" ON "cokdb1"."action_cost_record_2024_5" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_6" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2024_6_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2024_6_PRIMARY_pad" ON "cokdb1"."action_cost_record_2024_6" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_7" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2024_7_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2024_7_PRIMARY_pad" ON "cokdb1"."action_cost_record_2024_7" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_8" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2024_8_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2024_8_PRIMARY_pad" ON "cokdb1"."action_cost_record_2024_8" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2024_9" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2024_9_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2024_9_PRIMARY_pad" ON "cokdb1"."action_cost_record_2024_9" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_0" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2026_0_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2026_0_PRIMARY_pad" ON "cokdb1"."action_cost_record_2026_0" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_1" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2026_1_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2026_1_PRIMARY_pad" ON "cokdb1"."action_cost_record_2026_1" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_10" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2026_10_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2026_10_PRIMARY_pad" ON "cokdb1"."action_cost_record_2026_10" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_11" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2026_11_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2026_11_PRIMARY_pad" ON "cokdb1"."action_cost_record_2026_11" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_2" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2026_2_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2026_2_PRIMARY_pad" ON "cokdb1"."action_cost_record_2026_2" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_3" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2026_3_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2026_3_PRIMARY_pad" ON "cokdb1"."action_cost_record_2026_3" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_4" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2026_4_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2026_4_PRIMARY_pad" ON "cokdb1"."action_cost_record_2026_4" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_5" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2026_5_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2026_5_PRIMARY_pad" ON "cokdb1"."action_cost_record_2026_5" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_6" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2026_6_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2026_6_PRIMARY_pad" ON "cokdb1"."action_cost_record_2026_6" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_7" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2026_7_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2026_7_PRIMARY_pad" ON "cokdb1"."action_cost_record_2026_7" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_8" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2026_8_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2026_8_PRIMARY_pad" ON "cokdb1"."action_cost_record_2026_8" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2026_9" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2026_9_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2026_9_PRIMARY_pad" ON "cokdb1"."action_cost_record_2026_9" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_0" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2027_0_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2027_0_PRIMARY_pad" ON "cokdb1"."action_cost_record_2027_0" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_1" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2027_1_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2027_1_PRIMARY_pad" ON "cokdb1"."action_cost_record_2027_1" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_10" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2027_10_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2027_10_PRIMARY_pad" ON "cokdb1"."action_cost_record_2027_10" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_11" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2027_11_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2027_11_PRIMARY_pad" ON "cokdb1"."action_cost_record_2027_11" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_2" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2027_2_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2027_2_PRIMARY_pad" ON "cokdb1"."action_cost_record_2027_2" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_3" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2027_3_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2027_3_PRIMARY_pad" ON "cokdb1"."action_cost_record_2027_3" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_4" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2027_4_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2027_4_PRIMARY_pad" ON "cokdb1"."action_cost_record_2027_4" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_5" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2027_5_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2027_5_PRIMARY_pad" ON "cokdb1"."action_cost_record_2027_5" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_6" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2027_6_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2027_6_PRIMARY_pad" ON "cokdb1"."action_cost_record_2027_6" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_7" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2027_7_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2027_7_PRIMARY_pad" ON "cokdb1"."action_cost_record_2027_7" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_8" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2027_8_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2027_8_PRIMARY_pad" ON "cokdb1"."action_cost_record_2027_8" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_cost_record_2027_9" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action_type" integer NOT NULL,
  "cost_type" character varying(255) COLLATE "legacy_meta"."ci",
  "cost_value" character varying(255) COLLATE "legacy_meta"."ci",
  "get_type" character varying(255) COLLATE "legacy_meta"."ci",
  "get_value" character varying(255) COLLATE "legacy_meta"."ci",
  "param1" character varying(255) COLLATE "legacy_meta"."ci",
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  "update_time" bigint NOT NULL,
  CONSTRAINT "action_cost_record_2027_9_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "action_cost_record_2027_9_PRIMARY_pad" ON "cokdb1"."action_cost_record_2027_9" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."action_record_pack" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer NOT NULL,
  "type1" integer,
  "time" bigint NOT NULL,
  "powerDelta" bigint,
  "deadDelta" integer DEFAULT 0 NOT NULL,
  "armyDelta" integer DEFAULT 0 NOT NULL,
  "item" character varying(40) COLLATE "legacy_meta"."ci",
  "param" character varying(1024) COLLATE "legacy_meta"."ci",
  "gold" integer
);
--> statement-breakpoint
CREATE INDEX "action_record_pack_uid" ON "cokdb1"."action_record_pack" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"), ("type1"));
--> statement-breakpoint
CREATE INDEX "action_record_pack_time" ON "cokdb1"."action_record_pack" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."activation" (
  "code" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "series" integer,
  "user" character varying(40) COLLATE "legacy_meta"."ci",
  "state" integer DEFAULT 0,
  CONSTRAINT "activation_PRIMARY" PRIMARY KEY ("code")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "activation_PRIMARY_pad" ON "cokdb1"."activation" ((rtrim("code", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "activation_index_user" ON "cokdb1"."activation" ((rtrim("user", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."activity" (
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
CREATE TABLE "cokdb1"."activity_cost" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer NOT NULL,
  "total" bigint,
  "para1" bigint,
  "para2" bigint,
  "lv" integer,
  "updateTime" bigint,
  "getLv" character varying(40) COLLATE "legacy_meta"."ci",
  CONSTRAINT "activity_cost_PRIMARY" PRIMARY KEY ("uid", "type")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."activity_cost"."para1" IS 'gold_paid';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."activity_cost"."para2" IS 'gold_free';
--> statement-breakpoint
CREATE UNIQUE INDEX "activity_cost_PRIMARY_pad" ON "cokdb1"."activity_cost" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."activity_cost_log" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "userId" character varying(40) COLLATE "legacy_meta"."ci",
  "type" integer,
  "total" bigint,
  "lv" integer,
  "time" bigint,
  CONSTRAINT "activity_cost_log_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "activity_cost_log_PRIMARY_pad" ON "cokdb1"."activity_cost_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."activity_group_buys" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "curRound" integer NOT NULL,
  "startTime" bigint,
  "endTime" bigint,
  "roundInfo" text COLLATE "legacy_meta"."ci",
  CONSTRAINT "activity_group_buys_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "activity_group_buys_PRIMARY_pad" ON "cokdb1"."activity_group_buys" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."activity_minstrel" (
  "uid" character varying(32) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "listen" integer NOT NULL,
  "listentime" bigint,
  "share" integer,
  "sharetime" bigint,
  "reward" integer,
  "rewardtime" bigint,
  "resettime" bigint,
  CONSTRAINT "activity_minstrel_PRIMARY" PRIMARY KEY ("uid", "type")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "activity_minstrel_PRIMARY_pad" ON "cokdb1"."activity_minstrel" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."activity_monster" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "id" integer NOT NULL,
  "flushTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "activity_monster_PRIMARY" PRIMARY KEY ("uid", "id", "flushTime")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "activity_monster_PRIMARY_pad" ON "cokdb1"."activity_monster" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("id"), ("flushTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."activity_new" (
  "type" character varying(11) COLLATE "legacy_meta"."ci" NOT NULL,
  "activityInfo" character varying(2000) COLLATE "legacy_meta"."ci" DEFAULT '',
  CONSTRAINT "activity_new_PRIMARY" PRIMARY KEY ("type")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "activity_new_PRIMARY_pad" ON "cokdb1"."activity_new" ((rtrim("type", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."ad_building_attachment" (
  "uuid" character varying(36) COLLATE "legacy_meta"."ci" NOT NULL,
  "serverid" integer,
  "skillid" integer,
  "cdtime" bigint,
  "skillstate" integer,
  "donateresource" character varying(300) COLLATE "legacy_meta"."ci"
);
--> statement-breakpoint
CREATE UNIQUE INDEX "ad_building_attachment_uss_index" ON "cokdb1"."ad_building_attachment" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"), ("serverid"), ("skillid"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."ad_mat" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "matId" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  CONSTRAINT "ad_mat_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "ad_mat_PRIMARY_pad" ON "cokdb1"."ad_mat" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "ad_mat_index_query" ON "cokdb1"."ad_mat" ((rtrim("matId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."ad_reward" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "device" character varying(255) COLLATE "legacy_meta"."ci",
  "time" bigint,
  "state" integer,
  "location" character varying(40) COLLATE "legacy_meta"."ci",
  "dplink_type" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "ad_reward_PRIMARY" PRIMARY KEY ("uid", "type", "dplink_type")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "ad_reward_PRIMARY_pad" ON "cokdb1"."ad_reward" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("type", ' ') COLLATE "legacy_meta"."ci"), ("dplink_type"));
--> statement-breakpoint
CREATE INDEX "ad_reward_index_time" ON "cokdb1"."ad_reward" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."admin" (
  "uid" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "username" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "passmd5" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "language" character varying(8) COLLATE "legacy_meta"."ci" NOT NULL,
  "auth" text COLLATE "legacy_meta"."ci" NOT NULL,
  "groupid" integer DEFAULT 0 NOT NULL,
  "addtime" bigint NOT NULL,
  "lastactive" bigint NOT NULL,
  "roleIds" character varying(100) COLLATE "legacy_meta"."ci",
  "default_module_id" integer DEFAULT -1,
  CONSTRAINT "admin_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."affairs" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer NOT NULL,
  "ownerId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "affairId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "contentsId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "rewardTime" bigint NOT NULL,
  "rewardNum" integer NOT NULL,
  "opt" integer NOT NULL,
  CONSTRAINT "affairs_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "affairs_PRIMARY_pad" ON "cokdb1"."affairs" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "affairs_index_type" ON "cokdb1"."affairs" (("type"), ("rewardTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."affairs_value" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "people" integer DEFAULT 0 NOT NULL,
  "refreshTime" bigint NOT NULL,
  "leagueTime" bigint NOT NULL,
  CONSTRAINT "affairs_value_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "affairs_value_PRIMARY_pad" ON "cokdb1"."affairs_value" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "alliancename" character varying(40) COLLATE "legacy_meta"."ci",
  "abbr" character varying(10) COLLATE "legacy_meta"."ci",
  "abbrRename" integer DEFAULT 0,
  "intro" character varying(200) COLLATE "legacy_meta"."ci",
  "announce" character varying(200) COLLATE "legacy_meta"."ci",
  "icon" character varying(40) COLLATE "legacy_meta"."ci",
  "language" character varying(40) COLLATE "legacy_meta"."ci",
  "country" character varying(40) COLLATE "legacy_meta"."ci",
  "curMember" integer DEFAULT 0,
  "maxMember" integer,
  "recruit" integer,
  "oldfightpower" integer,
  "giftlevel" integer DEFAULT 0,
  "alliancepoint" bigint,
  "reicon" integer DEFAULT 0,
  "rankone" character varying(10) COLLATE "legacy_meta"."ci",
  "ranktwo" character varying(10) COLLATE "legacy_meta"."ci",
  "rankthree" character varying(10) COLLATE "legacy_meta"."ci",
  "rankfour" character varying(10) COLLATE "legacy_meta"."ci",
  "rankfive" character varying(10) COLLATE "legacy_meta"."ci",
  "createtime" bigint NOT NULL,
  "dau" integer DEFAULT 0,
  "rallyPoint" integer,
  "ally" character varying(255) COLLATE "legacy_meta"."ci",
  "enemy" character varying(255) COLLATE "legacy_meta"."ci",
  "other" character varying(255) COLLATE "legacy_meta"."ci",
  "powerRestriction" bigint DEFAULT 0,
  "castleRestriction" integer DEFAULT 0,
  "camp" integer DEFAULT 0,
  "crossFightEnemy" character varying(255) COLLATE "legacy_meta"."ci",
  "ckfThroneFightFlag" integer DEFAULT 0,
  "cdfIndex" integer,
  "cdfVersion" integer,
  "targetScience" character varying(255) COLLATE "legacy_meta"."ci",
  "permission" character varying(255) COLLATE "legacy_meta"."ci",
  "wood" bigint DEFAULT 0,
  "food" bigint DEFAULT 0,
  "iron" bigint DEFAULT 0,
  "stone" bigint DEFAULT 0,
  "sandstone" bigint DEFAULT 0,
  "diamond" bigint DEFAULT 0,
  "marble" bigint DEFAULT 0,
  "granite" bigint DEFAULT 0,
  "limestone" bigint DEFAULT 0,
  "donateItem" character varying(255) COLLATE "legacy_meta"."ci",
  "bannerStyle" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "taskNum" integer DEFAULT 0,
  "taskLimit" character varying(255) COLLATE "legacy_meta"."ci",
  "taskFlushTime" bigint DEFAULT 0,
  CONSTRAINT "alliance_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."alliance"."targetScience" IS '科技引导信息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."alliance"."permission" IS '联盟成员权限';
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_PRIMARY_pad" ON "cokdb1"."alliance" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_name_idx" ON "cokdb1"."alliance" ((rtrim("alliancename", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_apply" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "userId" character varying(40) COLLATE "legacy_meta"."ci",
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci",
  "message" bytea,
  "type" integer,
  "applyTime" bigint DEFAULT 0,
  CONSTRAINT "alliance_apply_message_length" CHECK (octet_length("message") <= 65535),
  CONSTRAINT "alliance_apply_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_apply_PRIMARY_pad" ON "cokdb1"."alliance_apply" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_apply_index_user" ON "cokdb1"."alliance_apply" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_apply_index_alliance" ON "cokdb1"."alliance_apply" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_apply_index_time" ON "cokdb1"."alliance_apply" (("applyTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_battle_record" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "attAllianceId" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "defAllianceId" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "type" integer NOT NULL,
  "report" bytea NOT NULL,
  "timeStamp" bigint NOT NULL,
  CONSTRAINT "alliance_battle_record_report_length" CHECK (octet_length("report") <= 65535),
  CONSTRAINT "alliance_battle_record_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_battle_record_PRIMARY_pad" ON "cokdb1"."alliance_battle_record" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_battle_team" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer NOT NULL,
  "targetId" integer NOT NULL,
  "targetUid" character varying(40) COLLATE "legacy_meta"."ci",
  "targetName" character varying(255) COLLATE "legacy_meta"."ci",
  "targetPic" character varying(40) COLLATE "legacy_meta"."ci",
  "targetAName" character varying(40) COLLATE "legacy_meta"."ci",
  "targetAAbbr" character varying(40) COLLATE "legacy_meta"."ci",
  "targetAIcon" character varying(40) COLLATE "legacy_meta"."ci",
  "targetType" integer DEFAULT 0,
  "leaderUid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "leaderName" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "leaderId" integer,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceName" character varying(40) COLLATE "legacy_meta"."ci",
  "allianceAbbr" character varying(40) COLLATE "legacy_meta"."ci",
  "allianceIcon" character varying(40) COLLATE "legacy_meta"."ci",
  "maxSoldiers" integer NOT NULL,
  "waitTime" bigint NOT NULL,
  "createTime" bigint NOT NULL,
  "worldId" integer DEFAULT 0 NOT NULL,
  "failBackItem" integer DEFAULT 0,
  "superTeam" integer DEFAULT 0,
  CONSTRAINT "alliance_battle_team_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_battle_team_PRIMARY_pad" ON "cokdb1"."alliance_battle_team" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_blacklist" (
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "black" character varying(500) COLLATE "legacy_meta"."ci",
  "white" character varying(500) COLLATE "legacy_meta"."ci",
  CONSTRAINT "alliance_blacklist_PRIMARY" PRIMARY KEY ("allianceId")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."alliance_blacklist"."allianceId" IS '联盟唯一编号';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."alliance_blacklist"."black" IS '联盟黑名单';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."alliance_blacklist"."white" IS '联盟白名单';
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_blacklist_PRIMARY_pad" ON "cokdb1"."alliance_blacklist" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_boss" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemNum" integer DEFAULT 0,
  "bossLevel" character varying(255) COLLATE "legacy_meta"."ci",
  "todayCount" integer DEFAULT 0,
  "lastChallengeTime" bigint DEFAULT 0,
  "bossId" character varying(255) COLLATE "legacy_meta"."ci",
  "maxHp" integer DEFAULT 0,
  "hp" integer DEFAULT 0,
  "startTime" bigint DEFAULT 0,
  "endTime" bigint DEFAULT 0,
  "power" integer DEFAULT 0,
  "rewards" character varying(255) COLLATE "legacy_meta"."ci",
  "pointId" integer DEFAULT 0,
  "attackerNum" integer DEFAULT 0,
  "attackTimes" integer DEFAULT 0,
  "killUser" character varying(255) COLLATE "legacy_meta"."ci",
  "lastHurt" integer DEFAULT 0,
  "userAttackInfo" text COLLATE "legacy_meta"."ci",
  CONSTRAINT "alliance_boss_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_boss_PRIMARY_pad" ON "cokdb1"."alliance_boss" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_boss_rank" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci",
  "bossId" character varying(40) COLLATE "legacy_meta"."ci",
  "useTime" bigint DEFAULT 0,
  CONSTRAINT "alliance_boss_rank_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_boss_rank_PRIMARY_pad" ON "cokdb1"."alliance_boss_rank" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_boss_record" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci",
  "bossId" character varying(40) COLLATE "legacy_meta"."ci",
  "maxHp" integer DEFAULT 0,
  "hp" integer DEFAULT 0,
  "startTime" bigint DEFAULT 0,
  "endTime" bigint DEFAULT 0,
  "pointId" integer DEFAULT 0,
  "attackerNum" integer DEFAULT 0,
  "attackTimes" integer DEFAULT 0,
  "killUser" character varying(40) COLLATE "legacy_meta"."ci",
  "lastHurt" integer DEFAULT 0,
  "userAttackInfo" text COLLATE "legacy_meta"."ci",
  CONSTRAINT "alliance_boss_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_boss_record_PRIMARY_pad" ON "cokdb1"."alliance_boss_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_build_cost_record" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer NOT NULL,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  "time" bigint NOT NULL,
  CONSTRAINT "alliance_build_cost_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_build_cost_record_PRIMARY_pad" ON "cokdb1"."alliance_build_cost_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_build_cost_record_index_user" ON "cokdb1"."alliance_build_cost_record" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE INDEX "alliance_build_cost_record_index_type" ON "cokdb1"."alliance_build_cost_record" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_comment" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci",
  "time" bigint,
  "senderUid" character varying(40) COLLATE "legacy_meta"."ci",
  "senderAllianceId" character varying(40) COLLATE "legacy_meta"."ci",
  "message" bytea,
  "lang" character varying(10) COLLATE "legacy_meta"."ci",
  "type" integer,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "abbr" character varying(10) COLLATE "legacy_meta"."ci",
  "icon" character varying(10) COLLATE "legacy_meta"."ci",
  "username" character varying(40) COLLATE "legacy_meta"."ci",
  "userpic" character varying(40) COLLATE "legacy_meta"."ci",
  CONSTRAINT "alliance_comment_message_length" CHECK (octet_length("message") <= 65535),
  CONSTRAINT "alliance_comment_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_comment_PRIMARY_pad" ON "cokdb1"."alliance_comment" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_comment_index_allianceId" ON "cokdb1"."alliance_comment" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_comment_shield" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci",
  "type" integer,
  "icon" character varying(10) COLLATE "legacy_meta"."ci",
  "abbr" character varying(10) COLLATE "legacy_meta"."ci",
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  CONSTRAINT "alliance_comment_shield_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_comment_shield_PRIMARY_pad" ON "cokdb1"."alliance_comment_shield" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_comment_shield_index_allianceId" ON "cokdb1"."alliance_comment_shield" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_diplomacy" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "ally" bytea,
  "enemy" bytea,
  "other" bytea,
  CONSTRAINT "alliance_diplomacy_ally_length" CHECK (octet_length("ally") <= 65535),
  CONSTRAINT "alliance_diplomacy_enemy_length" CHECK (octet_length("enemy") <= 65535),
  CONSTRAINT "alliance_diplomacy_other_length" CHECK (octet_length("other") <= 65535),
  CONSTRAINT "alliance_diplomacy_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_diplomacy_PRIMARY_pad" ON "cokdb1"."alliance_diplomacy" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_donate" (
  "uerid" character varying(45) COLLATE "legacy_meta"."sv_ci" NOT NULL,
  "scienceid" integer NOT NULL,
  "highres" character varying(45) COLLATE "legacy_meta"."sv_ci",
  "midres" character varying(45) COLLATE "legacy_meta"."sv_ci",
  "lowres" character varying(45) COLLATE "legacy_meta"."sv_ci",
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
  CONSTRAINT "alliance_donate_PRIMARY" PRIMARY KEY ("uerid", "scienceid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_donate_PRIMARY_pad" ON "cokdb1"."alliance_donate" ((rtrim("uerid", ' ') COLLATE "legacy_meta"."sv_ci"), ("scienceid"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_dragon_battle" (
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "joinMemberCnt" integer DEFAULT 0,
  "leftTeleportTimes" integer,
  CONSTRAINT "alliance_dragon_battle_PRIMARY" PRIMARY KEY ("allianceId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_dragon_battle_PRIMARY_pad" ON "cokdb1"."alliance_dragon_battle" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_dragonplayoff_award" (
  "version" integer NOT NULL,
  "allianceId" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer NOT NULL,
  "state" integer NOT NULL,
  "addr" character varying(2000) COLLATE "legacy_meta"."ci",
  CONSTRAINT "alliance_dragonplayoff_award_PRIMARY" PRIMARY KEY ("version", "allianceId", "uid", "type")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_dragonplayoff_award_PRIMARY_pad" ON "cokdb1"."alliance_dragonplayoff_award" (("version"), (rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_fight_of_king" (
  "type" integer NOT NULL,
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "serverId" integer NOT NULL,
  "occupyTime" bigint NOT NULL,
  CONSTRAINT "alliance_fight_of_king_PRIMARY" PRIMARY KEY ("type", "id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_fight_of_king_PRIMARY_pad" ON "cokdb1"."alliance_fight_of_king" (("type"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_gift" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "allianceid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer,
  "typeId" integer NOT NULL,
  "time" bigint,
  "expiretime" integer,
  CONSTRAINT "alliance_gift_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_gift_PRIMARY_pad" ON "cokdb1"."alliance_gift" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_group_buys" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "round" integer NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci",
  "point" integer,
  "buyTime" bigint,
  "info" character varying(1000) COLLATE "legacy_meta"."ci",
  "reward" integer,
  CONSTRAINT "alliance_group_buys_PRIMARY" PRIMARY KEY ("id", "uid", "round")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_group_buys_PRIMARY_pad" ON "cokdb1"."alliance_group_buys" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"), (rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("round"));
--> statement-breakpoint
CREATE INDEX "alliance_group_buys_index_allianceId" ON "cokdb1"."alliance_group_buys" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_group_buys_index_time" ON "cokdb1"."alliance_group_buys" (("buyTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_help" (
  "helpId" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "allianceId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "senderId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "content" character varying(255) COLLATE "legacy_meta"."ci",
  "isvalid" integer DEFAULT 1,
  "maxcount" integer DEFAULT 0,
  "nowcount" integer DEFAULT 0,
  "startTime" bigint,
  "reduceSec" integer,
  "itemId" character varying(255) COLLATE "legacy_meta"."ci",
  "level" integer,
  "type" integer,
  "helpers" bytea,
  "star" integer DEFAULT 0,
  "progress" integer DEFAULT 0,
  CONSTRAINT "alliance_help_helpers_length" CHECK (octet_length("helpers") <= 65535),
  CONSTRAINT "alliance_help_PRIMARY" PRIMARY KEY ("helpId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_help_PRIMARY_pad" ON "cokdb1"."alliance_help" ((rtrim("helpId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_help_allianceId_index" ON "cokdb1"."alliance_help" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_help_index_alliance_help" ON "cokdb1"."alliance_help" ((rtrim("content", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_helper" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "helpId" character varying(255) COLLATE "legacy_meta"."ci",
  "senderId" character varying(255) COLLATE "legacy_meta"."ci",
  "recvId" character varying(255) COLLATE "legacy_meta"."ci",
  "stats" integer DEFAULT 0,
  CONSTRAINT "alliance_helper_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_helper_PRIMARY_pad" ON "cokdb1"."alliance_helper" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_helper_index_alliance_helper" ON "cokdb1"."alliance_helper" ((rtrim("helpId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("recvId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_invite_move" (
  "inviter" character varying(255) COLLATE "C" NOT NULL,
  "invitee" character varying(255) COLLATE "C" NOT NULL,
  "createTime" bigint,
  CONSTRAINT "alliance_invite_move_PRIMARY" PRIMARY KEY ("inviter", "invitee")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_invite_move_PRIMARY_pad" ON "cokdb1"."alliance_invite_move" ((rtrim("inviter", ' ') COLLATE "C"), (rtrim("invitee", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_member" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
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
  CONSTRAINT "alliance_member_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_member_PRIMARY_pad" ON "cokdb1"."alliance_member" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_member_index_allianceId" ON "cokdb1"."alliance_member" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_member_bak" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
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
  CONSTRAINT "alliance_member_bak_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_member_bak_PRIMARY_pad" ON "cokdb1"."alliance_member_bak" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_member_bak_index_allianceId" ON "cokdb1"."alliance_member_bak" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_member_dragon_right" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "canFight" smallint,
  "leaveTime" bigint,
  CONSTRAINT "alliance_member_dragon_right_canFight_range" CHECK ("canFight" BETWEEN -128 AND 127),
  CONSTRAINT "alliance_member_dragon_right_PRIMARY" PRIMARY KEY ("uid", "allianceId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_member_dragon_right_PRIMARY_pad" ON "cokdb1"."alliance_member_dragon_right" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_mission" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "missionId" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "mType" integer,
  "triggerType" integer,
  "allianceId" character varying(255) COLLATE "legacy_meta"."ci",
  "conditionValue" character varying(100) COLLATE "legacy_meta"."ci",
  "para" character varying(100) COLLATE "legacy_meta"."ci",
  "rewardFlag" character varying(100) COLLATE "legacy_meta"."ci",
  "rewardId" character varying(100) COLLATE "legacy_meta"."ci",
  "currentValue" bigint,
  "refreshTime" bigint,
  CONSTRAINT "alliance_mission_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_mission_PRIMARY_pad" ON "cokdb1"."alliance_mission" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_mission_aid_idx" ON "cokdb1"."alliance_mission" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_mission_record" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "missionUUID" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(255) COLLATE "legacy_meta"."ci",
  "mType" integer,
  "rewardFlag" character varying(100) COLLATE "legacy_meta"."ci",
  CONSTRAINT "alliance_mission_record_PRIMARY" PRIMARY KEY ("uid", "missionUUID")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_mission_record_PRIMARY_pad" ON "cokdb1"."alliance_mission_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("missionUUID", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_mission_record_uid_idx" ON "cokdb1"."alliance_mission_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_mission_record_mid_idx" ON "cokdb1"."alliance_mission_record" ((rtrim("missionUUID", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_mission_record_allianceId" ON "cokdb1"."alliance_mission_record" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_new_resource_log" (
  "uuid" bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1887) NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "sandstone" bigint DEFAULT 0,
  "diamondstone" bigint DEFAULT 0,
  "marble" bigint DEFAULT 0,
  "granite" bigint DEFAULT 0,
  "limestone" bigint DEFAULT 0,
  "updateTime" bigint,
  CONSTRAINT "alliance_new_resource_log_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE INDEX "alliance_new_resource_log_uid_index" ON "cokdb1"."alliance_new_resource_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_offical" (
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "officalOneUid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "officalTwoUid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "officalThreeUid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "officalFourUid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  CONSTRAINT "alliance_offical_PRIMARY" PRIMARY KEY ("allianceId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_offical_PRIMARY_pad" ON "cokdb1"."alliance_offical" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_offical_apply" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "userId" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "applyType" integer DEFAULT 0 NOT NULL,
  "applyTime" bigint DEFAULT 0 NOT NULL,
  "operateType" integer DEFAULT 0 NOT NULL,
  "operateTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "alliance_offical_apply_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_offical_apply_PRIMARY_pad" ON "cokdb1"."alliance_offical_apply" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_offical_apply_index_user" ON "cokdb1"."alliance_offical_apply" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_offical_apply_index_alliance" ON "cokdb1"."alliance_offical_apply" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_science" (
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
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
  CONSTRAINT "alliance_science_PRIMARY" PRIMARY KEY ("allianceId", "scienceId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_science_PRIMARY_pad" ON "cokdb1"."alliance_science" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"), ("scienceId"));
--> statement-breakpoint
CREATE INDEX "alliance_science_index_alliance" ON "cokdb1"."alliance_science" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_science_upgrade" (
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "scienceId" integer,
  "startTime" bigint,
  "needTime" bigint,
  "accelerate" bytea,
  CONSTRAINT "alliance_science_upgrade_accelerate_length" CHECK (octet_length("accelerate") <= 65535),
  CONSTRAINT "alliance_science_upgrade_PRIMARY" PRIMARY KEY ("allianceId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_science_upgrade_PRIMARY_pad" ON "cokdb1"."alliance_science_upgrade" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_shop" (
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "goodsId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "count" integer,
  CONSTRAINT "alliance_shop_PRIMARY" PRIMARY KEY ("allianceId", "goodsId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_shop_PRIMARY_pad" ON "cokdb1"."alliance_shop" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("goodsId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_shop_index_alliance" ON "cokdb1"."alliance_shop" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_shop_buyrecord" (
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "goodsId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "count" integer NOT NULL,
  "buytime" bigint NOT NULL,
  CONSTRAINT "alliance_shop_buyrecord_PRIMARY" PRIMARY KEY ("allianceId", "buytime")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_shop_buyrecord_PRIMARY_pad" ON "cokdb1"."alliance_shop_buyrecord" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"), ("buytime"));
--> statement-breakpoint
CREATE INDEX "alliance_shop_buyrecord_buytime" ON "cokdb1"."alliance_shop_buyrecord" (("buytime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_shop_buytoallianceshoprecord" (
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "goodsId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "count" integer NOT NULL,
  "buytime" bigint NOT NULL,
  CONSTRAINT "alliance_shop_buytoallianceshoprecord_PRIMARY" PRIMARY KEY ("allianceId", "buytime")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_shop_buytoallianceshoprecord_PRIMARY_pad" ON "cokdb1"."alliance_shop_buytoallianceshoprecord" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"), ("buytime"));
--> statement-breakpoint
CREATE INDEX "alliance_shop_buytoallianceshoprecord_buytime" ON "cokdb1"."alliance_shop_buytoallianceshoprecord" (("buytime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_shop_make" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "goodsId" character varying(40) COLLATE "legacy_meta"."ci",
  "count" integer,
  "endTime" bigint,
  "needTime" bigint,
  CONSTRAINT "alliance_shop_make_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_shop_make_PRIMARY_pad" ON "cokdb1"."alliance_shop_make" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_shop_make_index_alliance" ON "cokdb1"."alliance_shop_make" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_shophis" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci",
  "userId" character varying(40) COLLATE "legacy_meta"."ci",
  "goodsId" character varying(40) COLLATE "legacy_meta"."ci",
  "time" bigint,
  CONSTRAINT "alliance_shophis_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_shophis_PRIMARY_pad" ON "cokdb1"."alliance_shophis" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_shophis_index_alliance" ON "cokdb1"."alliance_shophis" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_shophis_index_user" ON "cokdb1"."alliance_shophis" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_skill" (
  "uuid" character varying(128) COLLATE "legacy_meta"."ci" NOT NULL,
  "skillId" character varying(128) COLLATE "legacy_meta"."ci",
  "curEnergy" integer,
  "costEnergy" integer,
  "buildingUid" character varying(256) COLLATE "legacy_meta"."ci",
  "effect" integer DEFAULT 0,
  "effectValue" integer DEFAULT 0,
  "statusId" character varying(11) COLLATE "legacy_meta"."ci" DEFAULT '0',
  "startTime" bigint,
  "endTime" bigint,
  CONSTRAINT "alliance_skill_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_skill_PRIMARY_pad" ON "cokdb1"."alliance_skill" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_stats" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "event_type" integer,
  "fromUser" character varying(255) COLLATE "C",
  "toUser" character varying(255) COLLATE "C",
  "createTime" bigint,
  "extraParam" bytea,
  CONSTRAINT "alliance_stats_extraParam_length" CHECK (octet_length("extraParam") <= 65535),
  CONSTRAINT "alliance_stats_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_stats_PRIMARY_pad" ON "cokdb1"."alliance_stats" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_task" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "taskId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "publishUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "acceptUid" character varying(255) COLLATE "legacy_meta"."ci",
  "vanishTime" bigint,
  "finishTime" bigint,
  "publishStat" integer DEFAULT 0,
  "acceptStat" integer,
  "acceptReward" character varying(255) COLLATE "legacy_meta"."ci",
  "baseReward" character varying(255) COLLATE "legacy_meta"."ci",
  "extraReward" character varying(255) COLLATE "legacy_meta"."ci",
  "startTime" bigint DEFAULT 0,
  "publishTime" bigint DEFAULT 0,
  "freequeue" integer DEFAULT 0,
  CONSTRAINT "alliance_task_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_task_PRIMARY_pad" ON "cokdb1"."alliance_task" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_task_al_idx" ON "cokdb1"."alliance_task" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_task_publish_idx" ON "cokdb1"."alliance_task" ((rtrim("publishUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_task_accept_idx" ON "cokdb1"."alliance_task" ((rtrim("acceptUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_task_log" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci",
  "castleLevel" integer,
  "level" integer,
  "taskId" integer,
  "color" integer,
  "createTime" bigint,
  "behavior" integer DEFAULT 0,
  CONSTRAINT "alliance_task_log_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_task_log_PRIMARY_pad" ON "cokdb1"."alliance_task_log" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_task_log_castle_color" ON "cokdb1"."alliance_task_log" (("castleLevel"), ("color"));
--> statement-breakpoint
CREATE INDEX "alliance_task_log_level_index" ON "cokdb1"."alliance_task_log" (("level"));
--> statement-breakpoint
CREATE INDEX "alliance_task_log_color_index" ON "cokdb1"."alliance_task_log" (("color"));
--> statement-breakpoint
CREATE INDEX "alliance_task_log_castle_index" ON "cokdb1"."alliance_task_log" (("castleLevel"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_task_record" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
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
  CONSTRAINT "alliance_task_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_task_record_PRIMARY_pad" ON "cokdb1"."alliance_task_record" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_task_unpublish" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "taskId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "publishUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "stat" integer DEFAULT 0,
  "vanishTime" bigint,
  "finishTime" bigint,
  "acceptReward" character varying(255) COLLATE "legacy_meta"."ci",
  "baseReward" character varying(255) COLLATE "legacy_meta"."ci",
  "extraReward" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "alliance_task_unpublish_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_task_unpublish_PRIMARY_pad" ON "cokdb1"."alliance_task_unpublish" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "alliance_task_unpublish_pub_idx" ON "cokdb1"."alliance_task_unpublish" ((rtrim("publishUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_territory" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "pointId" integer,
  "atWorldId" integer DEFAULT 0 NOT NULL,
  "towerPoint" integer,
  "type" integer,
  "resType" integer,
  "num" integer DEFAULT 1,
  "allianceId" character varying(255) COLLATE "C" NOT NULL,
  "allianceName" character varying(255) COLLATE "C" NOT NULL,
  "allianceAbbr" character varying(255) COLLATE "C",
  "stat" integer DEFAULT 0,
  "active" integer DEFAULT 0,
  "level" integer DEFAULT 0,
  "maxDef" integer,
  "curDef" integer,
  "createId" character varying(255) COLLATE "C",
  "ownerId" character varying(255) COLLATE "C",
  "pic" character varying(255) COLLATE "C",
  "name" character varying(255) COLLATE "C",
  "flag" character varying(255) COLLATE "C",
  "buildingSpd" numeric(20,10) DEFAULT 0.0000000000,
  "updateTime" bigint,
  "startTime" bigint,
  "lastUpdateTime" bigint,
  "donateItemNum" integer,
  "arrowHarmPower" integer DEFAULT 0,
  "neighbour" character varying(1000) COLLATE "C",
  "createTime" bigint DEFAULT 0,
  "activateTime" bigint,
  "trapNum" integer DEFAULT 0,
  "reduceTime" bigint DEFAULT 0,
  "skinsStr" character varying(50) COLLATE "legacy_meta"."ci" DEFAULT '',
  "skinExpStr" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "nextChangeSkinTime" bigint DEFAULT 0,
  "activeSkin" character varying(10) COLLATE "C" DEFAULT '',
  CONSTRAINT "alliance_territory_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_territory_PRIMARY_pad" ON "cokdb1"."alliance_territory" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_territory_pointId_worldId_idx" ON "cokdb1"."alliance_territory" (("pointId"), ("atWorldId"));
--> statement-breakpoint
CREATE INDEX "alliance_territory_alliance_idx" ON "cokdb1"."alliance_territory" ((rtrim("allianceId", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "alliance_territory_update_idx" ON "cokdb1"."alliance_territory" (("updateTime"));
--> statement-breakpoint
CREATE INDEX "alliance_territory_start_idx" ON "cokdb1"."alliance_territory" (("startTime"));
--> statement-breakpoint
CREATE INDEX "alliance_territory_lastup_idx" ON "cokdb1"."alliance_territory" (("lastUpdateTime"));
--> statement-breakpoint
CREATE INDEX "alliance_territory_tower_idx" ON "cokdb1"."alliance_territory" (("towerPoint"));
--> statement-breakpoint
CREATE INDEX "alliance_territory_pointId_idx" ON "cokdb1"."alliance_territory" (("pointId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_territory_fix_log" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "pointId" integer NOT NULL,
  "territoryId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "territoryType" integer NOT NULL,
  "playerId" character varying(255) COLLATE "legacy_meta"."ci",
  "runTime" bigint NOT NULL,
  CONSTRAINT "alliance_territory_fix_log_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_territory_fix_log_PRIMARY_pad" ON "cokdb1"."alliance_territory_fix_log" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_title" (
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "title" integer NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci",
  "uName" character varying(255) COLLATE "legacy_meta"."ci",
  "applicant" character varying(500) COLLATE "legacy_meta"."ci",
  CONSTRAINT "alliance_title_PRIMARY" PRIMARY KEY ("allianceId", "title")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_title_PRIMARY_pad" ON "cokdb1"."alliance_title" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"), ("title"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."alliance_vedio" (
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "vedioURL" character varying(200) COLLATE "legacy_meta"."ci",
  "thumbnailURL" character varying(200) COLLATE "legacy_meta"."ci",
  "vedioW" integer DEFAULT 0 NOT NULL,
  "vedioH" integer DEFAULT 0 NOT NULL,
  "vedioSize" integer DEFAULT 0 NOT NULL,
  "vedioLength" integer DEFAULT 0 NOT NULL,
  "checkSign" smallint DEFAULT 0 NOT NULL,
  CONSTRAINT "alliance_vedio_checkSign_range" CHECK ("checkSign" BETWEEN -128 AND 127),
  CONSTRAINT "alliance_vedio_PRIMARY" PRIMARY KEY ("allianceId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "alliance_vedio_PRIMARY_pad" ON "cokdb1"."alliance_vedio" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."anniversary_allianceinfo" (
  "num" integer NOT NULL,
  "allnum" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."anniversary_userinfo" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "regtop" bigint DEFAULT 0,
  "power" bigint DEFAULT 0,
  "powerpercent" numeric(10,2),
  "food" bigint DEFAULT 0 NOT NULL,
  "wood" bigint DEFAULT 0 NOT NULL,
  "train" bigint DEFAULT 0 NOT NULL,
  "armytype" integer NOT NULL,
  "maxtrain" bigint DEFAULT 0 NOT NULL,
  "maxtrainpercent" numeric(10,2),
  "dead" integer NOT NULL,
  "deadpercent" numeric(10,2),
  "kill" integer NOT NULL,
  "killpercent" numeric(10,2),
  CONSTRAINT "anniversary_userinfo_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "anniversary_userinfo_PRIMARY_pad" ON "cokdb1"."anniversary_userinfo" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."arena_battle_team" (
  "id" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer,
  "targetId" integer,
  "targetUid" character varying(200) COLLATE "legacy_meta"."ci",
  "targetName" character varying(200) COLLATE "legacy_meta"."ci",
  "targetPic" character varying(200) COLLATE "legacy_meta"."ci",
  "targetAName" character varying(200) COLLATE "legacy_meta"."ci",
  "targetAAbbr" character varying(200) COLLATE "legacy_meta"."ci",
  "targetAIcon" character varying(200) COLLATE "legacy_meta"."ci",
  "targetType" integer,
  "leaderUid" character varying(200) COLLATE "legacy_meta"."ci",
  "leaderName" character varying(200) COLLATE "legacy_meta"."ci",
  "leaderId" integer,
  "allianceId" character varying(200) COLLATE "legacy_meta"."ci",
  "allianceName" character varying(200) COLLATE "legacy_meta"."ci",
  "allianceAbbr" character varying(200) COLLATE "legacy_meta"."ci",
  "allianceIcon" character varying(200) COLLATE "legacy_meta"."ci",
  "maxSoldiers" integer,
  "waitTime" bigint,
  "createTime" bigint,
  "worldId" integer,
  "superTeam" integer,
  "failBackItem" integer
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."army_skill_info" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "armyId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "skillId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer NOT NULL,
  "exp" integer NOT NULL,
  CONSTRAINT "army_skill_info_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "army_skill_info_PRIMARY_pad" ON "cokdb1"."army_skill_info" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "army_skill_info_uid" ON "cokdb1"."army_skill_info" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."army_strengthen" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "skillbase_id" integer DEFAULT 0,
  "level" integer,
  "exp" integer,
  "skills" character varying(255) COLLATE "legacy_meta"."ci",
  "times" integer,
  "crit" integer,
  "updateTime" bigint
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."army_total" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "total" integer DEFAULT 0,
  CONSTRAINT "army_total_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "army_total_PRIMARY_pad" ON "cokdb1"."army_total" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."atk_name" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "atk_name_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "atk_name_PRIMARY_pad" ON "cokdb1"."atk_name" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."atk_time" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint DEFAULT 0,
  CONSTRAINT "atk_time_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "atk_time_PRIMARY_pad" ON "cokdb1"."atk_time" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."avatar_storage" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "avatarId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "expirationTime" bigint NOT NULL,
  "effectiveSign" integer DEFAULT 0 NOT NULL,
  "username" character varying(255) COLLATE "legacy_meta"."ci",
  "usetime" bigint,
  "type" integer DEFAULT 0,
  CONSTRAINT "avatar_storage_PRIMARY" PRIMARY KEY ("uid", "avatarId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "avatar_storage_PRIMARY_pad" ON "cokdb1"."avatar_storage" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("avatarId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."badwords" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "words" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "badwords_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."barbarion_statistics" (
  "playerUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "playerName" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint DEFAULT 0,
  "isSuccess" integer DEFAULT 0,
  "strongHoldLevel" integer DEFAULT 0,
  "actType" integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX "barbarion_statistics_uid_name_time_index" ON "cokdb1"."barbarion_statistics" ((rtrim("playerUid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("playerName", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "barbarion_statistics_playerUid_Index" ON "cokdb1"."barbarion_statistics" ((rtrim("playerUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "barbarion_statistics_isSuccess_actType_index" ON "cokdb1"."barbarion_statistics" (("isSuccess"), ("actType"));
--> statement-breakpoint
CREATE INDEX "barbarion_statistics_strongHoldLevel_index" ON "cokdb1"."barbarion_statistics" (("strongHoldLevel"));
--> statement-breakpoint
CREATE INDEX "barbarion_statistics_actType_index" ON "cokdb1"."barbarion_statistics" (("actType"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."black_land_barbarion_dead" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "areaId" integer NOT NULL,
  "level" integer NOT NULL,
  "deadFinishTime" bigint NOT NULL,
  CONSTRAINT "black_land_barbarion_dead_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "black_land_barbarion_dead_PRIMARY_pad" ON "cokdb1"."black_land_barbarion_dead" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "black_land_barbarion_dead_dead_res_time" ON "cokdb1"."black_land_barbarion_dead" (("deadFinishTime"));
--> statement-breakpoint
CREATE INDEX "black_land_barbarion_dead_areaId_index" ON "cokdb1"."black_land_barbarion_dead" (("areaId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."black_land_basttile_dead" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "areaId" integer NOT NULL,
  "level" integer NOT NULL,
  "deadFinishTime" bigint NOT NULL,
  CONSTRAINT "black_land_basttile_dead_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "black_land_basttile_dead_PRIMARY_pad" ON "cokdb1"."black_land_basttile_dead" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "black_land_basttile_dead_dead_res_time" ON "cokdb1"."black_land_basttile_dead" (("deadFinishTime"));
--> statement-breakpoint
CREATE INDEX "black_land_basttile_dead_areaId_index" ON "cokdb1"."black_land_basttile_dead" (("areaId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."black_land_res_dead" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "areaId" integer NOT NULL,
  "level" integer NOT NULL,
  "deadFinishTime" bigint NOT NULL,
  CONSTRAINT "black_land_res_dead_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "black_land_res_dead_PRIMARY_pad" ON "cokdb1"."black_land_res_dead" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "black_land_res_dead_dead_res_time" ON "cokdb1"."black_land_res_dead" (("deadFinishTime"));
--> statement-breakpoint
CREATE INDEX "black_land_res_dead_areaId_index" ON "cokdb1"."black_land_res_dead" (("areaId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."bottles" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "serverId" integer NOT NULL,
  "pic" character varying(40) COLLATE "legacy_meta"."ci",
  "content" bytea NOT NULL,
  "locked" smallint NOT NULL,
  "createTime" bigint NOT NULL,
  "replyCount" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "bottles_content_length" CHECK (octet_length("content") <= 65535),
  CONSTRAINT "bottles_locked_range" CHECK ("locked" BETWEEN -128 AND 127),
  CONSTRAINT "bottles_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "bottles_PRIMARY_pad" ON "cokdb1"."bottles" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "bottles_uid_index" ON "cokdb1"."bottles" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."branch_link" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "serverId" integer DEFAULT 0 NOT NULL,
  "fromUid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "fromServerId" integer,
  "type" character varying(128) COLLATE "legacy_meta"."ci",
  "data" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "startTime" bigint DEFAULT 0 NOT NULL,
  "modifyTime" bigint DEFAULT 0,
  CONSTRAINT "branch_link_PRIMARY" PRIMARY KEY ("uid", "serverId", "data")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "branch_link_PRIMARY_pad" ON "cokdb1"."branch_link" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("serverId"), (rtrim("data", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "branch_link_branch_link_from_index" ON "cokdb1"."branch_link" ((rtrim("fromUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "branch_link_branch_link_type_index" ON "cokdb1"."branch_link" ((rtrim("type", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."branch_url" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "serverId" integer DEFAULT 0 NOT NULL,
  "type" character varying(128) COLLATE "legacy_meta"."ci",
  "data" character varying(255) COLLATE "legacy_meta"."ci",
  "url" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "startTime" bigint DEFAULT 0 NOT NULL,
  "modifyTime" bigint DEFAULT 0,
  CONSTRAINT "branch_url_PRIMARY" PRIMARY KEY ("uid", "serverId", "url")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "branch_url_PRIMARY_pad" ON "cokdb1"."branch_url" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("serverId"), (rtrim("url", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "branch_url_branch_url_link_index" ON "cokdb1"."branch_url" ((rtrim("url", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "branch_url_branch_url_type_index" ON "cokdb1"."branch_url" ((rtrim("type", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."c3p0testtable" (
  "a" character varying(1) COLLATE "C"
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."castle_exchange" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "buy" integer DEFAULT 0,
  "time" bigint DEFAULT 0,
  CONSTRAINT "castle_exchange_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_exchange"."buy" IS '购买的次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_exchange"."time" IS '购买的时间';
--> statement-breakpoint
CREATE UNIQUE INDEX "castle_exchange_PRIMARY_pad" ON "cokdb1"."castle_exchange" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."castle_leveling_0" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
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
  CONSTRAINT "castle_leveling_0_PRIMARY" PRIMARY KEY ("uid", "level")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."uid" IS '用户唯一标识';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."level" IS '限定等级';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."lv_reward" IS '是否领取等级达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."share_reward_0" IS '是否领取共享条件达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."share_reward_1" IS '是否领取共享条件达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."share_reward_2" IS '是否领取共享条件达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."share_reward_3" IS '是否领取共享条件达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."share_reward_4" IS '是否领取共享条件达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."share_reward_5" IS '是否领取共享条件达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."share_reward_6" IS '是否领取共享条件达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."pay_times_0" IS '购买次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."pay_times_1" IS '购买次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."pay_times_2" IS '购买次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."pay_times_3" IS '购买次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."pay_times_4" IS '购买次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_0"."pay_times_5" IS '购买次数';
--> statement-breakpoint
CREATE UNIQUE INDEX "castle_leveling_0_PRIMARY_pad" ON "cokdb1"."castle_leveling_0" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("level"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."castle_leveling_1" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
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
  CONSTRAINT "castle_leveling_1_PRIMARY" PRIMARY KEY ("uid", "level")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."uid" IS '用户唯一标识';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."level" IS '限定等级';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."lv_reward" IS '是否领取等级达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."share_reward_0" IS '是否领取共享条件达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."share_reward_1" IS '是否领取共享条件达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."share_reward_2" IS '是否领取共享条件达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."share_reward_3" IS '是否领取共享条件达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."share_reward_4" IS '是否领取共享条件达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."share_reward_5" IS '是否领取共享条件达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."share_reward_6" IS '是否领取共享条件达到条件奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."pay_times_0" IS '购买次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."pay_times_1" IS '购买次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."pay_times_2" IS '购买次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."pay_times_3" IS '购买次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."pay_times_4" IS '购买次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."castle_leveling_1"."pay_times_5" IS '购买次数';
--> statement-breakpoint
CREATE UNIQUE INDEX "castle_leveling_1_PRIMARY_pad" ON "cokdb1"."castle_leveling_1" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("level"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."celebrity" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "description" bytea,
  CONSTRAINT "celebrity_description_length" CHECK (octet_length("description") <= 65535),
  CONSTRAINT "celebrity_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "celebrity_PRIMARY_pad" ON "cokdb1"."celebrity" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."chat_report_record" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "lastUpdateTime" bigint DEFAULT 0,
  CONSTRAINT "chat_report_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "chat_report_record_PRIMARY_pad" ON "cokdb1"."chat_report_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "chat_report_record_time_idx" ON "cokdb1"."chat_report_record" (("lastUpdateTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."chat_shield" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "owner" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "other" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint,
  CONSTRAINT "chat_shield_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "chat_shield_PRIMARY_pad" ON "cokdb1"."chat_shield" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "chat_shield_owner_other_index" ON "cokdb1"."chat_shield" ((rtrim("owner", ' ') COLLATE "legacy_meta"."ci"), (rtrim("other", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."city_monster" (
  "uid" character varying(255) COLLATE "legacy_meta"."sv_ci" NOT NULL,
  "nextUpdateTime" bigint,
  "bigMonster" integer,
  "smallMonster" integer,
  "lastUpdateTime" bigint,
  "bigMonsterInOneDay" integer,
  CONSTRAINT "city_monster_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "city_monster_PRIMARY_pad" ON "cokdb1"."city_monster" ((rtrim("uid", ' ') COLLATE "legacy_meta"."sv_ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."civilization_castle" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
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
  CONSTRAINT "civilization_castle_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "civilization_castle_PRIMARY_pad" ON "cokdb1"."civilization_castle" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."civilization_castle_record" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
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
  CONSTRAINT "civilization_castle_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "civilization_castle_record_PRIMARY_pad" ON "cokdb1"."civilization_castle_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."client_log" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer NOT NULL,
  "keyword" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  CONSTRAINT "client_log_PRIMARY" PRIMARY KEY ("uid", "type", "keyword", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "client_log_PRIMARY_pad" ON "cokdb1"."client_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"), (rtrim("keyword", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."cok_monitor_log" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "url" character varying(500) COLLATE "legacy_meta"."ci",
  "action" character varying(50) COLLATE "legacy_meta"."ci",
  "parameter" text COLLATE "legacy_meta"."ci",
  "user_name" character varying(50) COLLATE "legacy_meta"."ci",
  "access_time" text,
  "module_id" integer,
  CONSTRAINT "cok_monitor_log_access_time_temporal" CHECK (legacy_meta.valid_temporal("access_time", 'datetime', 0)),
  CONSTRAINT "cok_monitor_log_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."compensate_record" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci",
  "lostPower" bigint,
  "time" bigint,
  "rewardTime" bigint,
  "rewardStatus" integer,
  "reward" character varying(255) COLLATE "legacy_meta"."ci",
  "num" integer,
  CONSTRAINT "compensate_record_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "compensate_record_PRIMARY_pad" ON "cokdb1"."compensate_record" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "compensate_record_time_idx" ON "cokdb1"."compensate_record" (("time"));
--> statement-breakpoint
CREATE INDEX "compensate_record_uid_idx" ON "cokdb1"."compensate_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."compensate_shield_record" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "createTime" bigint DEFAULT 0,
  CONSTRAINT "compensate_shield_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "compensate_shield_record_PRIMARY_pad" ON "cokdb1"."compensate_shield_record" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."compensation_record" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "count" integer DEFAULT 0,
  "lastCompensateTime" bigint,
  "isFirstOnFire" integer DEFAULT 1,
  CONSTRAINT "compensation_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "compensation_record_PRIMARY_pad" ON "cokdb1"."compensation_record" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "compensation_record_time_index" ON "cokdb1"."compensation_record" (("lastCompensateTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."compensation_record_shield" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "createTime" bigint DEFAULT 0,
  CONSTRAINT "compensation_record_shield_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "compensation_record_shield_PRIMARY_pad" ON "cokdb1"."compensation_record_shield" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_0" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "friendUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "stat" integer DEFAULT 0,
  "description" bytea,
  CONSTRAINT "contact_0_description_length" CHECK (octet_length("description") <= 65535),
  CONSTRAINT "contact_0_PRIMARY" PRIMARY KEY ("uid", "friendUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "contact_0_PRIMARY_pad" ON "cokdb1"."contact_0" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("friendUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_1" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "friendUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "stat" integer DEFAULT 0,
  "description" bytea,
  CONSTRAINT "contact_1_description_length" CHECK (octet_length("description") <= 65535),
  CONSTRAINT "contact_1_PRIMARY" PRIMARY KEY ("uid", "friendUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "contact_1_PRIMARY_pad" ON "cokdb1"."contact_1" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("friendUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_2" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "friendUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "stat" integer DEFAULT 0,
  "description" bytea,
  CONSTRAINT "contact_2_description_length" CHECK (octet_length("description") <= 65535),
  CONSTRAINT "contact_2_PRIMARY" PRIMARY KEY ("uid", "friendUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "contact_2_PRIMARY_pad" ON "cokdb1"."contact_2" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("friendUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_3" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "friendUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "stat" integer DEFAULT 0,
  "description" bytea,
  CONSTRAINT "contact_3_description_length" CHECK (octet_length("description") <= 65535),
  CONSTRAINT "contact_3_PRIMARY" PRIMARY KEY ("uid", "friendUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "contact_3_PRIMARY_pad" ON "cokdb1"."contact_3" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("friendUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_4" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "friendUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "stat" integer DEFAULT 0,
  "description" bytea,
  CONSTRAINT "contact_4_description_length" CHECK (octet_length("description") <= 65535),
  CONSTRAINT "contact_4_PRIMARY" PRIMARY KEY ("uid", "friendUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "contact_4_PRIMARY_pad" ON "cokdb1"."contact_4" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("friendUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_5" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "friendUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "stat" integer DEFAULT 0,
  "description" bytea,
  CONSTRAINT "contact_5_description_length" CHECK (octet_length("description") <= 65535),
  CONSTRAINT "contact_5_PRIMARY" PRIMARY KEY ("uid", "friendUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "contact_5_PRIMARY_pad" ON "cokdb1"."contact_5" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("friendUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_6" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "friendUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "stat" integer DEFAULT 0,
  "description" bytea,
  CONSTRAINT "contact_6_description_length" CHECK (octet_length("description") <= 65535),
  CONSTRAINT "contact_6_PRIMARY" PRIMARY KEY ("uid", "friendUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "contact_6_PRIMARY_pad" ON "cokdb1"."contact_6" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("friendUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_7" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "friendUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "stat" integer DEFAULT 0,
  "description" bytea,
  CONSTRAINT "contact_7_description_length" CHECK (octet_length("description") <= 65535),
  CONSTRAINT "contact_7_PRIMARY" PRIMARY KEY ("uid", "friendUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "contact_7_PRIMARY_pad" ON "cokdb1"."contact_7" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("friendUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_8" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "friendUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "stat" integer DEFAULT 0,
  "description" bytea,
  CONSTRAINT "contact_8_description_length" CHECK (octet_length("description") <= 65535),
  CONSTRAINT "contact_8_PRIMARY" PRIMARY KEY ("uid", "friendUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "contact_8_PRIMARY_pad" ON "cokdb1"."contact_8" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("friendUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_9" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "friendUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "stat" integer DEFAULT 0,
  "description" bytea,
  CONSTRAINT "contact_9_description_length" CHECK (octet_length("description") <= 65535),
  CONSTRAINT "contact_9_PRIMARY" PRIMARY KEY ("uid", "friendUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "contact_9_PRIMARY_pad" ON "cokdb1"."contact_9" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("friendUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."contact_fb" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "friendUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "fbUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "stat" integer DEFAULT 0,
  "description" bytea,
  "fbName" bytea,
  CONSTRAINT "contact_fb_description_length" CHECK (octet_length("description") <= 65535),
  CONSTRAINT "contact_fb_fbName_length" CHECK (octet_length("fbName") <= 65535),
  CONSTRAINT "contact_fb_PRIMARY" PRIMARY KEY ("uid", "friendUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "contact_fb_PRIMARY_pad" ON "cokdb1"."contact_fb" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("friendUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."cross_info" (
  "uid" character varying(128) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "changeServerType" character varying(128) COLLATE "legacy_meta"."ci",
  "crossTime" bigint DEFAULT 0,
  "targetServerId" integer DEFAULT 0,
  CONSTRAINT "cross_info_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "cross_info_PRIMARY_pad" ON "cokdb1"."cross_info" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."cross_promotion_status" (
  "srcGameId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "targetGameId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "srcUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "targetUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "taskid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "taskType" integer NOT NULL,
  "startTime" bigint,
  "endTime" bigint,
  "curValue" integer DEFAULT 0 NOT NULL,
  "maxValue" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "cross_promotion_status_PRIMARY" PRIMARY KEY ("srcGameId", "targetUid", "taskid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_status"."srcGameId" IS '推广方gameid';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_status"."targetGameId" IS '被推广方gameid';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_status"."srcUid" IS '推广方uid';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_status"."targetUid" IS '被推广方uid';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_status"."taskid" IS '任务编号';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_status"."taskType" IS '任务类型';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_status"."startTime" IS '开始时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_status"."endTime" IS '结束时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_status"."curValue" IS '当前值';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_status"."maxValue" IS '最大值';
--> statement-breakpoint
CREATE UNIQUE INDEX "cross_promotion_status_PRIMARY_pad" ON "cokdb1"."cross_promotion_status" ((rtrim("srcGameId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("targetUid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("taskid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."cross_promotion_update_task" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "taskid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "taskType" integer NOT NULL,
  "curValue" integer DEFAULT 0 NOT NULL,
  "getRewardSign" integer DEFAULT 0 NOT NULL,
  "acceptTime" bigint,
  "finishTime" bigint,
  CONSTRAINT "cross_promotion_update_task_PRIMARY" PRIMARY KEY ("uid", "taskid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_update_task"."uid" IS '玩家唯一id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_update_task"."taskid" IS '任务编号';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_update_task"."taskType" IS '任务类型';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_update_task"."curValue" IS '当前任务数值';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_update_task"."getRewardSign" IS '领奖状态，0未领取，1已领取';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_update_task"."acceptTime" IS '接受时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_promotion_update_task"."finishTime" IS '完成时间';
--> statement-breakpoint
CREATE UNIQUE INDEX "cross_promotion_update_task_PRIMARY_pad" ON "cokdb1"."cross_promotion_update_task" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("taskid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."cross_throne_king_info" (
  "uuid" character varying(50) COLLATE "C" NOT NULL,
  "version" integer NOT NULL,
  "king_type" integer NOT NULL,
  "config_type" integer NOT NULL,
  "name" character varying(50) COLLATE "C",
  "uid" character varying(50) COLLATE "C",
  "pic" character varying(50) COLLATE "C",
  "pic_ver" integer DEFAULT 0 NOT NULL,
  "king_server_id" integer DEFAULT 0 NOT NULL,
  "alliance_abbr" character varying(50) COLLATE "C",
  "occupy_seconds" integer DEFAULT 0 NOT NULL,
  "induction_time" bigint DEFAULT 0 NOT NULL,
  "throne_dead_count" integer DEFAULT 0 NOT NULL,
  "trebuchet_dead_count" integer DEFAULT 0 NOT NULL,
  "battle_user_count" integer DEFAULT 0 NOT NULL,
  "battle_alliance_count" integer DEFAULT 0 NOT NULL,
  "scout_count" integer DEFAULT 0 NOT NULL,
  "create_time" bigint,
  "last_update_time" bigint,
  CONSTRAINT "cross_throne_king_info_PRIMARY" PRIMARY KEY ("version", "king_type", "config_type")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."cross_throne_king_info"."king_type" IS '1 overlord  2 emperor';
--> statement-breakpoint
CREATE UNIQUE INDEX "cross_throne_king_info_uuid" ON "cokdb1"."cross_throne_king_info" ((rtrim("uuid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."cross_throne_occupy_record" (
  "uuid" character varying(50) COLLATE "C" NOT NULL,
  "king_info_id" character varying(50) COLLATE "C" NOT NULL,
  "uid" character varying(50) COLLATE "C",
  "name" character varying(50) COLLATE "C",
  "alliance_abbr" character varying(50) COLLATE "C",
  "server_id" integer,
  "kingdom_name" character varying(50) COLLATE "C",
  "start_millis" bigint,
  CONSTRAINT "cross_throne_occupy_record_PRIMARY" PRIMARY KEY ("uuid", "king_info_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "cross_throne_occupy_record_PRIMARY_pad" ON "cokdb1"."cross_throne_occupy_record" ((rtrim("uuid", ' ') COLLATE "C"), (rtrim("king_info_id", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."cross_throne_reward_record" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 10) NOT NULL,
  "version" integer NOT NULL,
  "from_uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "target_uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '-1' NOT NULL,
  "from_server_id" integer NOT NULL,
  "target_server_id" integer NOT NULL,
  "reward_type" smallint NOT NULL,
  "reward_id" integer NOT NULL,
  "record_time" bigint,
  "pic" character varying(50) COLLATE "C",
  "pic_ver" integer DEFAULT 0 NOT NULL,
  "name" character varying(50) COLLATE "C",
  "alliance_abbr" character varying(50) COLLATE "C",
  "throne_type" integer DEFAULT 0 NOT NULL,
  "overlord_type" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "cross_throne_reward_record_reward_type_range" CHECK ("reward_type" BETWEEN -128 AND 127),
  CONSTRAINT "cross_throne_reward_record_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."crystal_cost_record" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "goldType" integer,
  "type" integer NOT NULL,
  "param1" integer,
  "param2" integer,
  "originalGold" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remainGold" bigint NOT NULL,
  "time" bigint NOT NULL,
  CONSTRAINT "crystal_cost_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "crystal_cost_record_PRIMARY_pad" ON "cokdb1"."crystal_cost_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "crystal_cost_record_index_user" ON "cokdb1"."crystal_cost_record" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE INDEX "crystal_cost_record_index_type" ON "cokdb1"."crystal_cost_record" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"), ("type"));
--> statement-breakpoint
CREATE INDEX "crystal_cost_record_index_goldType" ON "cokdb1"."crystal_cost_record" (("goldType"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."def_time" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint DEFAULT 0,
  CONSTRAINT "def_time_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "def_time_PRIMARY_pad" ON "cokdb1"."def_time" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_0" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "operate" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "startTime" bigint DEFAULT 0 NOT NULL,
  "withDrawTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "deposit_record_0_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "deposit_record_0_PRIMARY_pad" ON "cokdb1"."deposit_record_0" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_1" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "operate" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "startTime" bigint DEFAULT 0 NOT NULL,
  "withDrawTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "deposit_record_1_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "deposit_record_1_PRIMARY_pad" ON "cokdb1"."deposit_record_1" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_2" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "operate" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "startTime" bigint DEFAULT 0 NOT NULL,
  "withDrawTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "deposit_record_2_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "deposit_record_2_PRIMARY_pad" ON "cokdb1"."deposit_record_2" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_3" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "operate" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "startTime" bigint DEFAULT 0 NOT NULL,
  "withDrawTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "deposit_record_3_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "deposit_record_3_PRIMARY_pad" ON "cokdb1"."deposit_record_3" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_4" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "operate" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "startTime" bigint DEFAULT 0 NOT NULL,
  "withDrawTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "deposit_record_4_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "deposit_record_4_PRIMARY_pad" ON "cokdb1"."deposit_record_4" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_5" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "operate" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "startTime" bigint DEFAULT 0 NOT NULL,
  "withDrawTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "deposit_record_5_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "deposit_record_5_PRIMARY_pad" ON "cokdb1"."deposit_record_5" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_6" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "operate" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "startTime" bigint DEFAULT 0 NOT NULL,
  "withDrawTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "deposit_record_6_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "deposit_record_6_PRIMARY_pad" ON "cokdb1"."deposit_record_6" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_7" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "operate" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "startTime" bigint DEFAULT 0 NOT NULL,
  "withDrawTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "deposit_record_7_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "deposit_record_7_PRIMARY_pad" ON "cokdb1"."deposit_record_7" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_8" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "operate" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "startTime" bigint DEFAULT 0 NOT NULL,
  "withDrawTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "deposit_record_8_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "deposit_record_8_PRIMARY_pad" ON "cokdb1"."deposit_record_8" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."deposit_record_9" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "operate" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "startTime" bigint DEFAULT 0 NOT NULL,
  "withDrawTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "deposit_record_9_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "deposit_record_9_PRIMARY_pad" ON "cokdb1"."deposit_record_9" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."device_info" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "signCode" character varying(100) COLLATE "legacy_meta"."ci",
  "subscriberId" character varying(100) COLLATE "legacy_meta"."ci",
  "operator_name" character varying(100) COLLATE "legacy_meta"."ci",
  "model" character varying(100) COLLATE "legacy_meta"."ci",
  "network_type" character varying(100) COLLATE "legacy_meta"."ci",
  "os_build" character varying(200) COLLATE "legacy_meta"."ci",
  "os_fgpt" character varying(200) COLLATE "legacy_meta"."ci",
  "reserve1" character varying(100) COLLATE "legacy_meta"."ci",
  "reserve2" character varying(100) COLLATE "legacy_meta"."ci",
  "reserve3" character varying(200) COLLATE "legacy_meta"."ci",
  "reserve4" character varying(200) COLLATE "legacy_meta"."ci",
  "reserve5" character varying(1000) COLLATE "legacy_meta"."ci",
  CONSTRAINT "device_info_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "device_info_PRIMARY_pad" ON "cokdb1"."device_info" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."device_mail_record" (
  "deviceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "record" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  CONSTRAINT "device_mail_record_PRIMARY" PRIMARY KEY ("deviceId", "record")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "device_mail_record_PRIMARY_pad" ON "cokdb1"."device_mail_record" ((rtrim("deviceId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("record", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."donate_history" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "allianceId" character varying(255) COLLATE "C",
  "donate" integer DEFAULT 0,
  "progress" integer,
  "donateTime" bigint,
  CONSTRAINT "donate_history_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "donate_history_PRIMARY_pad" ON "cokdb1"."donate_history" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "donate_history_aid_idx" ON "cokdb1"."donate_history" ((rtrim("allianceId", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "donate_history_time_idx" ON "cokdb1"."donate_history" (("donateTime"));
--> statement-breakpoint
CREATE INDEX "donate_history_progress_idx" ON "cokdb1"."donate_history" (("progress"));
--> statement-breakpoint
CREATE INDEX "donate_history_donate_idx" ON "cokdb1"."donate_history" (("donate"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."donate_history_record" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "allianceId" character varying(255) COLLATE "C",
  "donate" integer DEFAULT 0,
  "progress" integer,
  "donateTime" bigint,
  CONSTRAINT "donate_history_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "donate_history_record_PRIMARY_pad" ON "cokdb1"."donate_history_record" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "donate_history_record_aid_idx" ON "cokdb1"."donate_history_record" ((rtrim("allianceId", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "donate_history_record_time_idx" ON "cokdb1"."donate_history_record" (("donateTime"));
--> statement-breakpoint
CREATE INDEX "donate_history_record_progress_idx" ON "cokdb1"."donate_history_record" (("progress"));
--> statement-breakpoint
CREATE INDEX "donate_history_record_donate_idx" ON "cokdb1"."donate_history_record" (("donate"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_battle_fight_history" (
  "uid" character varying(50) COLLATE "C" NOT NULL,
  "teamId" character varying(50) COLLATE "C",
  "type" integer NOT NULL,
  "time" bigint,
  "serverId" integer,
  "VERSION" character varying(50) COLLATE "C" DEFAULT '',
  "indexId" integer,
  "score" integer,
  "id" character varying(50) COLLATE "C" NOT NULL,
  "param1" character varying(255) COLLATE "C" DEFAULT '',
  "seasonVersion" integer DEFAULT 1 NOT NULL,
  CONSTRAINT "dragon_battle_fight_history_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "dragon_battle_fight_history_PRIMARY_pad" ON "cokdb1"."dragon_battle_fight_history" ((rtrim("id", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "dragon_battle_fight_history_utvindex" ON "cokdb1"."dragon_battle_fight_history" ((rtrim("uid", ' ') COLLATE "C"), ("type"), (rtrim("VERSION", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "dragon_battle_fight_history_teamIdindex" ON "cokdb1"."dragon_battle_fight_history" ((rtrim("teamId", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_battle_mail_record" (
  "season_version" integer NOT NULL,
  "version" integer NOT NULL,
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "teamId" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "fightServer" integer DEFAULT 0 NOT NULL,
  "score" integer DEFAULT 0 NOT NULL,
  "mailId" integer DEFAULT 0 NOT NULL,
  "teamScore" integer DEFAULT 0 NOT NULL,
  "rewards" character varying(2000) COLLATE "legacy_meta"."ci" DEFAULT '''''' NOT NULL,
  "recived" smallint DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  "win" smallint DEFAULT 0 NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "dragon_battle_mail_record_recived_range" CHECK ("recived" BETWEEN -128 AND 127),
  CONSTRAINT "dragon_battle_mail_record_win_range" CHECK ("win" BETWEEN -128 AND 127),
  CONSTRAINT "dragon_battle_mail_record_PRIMARY" PRIMARY KEY ("uid", "season_version", "version")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "dragon_battle_mail_record_PRIMARY_pad" ON "cokdb1"."dragon_battle_mail_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("season_version"), ("version"));
--> statement-breakpoint
CREATE INDEX "dragon_battle_mail_record_state" ON "cokdb1"."dragon_battle_mail_record" (("state"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_building_record" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "worldId" integer NOT NULL,
  "buildId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "ownerUid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "occupyUidsStr" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "lastCalcScoreTime" bigint NOT NULL,
  "lastHandKnightTime" integer DEFAULT 0,
  CONSTRAINT "dragon_building_record_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "dragon_building_record_PRIMARY_pad" ON "cokdb1"."dragon_building_record" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_playoff_properties" (
  "key" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "value" character varying(1000) COLLATE "legacy_meta"."ci",
  "updateTime" text DEFAULT legacy_meta.utc_now(0) NOT NULL,
  CONSTRAINT "dragon_playoff_properties_updateTime_temporal" CHECK (legacy_meta.valid_temporal("updateTime", 'timestamp', 0)),
  CONSTRAINT "dragon_playoff_properties_PRIMARY" PRIMARY KEY ("key")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "dragon_playoff_properties_PRIMARY_pad" ON "cokdb1"."dragon_playoff_properties" ((rtrim("key", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TRIGGER a_reset BEFORE UPDATE ON "cokdb1"."dragon_playoff_properties" FOR EACH ROW EXECUTE FUNCTION legacy_meta.reset_explicit_timestamp();
--> statement-breakpoint
CREATE TRIGGER b_explicit BEFORE UPDATE OF "updateTime" ON "cokdb1"."dragon_playoff_properties" FOR EACH ROW EXECUTE FUNCTION legacy_meta.mark_explicit_timestamp();
--> statement-breakpoint
CREATE FUNCTION legacy_meta."ts_0191a0ad985752dfd467"() RETURNS trigger LANGUAGE plpgsql AS $body$
BEGIN
  IF NEW."updateTime" IS NULL OR (TG_OP='UPDATE' AND current_setting('legacy_meta.explicit_timestamp',true)='off' AND (to_jsonb(NEW)-'updateTime') IS DISTINCT FROM (to_jsonb(OLD)-'updateTime')) THEN
    NEW."updateTime" := legacy_meta.utc_now(0);
  END IF;
  RETURN NEW;
END $body$;
--> statement-breakpoint
CREATE TRIGGER c_ts_0191a0ad985752dfd467 BEFORE INSERT OR UPDATE ON "cokdb1"."dragon_playoff_properties" FOR EACH ROW EXECUTE FUNCTION legacy_meta."ts_0191a0ad985752dfd467"();
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_playoff_teaminfo" (
  "teamId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "teamName" character varying(255) COLLATE "legacy_meta"."ci",
  "leaderName" character varying(255) COLLATE "legacy_meta"."ci",
  "kingId" integer DEFAULT 0 NOT NULL,
  "kingName" character varying(255) COLLATE "legacy_meta"."ci",
  "state" integer DEFAULT 0 NOT NULL,
  "score" integer DEFAULT 0 NOT NULL,
  "fighting" integer DEFAULT 0 NOT NULL,
  "fightNum" integer DEFAULT 0 NOT NULL,
  "winNum" integer DEFAULT 0 NOT NULL,
  "curmember" integer DEFAULT 0 NOT NULL,
  "maxmember" integer DEFAULT 0 NOT NULL,
  "version" integer DEFAULT 0 NOT NULL,
  "index" integer DEFAULT 0 NOT NULL,
  "fightServerId" character varying(40) COLLATE "legacy_meta"."ci",
  "rankNum" integer DEFAULT 0 NOT NULL,
  "areaId" integer DEFAULT 0 NOT NULL,
  "abbr" character varying(255) COLLATE "legacy_meta"."ci",
  "fightState" integer DEFAULT 0 NOT NULL,
  "serverId" integer DEFAULT 0 NOT NULL,
  "icon" character varying(255) COLLATE "legacy_meta"."ci",
  "groupId" integer DEFAULT 0 NOT NULL,
  "groupIndex" integer DEFAULT 0 NOT NULL,
  "timeIndexes" character varying(20) COLLATE "legacy_meta"."ci",
  "enemyIds" character varying(255) COLLATE "legacy_meta"."ci",
  "results" character varying(20) COLLATE "legacy_meta"."ci",
  "curEnemyId" character varying(40) COLLATE "legacy_meta"."ci",
  "finalGroupIndex" integer DEFAULT 0 NOT NULL,
  "finalRankNum" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "dragon_playoff_teaminfo_PRIMARY" PRIMARY KEY ("teamId", "version")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "dragon_playoff_teaminfo_PRIMARY_pad" ON "cokdb1"."dragon_playoff_teaminfo" ((rtrim("teamId", ' ') COLLATE "legacy_meta"."ci"), ("version"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_skill" (
  "uid" character varying(96) COLLATE "legacy_meta"."ci",
  "dragonId" integer,
  "skillId" character varying(60) COLLATE "legacy_meta"."ci",
  "startTime" bigint,
  "actTime" bigint,
  "endTime" bigint,
  "stat" integer
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_talent_skill" (
  "uid" character varying(96) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "dragonId" integer DEFAULT 0 NOT NULL,
  "skillId" character varying(60) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "startTime" bigint,
  "actTime" bigint,
  "endTime" bigint,
  "stat" integer,
  "level" integer,
  "exp" integer,
  "totalExp" integer,
  CONSTRAINT "dragon_talent_skill_PRIMARY" PRIMARY KEY ("uid", "dragonId", "skillId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "dragon_talent_skill_PRIMARY_pad" ON "cokdb1"."dragon_talent_skill" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("dragonId"), (rtrim("skillId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_tower_buff" (
  "uid" character varying(32) COLLATE "legacy_meta"."ci" NOT NULL,
  "buffid" integer NOT NULL,
  "remainlayers" integer,
  "buytime" bigint,
  CONSTRAINT "dragon_tower_buff_PRIMARY" PRIMARY KEY ("uid", "buffid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "dragon_tower_buff_PRIMARY_pad" ON "cokdb1"."dragon_tower_buff" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("buffid"));
--> statement-breakpoint
CREATE INDEX "dragon_tower_buff_Index_uid" ON "cokdb1"."dragon_tower_buff" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_tower_fightreport" (
  "citylevel" smallint NOT NULL,
  "layer" integer NOT NULL,
  "uid" character varying(32) COLLATE "legacy_meta"."ci",
  "fighttime" bigint,
  "army" text COLLATE "legacy_meta"."ci",
  "report" text COLLATE "legacy_meta"."ci",
  "citystar" smallint,
  "monsterid" integer,
  "difficulty" smallint,
  "monsterdead" integer,
  "playerdead" integer,
  CONSTRAINT "dragon_tower_fightreport_PRIMARY" PRIMARY KEY ("citylevel", "layer")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_tower_layer" (
  "uid" character varying(32) COLLATE "legacy_meta"."ci" NOT NULL,
  "layer" integer NOT NULL,
  "difficulty" smallint,
  "monsters" character varying(36) COLLATE "legacy_meta"."ci",
  "currentmonster" integer,
  "buff" character varying(36) COLLATE "legacy_meta"."ci",
  "buybuff" integer,
  "awards" text COLLATE "legacy_meta"."ci",
  "awardstate" smallint,
  "layerstate" smallint,
  "fighttime" bigint,
  CONSTRAINT "dragon_tower_layer_difficulty_range" CHECK ("difficulty" BETWEEN -128 AND 127),
  CONSTRAINT "dragon_tower_layer_awardstate_range" CHECK ("awardstate" BETWEEN -128 AND 127),
  CONSTRAINT "dragon_tower_layer_layerstate_range" CHECK ("layerstate" BETWEEN -128 AND 127),
  CONSTRAINT "dragon_tower_layer_PRIMARY" PRIMARY KEY ("uid", "layer")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "dragon_tower_layer_PRIMARY_pad" ON "cokdb1"."dragon_tower_layer" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("layer"));
--> statement-breakpoint
CREATE INDEX "dragon_tower_layer_Index_uid" ON "cokdb1"."dragon_tower_layer" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_tower_user" (
  "uid" character varying(32) COLLATE "legacy_meta"."ci" NOT NULL,
  "currentlayer" integer,
  "weeklymaxlayer" integer,
  "maxlayer" integer,
  "weeklyrevive" smallint,
  "resettimes" smallint,
  "dailyresettime" bigint,
  "weeklyresettime" bigint,
  "dragon" character varying(36) COLLATE "legacy_meta"."ci",
  "army" text COLLATE "legacy_meta"."ci",
  "deadarmy" text COLLATE "legacy_meta"."ci",
  "armyrevivenum" integer,
  "armyrevive" text COLLATE "legacy_meta"."ci",
  "armyrevivecd" bigint,
  "score" integer,
  "sharetimes" smallint,
  "generalid" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "dragon_tower_user_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "dragon_tower_user_PRIMARY_pad" ON "cokdb1"."dragon_tower_user" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."dragon_words_record" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "castleLevel" integer NOT NULL,
  "loadLevel" integer NOT NULL,
  "buildingLevel" integer NOT NULL,
  "activityTitle" integer NOT NULL,
  "talismanDetail" character varying(1024) COLLATE "legacy_meta"."ci",
  CONSTRAINT "dragon_words_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "dragon_words_record_PRIMARY_pad" ON "cokdb1"."dragon_words_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "dragon_words_record_dragon_words_record_index" ON "cokdb1"."dragon_words_record" (("castleLevel"), ("buildingLevel"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."egg_activity" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "curEgg" character varying(10) COLLATE "legacy_meta"."ci" NOT NULL,
  "eggCd" bigint DEFAULT 0,
  "exp" integer DEFAULT 0,
  "curExpStage" integer DEFAULT 0,
  CONSTRAINT "egg_activity_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "egg_activity_PRIMARY_pad" ON "cokdb1"."egg_activity" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."exception_user" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer NOT NULL,
  "day" character varying(10) COLLATE "legacy_meta"."ci" NOT NULL,
  "count" integer,
  "updateTime" bigint,
  CONSTRAINT "exception_user_PRIMARY" PRIMARY KEY ("uid", "type", "day")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "exception_user_PRIMARY_pad" ON "cokdb1"."exception_user" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"), (rtrim("day", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "buy" integer DEFAULT 0,
  "time" bigint DEFAULT 0,
  "flush" bigint DEFAULT 0,
  CONSTRAINT "exchange_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "exchange_PRIMARY_pad" ON "cokdb1"."exchange" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_activity" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "actId" character varying(10) COLLATE "legacy_meta"."ci" NOT NULL,
  "reward" bytea,
  "refresh" integer DEFAULT 0,
  "refreshTime" bigint DEFAULT 0,
  CONSTRAINT "exchange_activity_reward_length" CHECK (octet_length("reward") <= 65535),
  CONSTRAINT "exchange_activity_PRIMARY" PRIMARY KEY ("uid", "actId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "exchange_activity_PRIMARY_pad" ON "cokdb1"."exchange_activity" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("actId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_alliance_log" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "orderId" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci",
  "createTime" bigint NOT NULL,
  "status" smallint,
  CONSTRAINT "exchange_alliance_log_status_range" CHECK ("status" BETWEEN -128 AND 127),
  CONSTRAINT "exchange_alliance_log_PRIMARY" PRIMARY KEY ("uid", "orderId", "createTime")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "exchange_alliance_log_PRIMARY_pad" ON "cokdb1"."exchange_alliance_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("orderId", ' ') COLLATE "legacy_meta"."ci"), ("createTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_condition" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "soldierDead" bigint DEFAULT 0,
  "deadFlushTime" bigint DEFAULT 0,
  "payGold" integer DEFAULT 1,
  "goldFlushTime" bigint DEFAULT 0,
  CONSTRAINT "exchange_condition_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "exchange_condition_PRIMARY_pad" ON "cokdb1"."exchange_condition" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_gift" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "receiverId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "exchangeId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "sendTime" bigint,
  CONSTRAINT "exchange_gift_PRIMARY" PRIMARY KEY ("uid", "receiverId", "exchangeId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "exchange_gift_PRIMARY_pad" ON "cokdb1"."exchange_gift" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("receiverId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("exchangeId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_gift_log" (
  "mailId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "senderId" character varying(40) COLLATE "legacy_meta"."ci",
  "receiverId" character varying(40) COLLATE "legacy_meta"."ci",
  "exchangeId" character varying(20) COLLATE "legacy_meta"."ci",
  "sendTime" bigint NOT NULL,
  "status" smallint,
  "updateTime" bigint,
  CONSTRAINT "exchange_gift_log_status_range" CHECK ("status" BETWEEN -128 AND 127),
  CONSTRAINT "exchange_gift_log_PRIMARY" PRIMARY KEY ("mailId", "sendTime")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "exchange_gift_log_PRIMARY_pad" ON "cokdb1"."exchange_gift_log" ((rtrim("mailId", ' ') COLLATE "legacy_meta"."ci"), ("sendTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_group_type" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "group_type" integer DEFAULT 0 NOT NULL,
  "id" integer,
  "refreshtime" bigint,
  CONSTRAINT "exchange_group_type_PRIMARY" PRIMARY KEY ("uid", "group_type")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."exchange_group_type"."uid" IS '唯一ID';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."exchange_group_type"."group_type" IS '类型';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."exchange_group_type"."id" IS 'exchange静态表的id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."exchange_group_type"."refreshtime" IS '刷新的时间';
--> statement-breakpoint
CREATE UNIQUE INDEX "exchange_group_type_PRIMARY_pad" ON "cokdb1"."exchange_group_type" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("group_type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_order" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "itemId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  CONSTRAINT "exchange_order_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "exchange_order_PRIMARY_pad" ON "cokdb1"."exchange_order" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_time" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "beginTime" bigint,
  "buyTime" bigint,
  CONSTRAINT "exchange_time_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "exchange_time_PRIMARY_pad" ON "cokdb1"."exchange_time" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."exchange_visible" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "exchangeId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "createTime" bigint,
  CONSTRAINT "exchange_visible_PRIMARY" PRIMARY KEY ("uid", "exchangeId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "exchange_visible_PRIMARY_pad" ON "cokdb1"."exchange_visible" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("exchangeId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "exchange_visible_uid_index" ON "cokdb1"."exchange_visible" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."expedition_fail_award" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "score" double precision DEFAULT 0,
  "rewardId" character varying(20) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "rank" integer NOT NULL,
  CONSTRAINT "expedition_fail_award_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "expedition_fail_award_PRIMARY_pad" ON "cokdb1"."expedition_fail_award" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."expedition_mark" (
  "serverId" integer NOT NULL,
  "isKickFinished" smallint DEFAULT 0 NOT NULL,
  "isSendedAward" smallint DEFAULT 0 NOT NULL,
  "kickFinishTime" bigint NOT NULL,
  "sendAwardTime" bigint NOT NULL,
  CONSTRAINT "expedition_mark_isKickFinished_range" CHECK ("isKickFinished" BETWEEN -128 AND 127),
  CONSTRAINT "expedition_mark_isSendedAward_range" CHECK ("isSendedAward" BETWEEN -128 AND 127),
  CONSTRAINT "expedition_mark_PRIMARY" PRIMARY KEY ("serverId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."expedition_record" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint DEFAULT 0,
  "type" integer NOT NULL,
  "targetServerName" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "targetServerId" integer NOT NULL,
  "kingUid" character varying(255) COLLATE "legacy_meta"."ci",
  "kingUserName" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "expedition_record_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "expedition_record_PRIMARY_pad" ON "cokdb1"."expedition_record" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "expedition_record_time_index" ON "cokdb1"."expedition_record" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."fast_carry_activity" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '17' NOT NULL,
  "totalPoint" integer DEFAULT 0 NOT NULL,
  "lastEndTime" bigint DEFAULT 0 NOT NULL,
  "reward1" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '-1' NOT NULL,
  "reward2" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '-1' NOT NULL,
  "reward3" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '-1' NOT NULL,
  "reward4" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '-1' NOT NULL,
  "goalReward1" integer DEFAULT 0 NOT NULL,
  "goalReward2" integer DEFAULT 0 NOT NULL,
  "goalReward3" integer DEFAULT 0 NOT NULL,
  "goalReward4" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "fast_carry_activity_PRIMARY" PRIMARY KEY ("uid", "lastEndTime")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "fast_carry_activity_PRIMARY_pad" ON "cokdb1"."fast_carry_activity" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("lastEndTime"));
--> statement-breakpoint
CREATE INDEX "fast_carry_activity_goalReward" ON "cokdb1"."fast_carry_activity" (("goalReward1"), ("goalReward2"), ("goalReward3"), ("goalReward4"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."fastcarryhelp" (
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "maxcount" integer DEFAULT 0 NOT NULL,
  "nowcount" integer DEFAULT 0 NOT NULL,
  "helpers" character varying(2048) COLLATE "legacy_meta"."ci",
  "updatetime" bigint NOT NULL,
  "progress" integer DEFAULT 0,
  CONSTRAINT "fastcarryhelp_PRIMARY" PRIMARY KEY ("allianceId", "uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "fastcarryhelp_PRIMARY_pad" ON "cokdb1"."fastcarryhelp" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."feed_reward" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "feed_count" integer,
  "feed_time" bigint,
  "accept_count" integer,
  "accept_time" bigint,
  "feed_uuid" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "feed_reward_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "feed_reward_PRIMARY_pad" ON "cokdb1"."feed_reward" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."fight_arena_info" (
  "worldId" integer NOT NULL,
  "state" integer,
  "endTime" bigint,
  "version" integer,
  CONSTRAINT "fight_arena_info_PRIMARY" PRIMARY KEY ("worldId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."fight_arena_player_info" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci",
  "worldId" integer,
  "version" integer,
  "score" integer,
  "side" integer,
  "rankScore" integer
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."fight_king_status" (
  "index" integer NOT NULL,
  "info" character varying(8192) COLLATE "legacy_meta"."ci",
  CONSTRAINT "fight_king_status_PRIMARY" PRIMARY KEY ("index")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."firstpaylog" (
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
  CONSTRAINT "firstpaylog_PRIMARY" PRIMARY KEY ("uid", "orderId", "pf")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "firstpaylog_PRIMARY_pad" ON "cokdb1"."firstpaylog" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("orderId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "firstpaylog_index_time_pf" ON "cokdb1"."firstpaylog" (("time"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."fiveonlinedata" (
  "timeStamp" integer DEFAULT 0 NOT NULL,
  "count" integer,
  CONSTRAINT "fiveonlinedata_PRIMARY" PRIMARY KEY ("timeStamp")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."flower_history" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "sourceID" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "targetID" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "timeVal" bigint,
  "itemID" integer,
  "count" integer,
  CONSTRAINT "flower_history_PRIMARY" PRIMARY KEY ("uid", "sourceID", "targetID")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."flower_history"."uid" IS '唯一ID';
--> statement-breakpoint
CREATE UNIQUE INDEX "flower_history_PRIMARY_pad" ON "cokdb1"."flower_history" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("sourceID", ' ') COLLATE "legacy_meta"."ci"), (rtrim("targetID", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."flower_info" (
  "uid" character varying(38) COLLATE "legacy_meta"."ci" NOT NULL,
  "lastflowerRanking" integer,
  "lastOperatorFlower" bigint,
  "flowerUse" character varying(255) COLLATE "legacy_meta"."ci",
  "lastCanvassTime" bigint DEFAULT 0,
  "lastBeCanvassTime" bigint DEFAULT 0,
  CONSTRAINT "flower_info_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."flower_info"."uid" IS '玩家uuid';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."flower_info"."lastflowerRanking" IS '鲜花排行榜的上次排名';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."flower_info"."flowerUse" IS '已经使用过的道具次数';
--> statement-breakpoint
CREATE UNIQUE INDEX "flower_info_PRIMARY_pad" ON "cokdb1"."flower_info" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."flower_notice" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "addTime" bigint,
  "targetID" character varying(255) COLLATE "legacy_meta"."ci",
  "sourceName" character varying(255) COLLATE "legacy_meta"."ci",
  "sourceID" character varying(255) COLLATE "legacy_meta"."ci",
  "itemID" character varying(255) COLLATE "legacy_meta"."ci",
  "itemCount" integer,
  CONSTRAINT "flower_notice_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."flower_notice"."uid" IS '唯一ID';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."flower_notice"."addTime" IS '记录添加的时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."flower_notice"."targetID" IS '鲜花的接受者';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."flower_notice"."sourceName" IS '鲜花的发起者昵称';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."flower_notice"."sourceID" IS '鲜花的发起者ID';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."flower_notice"."itemID" IS '物品ID';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."flower_notice"."itemCount" IS '使用物品的数量';
--> statement-breakpoint
CREATE UNIQUE INDEX "flower_notice_PRIMARY_pad" ON "cokdb1"."flower_notice" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."flower_ranking" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "scoreVal" integer,
  "flowerVal" integer,
  "eggVal" integer,
  "hideKing" integer DEFAULT 0,
  CONSTRAINT "flower_ranking_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."flower_ranking"."uid" IS '唯一ID';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."flower_ranking"."scoreVal" IS '玩家积分';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."flower_ranking"."flowerVal" IS '所收到的鲜花数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."flower_ranking"."eggVal" IS 'eggVal';
--> statement-breakpoint
CREATE UNIQUE INDEX "flower_ranking_PRIMARY_pad" ON "cokdb1"."flower_ranking" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."foreigen_sciences" (
  "uid" character varying(32) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemid" integer NOT NULL,
  "level" integer,
  "cdtime" bigint,
  "reserve" integer,
  CONSTRAINT "foreigen_sciences_PRIMARY" PRIMARY KEY ("uid", "itemid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "foreigen_sciences_PRIMARY_pad" ON "cokdb1"."foreigen_sciences" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("itemid"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."formation_info" (
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
COMMENT ON COLUMN "cokdb1"."formation_info"."customName" IS '???????';
--> statement-breakpoint
CREATE UNIQUE INDEX "formation_info_PRIMARY_pad" ON "cokdb1"."formation_info" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("index1"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."fresh_recharge_reward" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "id" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  CONSTRAINT "fresh_recharge_reward_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "fresh_recharge_reward_PRIMARY_pad" ON "cokdb1"."fresh_recharge_reward" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."friend_help" (
  "fromId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "toId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "friend_help_PRIMARY" PRIMARY KEY ("fromId", "toId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "friend_help_PRIMARY_pad" ON "cokdb1"."friend_help" ((rtrim("fromId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("toId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."friend_mine" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer,
  "helpCount" integer,
  "time" bigint DEFAULT 0,
  CONSTRAINT "friend_mine_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "friend_mine_PRIMARY_pad" ON "cokdb1"."friend_mine" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."fserver_data" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "value" text COLLATE "legacy_meta"."ci",
  CONSTRAINT "fserver_data_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "fserver_data_PRIMARY_pad" ON "cokdb1"."fserver_data" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."function_notice" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "noticeMapStr" text COLLATE "legacy_meta"."ci",
  CONSTRAINT "function_notice_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "function_notice_PRIMARY_pad" ON "cokdb1"."function_notice" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."general_challenge_layer" (
  "id" integer DEFAULT 0 NOT NULL,
  "uid" character varying(96) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "count" integer,
  "buycount" integer,
  "finishcount" integer,
  "monsterid" integer,
  "challengetime" bigint,
  "resettime" bigint,
  CONSTRAINT "general_challenge_layer_PRIMARY" PRIMARY KEY ("id", "uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "general_challenge_layer_PRIMARY_pad" ON "cokdb1"."general_challenge_layer" (("id"), (rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."gm_expedition_match" (
  "serverId" integer NOT NULL,
  "targetServerId" integer NOT NULL,
  "time" bigint DEFAULT 0,
  CONSTRAINT "gm_expedition_match_PRIMARY" PRIMARY KEY ("serverId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."gold_cost_record" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "goldType" integer,
  "type" integer NOT NULL,
  "param1" integer,
  "param2" integer,
  "originalGold" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remainGold" bigint NOT NULL,
  "time" bigint NOT NULL,
  CONSTRAINT "gold_cost_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "gold_cost_record_PRIMARY_pad" ON "cokdb1"."gold_cost_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "gold_cost_record_index_user" ON "cokdb1"."gold_cost_record" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE INDEX "gold_cost_record_index_type" ON "cokdb1"."gold_cost_record" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"), ("type"));
--> statement-breakpoint
CREATE INDEX "gold_cost_record_index_goldType" ON "cokdb1"."gold_cost_record" (("goldType"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."gold_eggs" (
  "uid" character varying(96) COLLATE "legacy_meta"."ci" NOT NULL,
  "flushfreetimes" integer DEFAULT 0 NOT NULL,
  "flushtime" bigint DEFAULT 0 NOT NULL,
  "flushcount" integer DEFAULT 0 NOT NULL,
  "statelist" character varying(1024) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "freetimes" integer DEFAULT 0 NOT NULL,
  "everydaytime" bigint DEFAULT 0 NOT NULL,
  "multiple" integer DEFAULT 1 NOT NULL,
  "score" bigint DEFAULT 0 NOT NULL,
  "score_reward" character varying(512) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "ranking" integer DEFAULT 0 NOT NULL,
  "createtime" bigint DEFAULT 0 NOT NULL,
  "onlogintime" bigint DEFAULT 0,
  CONSTRAINT "gold_eggs_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."gold_eggs"."flushfreetimes" IS '免费刷新次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."gold_eggs"."flushtime" IS '盘面刷新时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."gold_eggs"."flushcount" IS '刷新的次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."gold_eggs"."statelist" IS '盘面蛋的状态';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."gold_eggs"."freetimes" IS '免费砸蛋次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."gold_eggs"."everydaytime" IS '每天刷新赠送次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."gold_eggs"."multiple" IS '倍数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."gold_eggs"."score" IS '总的分数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."gold_eggs"."score_reward" IS '是否已经领奖';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."gold_eggs"."ranking" IS '排名';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."gold_eggs"."createtime" IS '本次活动激活的时间';
--> statement-breakpoint
CREATE UNIQUE INDEX "gold_eggs_PRIMARY_pad" ON "cokdb1"."gold_eggs" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."gold_group_buy" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "flushtime" bigint DEFAULT 0 NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "create_time" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "gold_group_buy_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."gold_group_buy"."flushtime" IS '购买时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."gold_group_buy"."num" IS '已经团购该物品到达的数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."gold_group_buy"."create_time" IS '活动内激活时间';
--> statement-breakpoint
CREATE UNIQUE INDEX "gold_group_buy_PRIMARY_pad" ON "cokdb1"."gold_group_buy" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."gold_wish_pool" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "times" integer NOT NULL,
  "costGold" integer,
  "getGold" integer,
  "rate" integer,
  "time" bigint,
  CONSTRAINT "gold_wish_pool_PRIMARY" PRIMARY KEY ("uid", "times")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "gold_wish_pool_PRIMARY_pad" ON "cokdb1"."gold_wish_pool" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("times"));
--> statement-breakpoint
CREATE INDEX "gold_wish_pool_byUid" ON "cokdb1"."gold_wish_pool" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_PRIMARY_pad" ON "cokdb1"."goods_cost_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_index_time" ON "cokdb1"."goods_cost_record" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_index_user" ON "cokdb1"."goods_cost_record" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_0" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2024_0_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2024_0_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2024_0" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_0_index_type" ON "cokdb1"."goods_cost_record_2024_0" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_0_index_time" ON "cokdb1"."goods_cost_record_2024_0" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_0_index_time_user" ON "cokdb1"."goods_cost_record_2024_0" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_0_index_user_time" ON "cokdb1"."goods_cost_record_2024_0" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_1" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2024_1_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2024_1_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2024_1" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_1_index_type" ON "cokdb1"."goods_cost_record_2024_1" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_1_index_time" ON "cokdb1"."goods_cost_record_2024_1" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_1_index_time_user" ON "cokdb1"."goods_cost_record_2024_1" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_1_index_user_time" ON "cokdb1"."goods_cost_record_2024_1" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_10" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2024_10_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2024_10_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2024_10" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_10_index_type" ON "cokdb1"."goods_cost_record_2024_10" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_10_index_time" ON "cokdb1"."goods_cost_record_2024_10" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_10_index_time_user" ON "cokdb1"."goods_cost_record_2024_10" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_10_index_user_time" ON "cokdb1"."goods_cost_record_2024_10" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_11" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2024_11_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2024_11_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2024_11" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_11_index_type" ON "cokdb1"."goods_cost_record_2024_11" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_11_index_time" ON "cokdb1"."goods_cost_record_2024_11" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_11_index_time_user" ON "cokdb1"."goods_cost_record_2024_11" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_11_index_user_time" ON "cokdb1"."goods_cost_record_2024_11" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_2" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2024_2_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2024_2_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2024_2" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_2_index_type" ON "cokdb1"."goods_cost_record_2024_2" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_2_index_time" ON "cokdb1"."goods_cost_record_2024_2" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_2_index_time_user" ON "cokdb1"."goods_cost_record_2024_2" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_2_index_user_time" ON "cokdb1"."goods_cost_record_2024_2" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_3" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2024_3_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2024_3_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2024_3" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_3_index_type" ON "cokdb1"."goods_cost_record_2024_3" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_3_index_time" ON "cokdb1"."goods_cost_record_2024_3" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_3_index_time_user" ON "cokdb1"."goods_cost_record_2024_3" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_3_index_user_time" ON "cokdb1"."goods_cost_record_2024_3" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_4" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2024_4_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2024_4_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2024_4" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_4_index_type" ON "cokdb1"."goods_cost_record_2024_4" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_4_index_time" ON "cokdb1"."goods_cost_record_2024_4" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_4_index_time_user" ON "cokdb1"."goods_cost_record_2024_4" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_4_index_user_time" ON "cokdb1"."goods_cost_record_2024_4" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_5" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2024_5_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2024_5_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2024_5" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_5_index_type" ON "cokdb1"."goods_cost_record_2024_5" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_5_index_time" ON "cokdb1"."goods_cost_record_2024_5" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_5_index_time_user" ON "cokdb1"."goods_cost_record_2024_5" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_5_index_user_time" ON "cokdb1"."goods_cost_record_2024_5" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_6" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2024_6_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2024_6_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2024_6" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_6_index_type" ON "cokdb1"."goods_cost_record_2024_6" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_6_index_time" ON "cokdb1"."goods_cost_record_2024_6" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_6_index_time_user" ON "cokdb1"."goods_cost_record_2024_6" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_6_index_user_time" ON "cokdb1"."goods_cost_record_2024_6" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_7" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2024_7_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2024_7_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2024_7" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_7_index_type" ON "cokdb1"."goods_cost_record_2024_7" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_7_index_time" ON "cokdb1"."goods_cost_record_2024_7" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_7_index_time_user" ON "cokdb1"."goods_cost_record_2024_7" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_7_index_user_time" ON "cokdb1"."goods_cost_record_2024_7" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_8" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2024_8_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2024_8_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2024_8" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_8_index_type" ON "cokdb1"."goods_cost_record_2024_8" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_8_index_time" ON "cokdb1"."goods_cost_record_2024_8" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_8_index_time_user" ON "cokdb1"."goods_cost_record_2024_8" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_8_index_user_time" ON "cokdb1"."goods_cost_record_2024_8" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2024_9" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2024_9_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2024_9_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2024_9" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_9_index_type" ON "cokdb1"."goods_cost_record_2024_9" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_9_index_time" ON "cokdb1"."goods_cost_record_2024_9" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_9_index_time_user" ON "cokdb1"."goods_cost_record_2024_9" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2024_9_index_user_time" ON "cokdb1"."goods_cost_record_2024_9" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_0" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2026_0_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2026_0_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2026_0" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_0_index_type" ON "cokdb1"."goods_cost_record_2026_0" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_0_index_time" ON "cokdb1"."goods_cost_record_2026_0" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_0_index_time_user" ON "cokdb1"."goods_cost_record_2026_0" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_0_index_user_time" ON "cokdb1"."goods_cost_record_2026_0" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_1" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2026_1_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2026_1_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2026_1" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_1_index_type" ON "cokdb1"."goods_cost_record_2026_1" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_1_index_time" ON "cokdb1"."goods_cost_record_2026_1" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_1_index_time_user" ON "cokdb1"."goods_cost_record_2026_1" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_1_index_user_time" ON "cokdb1"."goods_cost_record_2026_1" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_10" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2026_10_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2026_10_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2026_10" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_10_index_type" ON "cokdb1"."goods_cost_record_2026_10" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_10_index_time" ON "cokdb1"."goods_cost_record_2026_10" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_10_index_time_user" ON "cokdb1"."goods_cost_record_2026_10" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_10_index_user_time" ON "cokdb1"."goods_cost_record_2026_10" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_11" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2026_11_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2026_11_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2026_11" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_11_index_type" ON "cokdb1"."goods_cost_record_2026_11" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_11_index_time" ON "cokdb1"."goods_cost_record_2026_11" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_11_index_time_user" ON "cokdb1"."goods_cost_record_2026_11" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_11_index_user_time" ON "cokdb1"."goods_cost_record_2026_11" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_2" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2026_2_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2026_2_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2026_2" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_2_index_type" ON "cokdb1"."goods_cost_record_2026_2" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_2_index_time" ON "cokdb1"."goods_cost_record_2026_2" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_2_index_time_user" ON "cokdb1"."goods_cost_record_2026_2" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_2_index_user_time" ON "cokdb1"."goods_cost_record_2026_2" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_3" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2026_3_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2026_3_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2026_3" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_3_index_type" ON "cokdb1"."goods_cost_record_2026_3" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_3_index_time" ON "cokdb1"."goods_cost_record_2026_3" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_3_index_time_user" ON "cokdb1"."goods_cost_record_2026_3" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_3_index_user_time" ON "cokdb1"."goods_cost_record_2026_3" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_4" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2026_4_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2026_4_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2026_4" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_4_index_type" ON "cokdb1"."goods_cost_record_2026_4" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_4_index_time" ON "cokdb1"."goods_cost_record_2026_4" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_4_index_time_user" ON "cokdb1"."goods_cost_record_2026_4" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_4_index_user_time" ON "cokdb1"."goods_cost_record_2026_4" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_5" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2026_5_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2026_5_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2026_5" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_5_index_type" ON "cokdb1"."goods_cost_record_2026_5" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_5_index_time" ON "cokdb1"."goods_cost_record_2026_5" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_5_index_time_user" ON "cokdb1"."goods_cost_record_2026_5" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_5_index_user_time" ON "cokdb1"."goods_cost_record_2026_5" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_6" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2026_6_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2026_6_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2026_6" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_6_index_type" ON "cokdb1"."goods_cost_record_2026_6" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_6_index_time" ON "cokdb1"."goods_cost_record_2026_6" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_6_index_time_user" ON "cokdb1"."goods_cost_record_2026_6" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_6_index_user_time" ON "cokdb1"."goods_cost_record_2026_6" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_7" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2026_7_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2026_7_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2026_7" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_7_index_type" ON "cokdb1"."goods_cost_record_2026_7" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_7_index_time" ON "cokdb1"."goods_cost_record_2026_7" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_7_index_time_user" ON "cokdb1"."goods_cost_record_2026_7" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_7_index_user_time" ON "cokdb1"."goods_cost_record_2026_7" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_8" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2026_8_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2026_8_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2026_8" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_8_index_type" ON "cokdb1"."goods_cost_record_2026_8" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_8_index_time" ON "cokdb1"."goods_cost_record_2026_8" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_8_index_time_user" ON "cokdb1"."goods_cost_record_2026_8" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_8_index_user_time" ON "cokdb1"."goods_cost_record_2026_8" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2026_9" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2026_9_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2026_9_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2026_9" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_9_index_type" ON "cokdb1"."goods_cost_record_2026_9" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_9_index_time" ON "cokdb1"."goods_cost_record_2026_9" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_9_index_time_user" ON "cokdb1"."goods_cost_record_2026_9" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2026_9_index_user_time" ON "cokdb1"."goods_cost_record_2026_9" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_0" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2027_0_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2027_0_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2027_0" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_0_index_type" ON "cokdb1"."goods_cost_record_2027_0" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_0_index_time" ON "cokdb1"."goods_cost_record_2027_0" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_0_index_time_user" ON "cokdb1"."goods_cost_record_2027_0" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_0_index_user_time" ON "cokdb1"."goods_cost_record_2027_0" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_1" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2027_1_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2027_1_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2027_1" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_1_index_type" ON "cokdb1"."goods_cost_record_2027_1" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_1_index_time" ON "cokdb1"."goods_cost_record_2027_1" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_1_index_time_user" ON "cokdb1"."goods_cost_record_2027_1" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_1_index_user_time" ON "cokdb1"."goods_cost_record_2027_1" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_10" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2027_10_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2027_10_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2027_10" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_10_index_type" ON "cokdb1"."goods_cost_record_2027_10" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_10_index_time" ON "cokdb1"."goods_cost_record_2027_10" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_10_index_time_user" ON "cokdb1"."goods_cost_record_2027_10" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_10_index_user_time" ON "cokdb1"."goods_cost_record_2027_10" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_11" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2027_11_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2027_11_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2027_11" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_11_index_type" ON "cokdb1"."goods_cost_record_2027_11" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_11_index_time" ON "cokdb1"."goods_cost_record_2027_11" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_11_index_time_user" ON "cokdb1"."goods_cost_record_2027_11" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_11_index_user_time" ON "cokdb1"."goods_cost_record_2027_11" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_2" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2027_2_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2027_2_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2027_2" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_2_index_type" ON "cokdb1"."goods_cost_record_2027_2" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_2_index_time" ON "cokdb1"."goods_cost_record_2027_2" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_2_index_time_user" ON "cokdb1"."goods_cost_record_2027_2" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_2_index_user_time" ON "cokdb1"."goods_cost_record_2027_2" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_3" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2027_3_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2027_3_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2027_3" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_3_index_type" ON "cokdb1"."goods_cost_record_2027_3" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_3_index_time" ON "cokdb1"."goods_cost_record_2027_3" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_3_index_time_user" ON "cokdb1"."goods_cost_record_2027_3" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_3_index_user_time" ON "cokdb1"."goods_cost_record_2027_3" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_4" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2027_4_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2027_4_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2027_4" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_4_index_type" ON "cokdb1"."goods_cost_record_2027_4" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_4_index_time" ON "cokdb1"."goods_cost_record_2027_4" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_4_index_time_user" ON "cokdb1"."goods_cost_record_2027_4" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_4_index_user_time" ON "cokdb1"."goods_cost_record_2027_4" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_5" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2027_5_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2027_5_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2027_5" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_5_index_type" ON "cokdb1"."goods_cost_record_2027_5" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_5_index_time" ON "cokdb1"."goods_cost_record_2027_5" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_5_index_time_user" ON "cokdb1"."goods_cost_record_2027_5" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_5_index_user_time" ON "cokdb1"."goods_cost_record_2027_5" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_6" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2027_6_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2027_6_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2027_6" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_6_index_type" ON "cokdb1"."goods_cost_record_2027_6" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_6_index_time" ON "cokdb1"."goods_cost_record_2027_6" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_6_index_time_user" ON "cokdb1"."goods_cost_record_2027_6" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_6_index_user_time" ON "cokdb1"."goods_cost_record_2027_6" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_7" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2027_7_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2027_7_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2027_7" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_7_index_type" ON "cokdb1"."goods_cost_record_2027_7" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_7_index_time" ON "cokdb1"."goods_cost_record_2027_7" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_7_index_time_user" ON "cokdb1"."goods_cost_record_2027_7" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_7_index_user_time" ON "cokdb1"."goods_cost_record_2027_7" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_8" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2027_8_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2027_8_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2027_8" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_8_index_type" ON "cokdb1"."goods_cost_record_2027_8" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_8_index_time" ON "cokdb1"."goods_cost_record_2027_8" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_8_index_time_user" ON "cokdb1"."goods_cost_record_2027_8" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_8_index_user_time" ON "cokdb1"."goods_cost_record_2027_8" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_cost_record_2027_9" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "goods_cost_record_2027_9_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_cost_record_2027_9_PRIMARY_pad" ON "cokdb1"."goods_cost_record_2027_9" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_9_index_type" ON "cokdb1"."goods_cost_record_2027_9" (("type"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_9_index_time" ON "cokdb1"."goods_cost_record_2027_9" (("time"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_9_index_time_user" ON "cokdb1"."goods_cost_record_2027_9" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "goods_cost_record_2027_9_index_user_time" ON "cokdb1"."goods_cost_record_2027_9" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."goods_exchange_goods" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 3073) NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" smallint DEFAULT 1 NOT NULL,
  "sumNum" bigint DEFAULT 0 NOT NULL,
  "stage" smallint DEFAULT 1 NOT NULL,
  "getAward" smallint DEFAULT 0 NOT NULL,
  CONSTRAINT "goods_exchange_goods_type_range" CHECK ("type" BETWEEN -128 AND 127),
  CONSTRAINT "goods_exchange_goods_stage_range" CHECK ("stage" BETWEEN -128 AND 127),
  CONSTRAINT "goods_exchange_goods_getAward_range" CHECK ("getAward" BETWEEN -128 AND 127),
  CONSTRAINT "goods_exchange_goods_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."hero_activity" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "activityId" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "activityType" integer,
  "startTime" bigint DEFAULT 0,
  "roundTime" bigint DEFAULT 0,
  "endTime" bigint DEFAULT 0,
  "finish" integer DEFAULT 0,
  "alreadyEvent" character varying(1000) COLLATE "legacy_meta"."ci",
  "serverGroup" character varying(255) COLLATE "legacy_meta"."ci",
  "kingdomRank" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "hero_activity_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "hero_activity_PRIMARY_pad" ON "cokdb1"."hero_activity" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "hero_activity_st_idx" ON "cokdb1"."hero_activity" (("startTime"));
--> statement-breakpoint
CREATE INDEX "hero_activity_et_idx" ON "cokdb1"."hero_activity" (("endTime"));
--> statement-breakpoint
CREATE INDEX "hero_activity_act_idx" ON "cokdb1"."hero_activity" ((rtrim("activityId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."hero_event" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "eventId" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "activityId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer,
  "rewardType" integer,
  "readyTime" bigint DEFAULT 0,
  "startTime" bigint DEFAULT 0,
  "lastTime" bigint DEFAULT 0,
  "endTime" bigint DEFAULT 0,
  "rewardStatus" integer DEFAULT 0,
  "serverGroup" character varying(255) COLLATE "legacy_meta"."ci",
  "kingdomRank" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "hero_event_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "hero_event_PRIMARY_pad" ON "cokdb1"."hero_event" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "hero_event_act_idx" ON "cokdb1"."hero_event" ((rtrim("activityId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "hero_event_st_idx" ON "cokdb1"."hero_event" (("startTime"));
--> statement-breakpoint
CREATE INDEX "hero_event_et_idx" ON "cokdb1"."hero_event" (("endTime"));
--> statement-breakpoint
CREATE INDEX "hero_event_eid_idx" ON "cokdb1"."hero_event" ((rtrim("eventId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "hero_event_r_idx" ON "cokdb1"."hero_event" (("rewardStatus"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."hero_event_reward_record" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "allianceId" character varying(255) COLLATE "C" DEFAULT '' NOT NULL,
  "eventId" character varying(255) COLLATE "C" NOT NULL,
  "rank" integer,
  "level" integer DEFAULT 0,
  "rewardId" character varying(255) COLLATE "C",
  "time" bigint DEFAULT 0,
  CONSTRAINT "hero_event_reward_record_PRIMARY" PRIMARY KEY ("uid", "allianceId", "eventId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "hero_event_reward_record_PRIMARY_pad" ON "cokdb1"."hero_event_reward_record" ((rtrim("uid", ' ') COLLATE "C"), (rtrim("allianceId", ' ') COLLATE "C"), (rtrim("eventId", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "hero_event_reward_record_eid_idx" ON "cokdb1"."hero_event_reward_record" ((rtrim("eventId", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "hero_event_reward_record_time_idx" ON "cokdb1"."hero_event_reward_record" (("time"));
--> statement-breakpoint
CREATE INDEX "hero_event_reward_record_level_idx" ON "cokdb1"."hero_event_reward_record" (("level"));
--> statement-breakpoint
CREATE INDEX "hero_event_reward_record_al_idx" ON "cokdb1"."hero_event_reward_record" ((rtrim("allianceId", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."hero_office" (
  "id" integer NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "officeId" character varying(40) COLLATE "legacy_meta"."ci",
  "position" integer DEFAULT 0,
  "startTime" bigint DEFAULT 0,
  "lastRefreshExpTime" bigint DEFAULT 0,
  CONSTRAINT "hero_office_PRIMARY" PRIMARY KEY ("id", "uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "hero_office_PRIMARY_pad" ON "cokdb1"."hero_office" (("id"), (rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "hero_office_uid_index" ON "cokdb1"."hero_office" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."hot_buy_record" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "goodsId" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "buyCount" integer DEFAULT 0,
  CONSTRAINT "hot_buy_record_PRIMARY" PRIMARY KEY ("uid", "goodsId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "hot_buy_record_PRIMARY_pad" ON "cokdb1"."hot_buy_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("goodsId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."hot_goods_cost_record" (
  "uuid" character varying(255) COLLATE "C" NOT NULL,
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "goodsId" character varying(20) COLLATE "C" NOT NULL,
  "priceType" integer,
  "price" integer,
  "buyTime" bigint,
  CONSTRAINT "hot_goods_cost_record_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "hot_goods_cost_record_PRIMARY_pad" ON "cokdb1"."hot_goods_cost_record" ((rtrim("uuid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "hot_goods_cost_record_uid_idx" ON "cokdb1"."hot_goods_cost_record" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "hot_goods_cost_record_goods_idx" ON "cokdb1"."hot_goods_cost_record" ((rtrim("goodsId", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "hot_goods_cost_record_time_idx" ON "cokdb1"."hot_goods_cost_record" (("buyTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."hot_info_before_refresh" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "goodsId" character varying(20) COLLATE "C" NOT NULL,
  "itemId" character varying(20) COLLATE "C",
  "priceType" integer,
  "price" integer NOT NULL,
  "num" integer,
  "refreshTime" bigint DEFAULT 0 NOT NULL,
  "gold" integer DEFAULT 0,
  CONSTRAINT "hot_info_before_refresh_PRIMARY" PRIMARY KEY ("uid", "goodsId", "price", "refreshTime")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "hot_info_before_refresh_PRIMARY_pad" ON "cokdb1"."hot_info_before_refresh" ((rtrim("uid", ' ') COLLATE "C"), (rtrim("goodsId", ' ') COLLATE "C"), ("price"), ("refreshTime"));
--> statement-breakpoint
CREATE INDEX "hot_info_before_refresh_time_idx" ON "cokdb1"."hot_info_before_refresh" (("refreshTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."hot_refresh_record" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "count" integer DEFAULT 0,
  "todayTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "hot_refresh_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "hot_refresh_record_PRIMARY_pad" ON "cokdb1"."hot_refresh_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."innercityskin" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "style" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '-1',
  "zoom" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "show_type" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '-1',
  "time" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "innercityskin_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "innercityskin_PRIMARY_pad" ON "cokdb1"."innercityskin" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."invest_everyday" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "tableid" integer NOT NULL,
  "level" integer NOT NULL,
  "isreceive" character varying(128) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "beginTime" bigint DEFAULT 0,
  "receiveTime" bigint DEFAULT 0,
  "endactive" integer DEFAULT 0,
  "promptTime" bigint DEFAULT 0,
  CONSTRAINT "invest_everyday_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."invest_everyday"."uid" IS '唯一ID';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."invest_everyday"."tableid" IS '存储的当前表格id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."invest_everyday"."level" IS '投资时玩家等级';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."invest_everyday"."isreceive" IS '是否领取0未领取1领取,数组';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."invest_everyday"."beginTime" IS '投资的时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."invest_everyday"."receiveTime" IS '领取的时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."invest_everyday"."endactive" IS '该次分期结束';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."invest_everyday"."promptTime" IS '提示领取的时间';
--> statement-breakpoint
CREATE UNIQUE INDEX "invest_everyday_PRIMARY_pad" ON "cokdb1"."invest_everyday" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."invite_count" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "count" integer DEFAULT 0,
  CONSTRAINT "invite_count_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "invite_count_PRIMARY_pad" ON "cokdb1"."invite_count" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."invitee" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "inviterUid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "status" integer,
  "time" bigint,
  CONSTRAINT "invitee_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "invitee_PRIMARY_pad" ON "cokdb1"."invitee" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."inviter" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "inviteeUid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "gold" bigint,
  "time" bigint,
  CONSTRAINT "inviter_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "inviter_PRIMARY_pad" ON "cokdb1"."inviter" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "inviter_inviter_index_001" ON "cokdb1"."inviter" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"), ("time"));
--> statement-breakpoint
CREATE INDEX "inviter_uid_type_inviteeUid" ON "cokdb1"."inviter" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("inviteeUid", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."item_count_control" (
  "itemId" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "count" integer,
  "total" integer,
  "total2" integer,
  "lastRefreshTime" bigint,
  CONSTRAINT "item_count_control_PRIMARY" PRIMARY KEY ("itemId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "item_count_control_PRIMARY_pad" ON "cokdb1"."item_count_control" ((rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."king_allot_tax_record" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "kingUid" character varying(255) COLLATE "legacy_meta"."ci",
  "kingName" character varying(255) COLLATE "legacy_meta"."ci",
  "toUid" character varying(255) COLLATE "legacy_meta"."ci",
  "toUserName" character varying(255) COLLATE "legacy_meta"."ci",
  "wood" bigint DEFAULT 0,
  "food" bigint DEFAULT 0,
  "iron" bigint DEFAULT 0,
  "stone" bigint DEFAULT 0,
  "sendTime" bigint DEFAULT 0,
  CONSTRAINT "king_allot_tax_record_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "king_allot_tax_record_PRIMARY_pad" ON "cokdb1"."king_allot_tax_record" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "king_allot_tax_record_time_index" ON "cokdb1"."king_allot_tax_record" (("sendTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."king_fight_log" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 46500) NOT NULL,
  "index" integer NOT NULL,
  "logTime" bigint DEFAULT 0,
  "logType" character varying(128) COLLATE "legacy_meta"."ci" DEFAULT '',
  "uid" character varying(128) COLLATE "legacy_meta"."ci" DEFAULT '',
  "log" character varying(2048) COLLATE "legacy_meta"."ci" DEFAULT '',
  CONSTRAINT "king_fight_log_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE INDEX "king_fight_log_uid_index" ON "cokdb1"."king_fight_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."king_present_record" (
  "toUserId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "presentId" integer NOT NULL,
  "presentNameId" integer NOT NULL,
  "sendTime" bigint NOT NULL,
  "abbr" character varying(10) COLLATE "legacy_meta"."ci",
  CONSTRAINT "king_present_record_PRIMARY" PRIMARY KEY ("toUserId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "king_present_record_PRIMARY_pad" ON "cokdb1"."king_present_record" ((rtrim("toUserId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."king_skill_event" (
  "uid" character varying(256) COLLATE "legacy_meta"."ci",
  "skillId" character varying(128) COLLATE "legacy_meta"."ci",
  "data" character varying(1024) COLLATE "legacy_meta"."ci",
  "opTime" bigint,
  "params" character varying(1024) COLLATE "legacy_meta"."ci",
  "dialogId" character varying(128) COLLATE "legacy_meta"."ci"
);
--> statement-breakpoint
CREATE INDEX "king_skill_event_uid_index" ON "cokdb1"."king_skill_event" ((rtrim(left("uid", 255), ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."king_skill_status" (
  "id" integer DEFAULT 0 NOT NULL,
  "kingMsg" character varying(2048) COLLATE "legacy_meta"."ci" NOT NULL,
  "curChooseSkill" character varying(128) COLLATE "legacy_meta"."ci",
  "skillMaterial" bigint,
  CONSTRAINT "king_skill_status_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."king_tax_record" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "taxTime" bigint DEFAULT 0,
  "type" integer DEFAULT 0,
  "targetServerName" character varying(255) COLLATE "legacy_meta"."ci",
  "targetServerId" integer DEFAULT 0,
  "wood" bigint DEFAULT 0,
  "food" bigint DEFAULT 0,
  "iron" bigint DEFAULT 0,
  "stone" bigint DEFAULT 0,
  CONSTRAINT "king_tax_record_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "king_tax_record_PRIMARY_pad" ON "cokdb1"."king_tax_record" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "king_tax_record_time_index" ON "cokdb1"."king_tax_record" (("taxTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."king_time_fight_log" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "logtime" bigint,
  "category" integer,
  "humanUid" character varying(255) COLLATE "legacy_meta"."ci",
  "pointId" integer,
  "data1" character varying(255) COLLATE "legacy_meta"."ci",
  "data2" character varying(255) COLLATE "legacy_meta"."ci",
  "data3" character varying(255) COLLATE "legacy_meta"."ci",
  "data4" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "king_time_fight_log_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "king_time_fight_log_PRIMARY_pad" ON "cokdb1"."king_time_fight_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "king_time_fight_log_Index_logtime" ON "cokdb1"."king_time_fight_log" (("logtime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_battle_team" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer NOT NULL,
  "targetId" integer NOT NULL,
  "targetUid" character varying(40) COLLATE "legacy_meta"."ci",
  "targetName" character varying(255) COLLATE "legacy_meta"."ci",
  "targetPic" character varying(40) COLLATE "legacy_meta"."ci",
  "targetAName" character varying(40) COLLATE "legacy_meta"."ci",
  "targetAAbbr" character varying(40) COLLATE "legacy_meta"."ci",
  "targetAIcon" character varying(40) COLLATE "legacy_meta"."ci",
  "targetType" integer DEFAULT 0,
  "leaderUid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "leaderName" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "leaderId" integer,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceName" character varying(40) COLLATE "legacy_meta"."ci",
  "allianceAbbr" character varying(40) COLLATE "legacy_meta"."ci",
  "allianceIcon" character varying(40) COLLATE "legacy_meta"."ci",
  "maxSoldiers" integer NOT NULL,
  "waitTime" bigint NOT NULL,
  "createTime" bigint NOT NULL,
  "worldId" integer DEFAULT 0 NOT NULL,
  "failBackItem" integer DEFAULT 0,
  "superTeam" integer DEFAULT 0,
  CONSTRAINT "kingdom_battle_team_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "kingdom_battle_team_PRIMARY_pad" ON "cokdb1"."kingdom_battle_team" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_building" (
  "uuid" character varying(36) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemid" integer,
  "name" character varying(64) COLLATE "legacy_meta"."ci",
  "worldid" integer,
  "point" integer,
  "level" integer,
  "star" integer,
  "progress" smallint,
  "creator" character varying(32) COLLATE "legacy_meta"."ci",
  "createtime" bigint,
  "starttime" bigint,
  "updatetime" bigint,
  "type" smallint,
  "state" integer,
  "skin" character varying(64) COLLATE "legacy_meta"."ci",
  "speed" numeric(20,10),
  "maxdef" integer,
  "curdef" integer,
  "owner" integer,
  "occupy" integer,
  "reserve" bigint,
  CONSTRAINT "kingdom_building_progress_range" CHECK ("progress" BETWEEN -128 AND 127),
  CONSTRAINT "kingdom_building_type_range" CHECK ("type" BETWEEN -128 AND 127),
  CONSTRAINT "kingdom_building_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "kingdom_building_PRIMARY_pad" ON "cokdb1"."kingdom_building" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "kingdom_building_Index_itemid" ON "cokdb1"."kingdom_building" (("itemid"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_building_buff" (
  "uuid" character varying(36) COLLATE "legacy_meta"."ci" NOT NULL,
  "effect" integer NOT NULL,
  "value" double precision,
  "expiretime" bigint,
  "reserve" bigint,
  CONSTRAINT "kingdom_building_buff_PRIMARY" PRIMARY KEY ("uuid", "effect")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "kingdom_building_buff_PRIMARY_pad" ON "cokdb1"."kingdom_building_buff" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"), ("effect"));
--> statement-breakpoint
CREATE INDEX "kingdom_building_buff_Index_itemid" ON "cokdb1"."kingdom_building_buff" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_cemetery" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 9) NOT NULL,
  "cemeteryStat" integer DEFAULT 0,
  "reviveStat" integer DEFAULT 0,
  "totalContribution" integer DEFAULT 0,
  "totalDead" bigint DEFAULT 0,
  "kingBlessingTime" bigint,
  "ministerBlessingTime" bigint,
  "startReviveTime" bigint,
  "needContributionSum" integer DEFAULT 0,
  CONSTRAINT "kingdom_cemetery_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."kingdom_cemetery"."id" IS '墓地唯一编号';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."kingdom_cemetery"."cemeteryStat" IS '墓地状态全局标识';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."kingdom_cemetery"."reviveStat" IS '亡兵复活标识';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."kingdom_cemetery"."totalContribution" IS '贡献总次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."kingdom_cemetery"."totalDead" IS '亡兵总数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."kingdom_cemetery"."kingBlessingTime" IS '国王祝福最后时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."kingdom_cemetery"."ministerBlessingTime" IS '大臣祝福最后时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."kingdom_cemetery"."startReviveTime" IS '贡献值满的时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."kingdom_cemetery"."needContributionSum" IS '需要贡献次数';
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_cross_fight_history" (
  "serverId" character varying(10) COLLATE "C" NOT NULL,
  "startTime" bigint NOT NULL,
  "round" integer NOT NULL,
  "score" bigint DEFAULT 0,
  "rank" integer DEFAULT 0,
  CONSTRAINT "kingdom_cross_fight_history_PRIMARY" PRIMARY KEY ("serverId", "startTime", "round")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "kingdom_cross_fight_history_PRIMARY_pad" ON "cokdb1"."kingdom_cross_fight_history" ((rtrim("serverId", ' ') COLLATE "C"), ("startTime"), ("round"));
--> statement-breakpoint
CREATE INDEX "kingdom_cross_fight_history_kingdom_startTime" ON "cokdb1"."kingdom_cross_fight_history" ((rtrim("serverId", ' ') COLLATE "C"), ("startTime"));
--> statement-breakpoint
CREATE INDEX "kingdom_cross_fight_history_startTime" ON "cokdb1"."kingdom_cross_fight_history" (("startTime"));
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
  "ownerMiracles" text COLLATE "legacy_meta"."ci",
  "miracleOccupyCount" integer DEFAULT 0,
  "isMyThroneOccupy" smallint DEFAULT 0,
  "isOccupyOtherThrone" smallint DEFAULT 0,
  CONSTRAINT "kingdom_info_isOccupyThrone_range" CHECK ("isOccupyThrone" BETWEEN -128 AND 127),
  CONSTRAINT "kingdom_info_isMyThroneOccupy_range" CHECK ("isMyThroneOccupy" BETWEEN -128 AND 127),
  CONSTRAINT "kingdom_info_isOccupyOtherThrone_range" CHECK ("isOccupyOtherThrone" BETWEEN -128 AND 127),
  CONSTRAINT "kingdom_info_PRIMARY" PRIMARY KEY ("serverId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_position" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "positionId" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "time" bigint,
  "chNameFlag" integer,
  "preKingUid" character varying(40) COLLATE "legacy_meta"."ci",
  "relinquishEndTime" bigint,
  "currResourceType" integer,
  "chBannerFlag" integer,
  "chThronePicFlag" integer,
  "appointedTime" bigint DEFAULT 0,
  "valid" integer DEFAULT 0,
  "cemeteryBlessTime" bigint DEFAULT 0,
  "serverId" integer DEFAULT 0,
  "isSmall" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "kingdom_position_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."kingdom_position"."isSmall" IS '官职图标显示大小';
--> statement-breakpoint
CREATE UNIQUE INDEX "kingdom_position_PRIMARY_pad" ON "cokdb1"."kingdom_position" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_position_appoint" (
  "positionId" integer DEFAULT 0 NOT NULL,
  "appointTime" bigint DEFAULT 0,
  CONSTRAINT "kingdom_position_appoint_PRIMARY" PRIMARY KEY ("positionId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."kingdom_skill_log" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "skillId" integer NOT NULL,
  "logTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "kingdom_skill_log_PRIMARY" PRIMARY KEY ("uid", "skillId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "kingdom_skill_log_PRIMARY_pad" ON "cokdb1"."kingdom_skill_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("skillId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."logaction" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "user" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "timeStamp" bigint NOT NULL,
  "action" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "code" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "info" character varying(2048) COLLATE "legacy_meta"."ci" NOT NULL,
  "param" bytea,
  CONSTRAINT "logaction_param_length" CHECK (octet_length("param") <= 65535),
  CONSTRAINT "logaction_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "logaction_PRIMARY_pad" ON "cokdb1"."logaction" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "logaction_index" ON "cokdb1"."logaction" (("timeStamp"), (rtrim("user", ' ') COLLATE "legacy_meta"."ci"), (rtrim("action", ' ') COLLATE "legacy_meta"."ci"), (rtrim("code", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "logaction_index2" ON "cokdb1"."logaction" ((rtrim("user", ' ') COLLATE "legacy_meta"."ci"), ("timeStamp"), (rtrim("action", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."logrecord" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "user" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "timeStamp" bigint NOT NULL,
  "category" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "param3" integer,
  "param4" integer,
  "data1" character varying(255) COLLATE "legacy_meta"."ci",
  "data2" character varying(255) COLLATE "legacy_meta"."ci",
  "data3" character varying(255) COLLATE "legacy_meta"."ci",
  "data4" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "logrecord_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "logrecord_PRIMARY_pad" ON "cokdb1"."logrecord" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "logrecord_index" ON "cokdb1"."logrecord" (("timeStamp"), (rtrim("user", ' ') COLLATE "legacy_meta"."ci"), ("category"), ("type"));
--> statement-breakpoint
CREATE INDEX "logrecord_index_2" ON "cokdb1"."logrecord" ((rtrim("user", ' ') COLLATE "legacy_meta"."ci"), ("category"), ("type"), ("timeStamp"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."logrecord_fight" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "user" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "timeStamp" bigint NOT NULL,
  "category" integer NOT NULL,
  "type" integer,
  "param1" integer,
  "param2" integer,
  "param3" integer,
  "param4" integer,
  "data1" character varying(255) COLLATE "legacy_meta"."ci",
  "data2" character varying(255) COLLATE "legacy_meta"."ci",
  "data3" character varying(255) COLLATE "legacy_meta"."ci",
  "data4" character varying(255) COLLATE "legacy_meta"."ci",
  "data5" character varying(4086) COLLATE "legacy_meta"."ci",
  CONSTRAINT "logrecord_fight_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "logrecord_fight_PRIMARY_pad" ON "cokdb1"."logrecord_fight" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "logrecord_fight_index" ON "cokdb1"."logrecord_fight" (("timeStamp"), (rtrim("user", ' ') COLLATE "legacy_meta"."ci"), ("category"), ("type"));
--> statement-breakpoint
CREATE INDEX "logrecord_fight_index_2" ON "cokdb1"."logrecord_fight" ((rtrim("user", ' ') COLLATE "legacy_meta"."ci"), ("category"), ("type"), ("timeStamp"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."logstat" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "user" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
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
  CONSTRAINT "logstat_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "logstat_PRIMARY_pad" ON "cokdb1"."logstat" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "logstat_index" ON "cokdb1"."logstat" (("timeStamp"), (rtrim("user", ' ') COLLATE "legacy_meta"."ci"), ("type"), ("param1"), ("param2"), ("param3"));
--> statement-breakpoint
CREATE INDEX "logstat_index2" ON "cokdb1"."logstat" (("type"), ("timeStamp"), (rtrim("user", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."logtemp" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "user" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
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
  CONSTRAINT "logtemp_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "logtemp_PRIMARY_pad" ON "cokdb1"."logtemp" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "logtemp_index" ON "cokdb1"."logtemp" (("timeStamp"), (rtrim("user", ' ') COLLATE "legacy_meta"."ci"), ("type"), ("param1"), ("param2"), ("param3"));
--> statement-breakpoint
CREATE INDEX "logtemp_index2" ON "cokdb1"."logtemp" (("type"), ("timeStamp"), (rtrim("user", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."logtmp" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "user" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
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
  CONSTRAINT "logtmp_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "logtmp_PRIMARY_pad" ON "cokdb1"."logtmp" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "logtmp_index" ON "cokdb1"."logtmp" (("timeStamp"), (rtrim("user", ' ') COLLATE "legacy_meta"."ci"), ("type"), ("param1"), ("param2"), ("param3"));
--> statement-breakpoint
CREATE INDEX "logtmp_index2" ON "cokdb1"."logtmp" (("type"), ("timeStamp"), (rtrim("user", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."lottery_log" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "name" character varying(200) COLLATE "legacy_meta"."ci",
  "type" smallint,
  "superMode" smallint,
  "lotteryId" character varying(40) COLLATE "legacy_meta"."ci",
  "lotteryInfo" character varying(200) COLLATE "legacy_meta"."ci",
  "result" character varying(100) COLLATE "legacy_meta"."ci",
  "position" integer,
  "cost" integer,
  "createTime" bigint NOT NULL,
  CONSTRAINT "lottery_log_type_range" CHECK ("type" BETWEEN -128 AND 127),
  CONSTRAINT "lottery_log_superMode_range" CHECK ("superMode" BETWEEN -128 AND 127),
  CONSTRAINT "lottery_log_PRIMARY" PRIMARY KEY ("uid", "createTime")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "lottery_log_PRIMARY_pad" ON "cokdb1"."lottery_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("createTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."lottery_record" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer NOT NULL,
  "superMode" integer NOT NULL,
  "step" integer NOT NULL,
  "times1" integer NOT NULL,
  "times2" integer NOT NULL,
  "multiple" integer NOT NULL,
  "result" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "lotteryId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "lotteryInfo1" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "lotteryInfo2" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "updateTime" bigint NOT NULL,
  "times3" integer DEFAULT 0,
  "times4" integer DEFAULT 0,
  "boxTimes" integer DEFAULT 0,
  CONSTRAINT "lottery_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "lottery_record_PRIMARY_pad" ON "cokdb1"."lottery_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."luck_draw_history" (
  "gameUid" character varying(255) COLLATE "legacy_meta"."ci",
  "roleName" character varying(40) COLLATE "legacy_meta"."ci",
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci",
  "allianceName" character varying(40) COLLATE "legacy_meta"."ci",
  "type" integer,
  "itemId" character varying(255) COLLATE "legacy_meta"."ci",
  "time" bigint
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."lucky_bag" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "openFreetimes" integer DEFAULT 0,
  "flushTimes" integer DEFAULT 0,
  "nextOpenTime" integer DEFAULT 0,
  "multiple" integer DEFAULT 1,
  "score" integer DEFAULT 0,
  "scoreReward" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "lucky_bag_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "lucky_bag_PRIMARY_pad" ON "cokdb1"."lucky_bag" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."lucky_day" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "unluckyCount" integer DEFAULT 0,
  "status" integer DEFAULT 0,
  "time" bigint,
  "effectId" character varying(40) COLLATE "legacy_meta"."ci",
  "luckyCount" integer,
  "lucky_id" integer,
  CONSTRAINT "lucky_day_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "lucky_day_PRIMARY_pad" ON "cokdb1"."lucky_day" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "toUser" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "fromUser" character varying(40) COLLATE "legacy_meta"."ci",
  "fromName" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '',
  "title" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "contents" bytea NOT NULL,
  "rewardId" text COLLATE "legacy_meta"."ci",
  "itemIdFlag" integer DEFAULT 0,
  "status" integer DEFAULT 0,
  "type" integer DEFAULT 1 NOT NULL,
  "rewardStatus" integer DEFAULT 0 NOT NULL,
  "saveFlag" integer DEFAULT 0,
  "createTime" bigint NOT NULL,
  "reply" integer DEFAULT 0 NOT NULL,
  "translationId" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "mail_contents_length" CHECK (octet_length("contents") <= 65535),
  CONSTRAINT "mail_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "mail_PRIMARY_pad" ON "cokdb1"."mail" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "mail_index_toFrom" ON "cokdb1"."mail" ((rtrim("toUser", ' ') COLLATE "legacy_meta"."ci"), ("type"), (rtrim("fromUser", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "mail_index_toUserTime" ON "cokdb1"."mail" ((rtrim("toUser", ' ') COLLATE "legacy_meta"."ci"), ("createTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail_20150212" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "toUser" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "fromUser" character varying(40) COLLATE "legacy_meta"."ci",
  "fromName" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "title" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "contents" bytea NOT NULL,
  "rewardId" bytea,
  "itemIdFlag" integer DEFAULT 0,
  "status" integer DEFAULT 0,
  "type" integer DEFAULT 1 NOT NULL,
  "rewardStatus" integer DEFAULT 0 NOT NULL,
  "saveFlag" integer DEFAULT 0,
  "createTime" bigint NOT NULL,
  "reply" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "mail_20150212_contents_length" CHECK (octet_length("contents") <= 65535),
  CONSTRAINT "mail_20150212_rewardId_length" CHECK (octet_length("rewardId") <= 65535),
  CONSTRAINT "mail_20150212_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "mail_20150212_PRIMARY_pad" ON "cokdb1"."mail_20150212" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "mail_20150212_index_toFrom" ON "cokdb1"."mail_20150212" ((rtrim("toUser", ' ') COLLATE "legacy_meta"."ci"), ("type"), (rtrim("fromUser", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "mail_20150212_index_toUserTime" ON "cokdb1"."mail_20150212" ((rtrim("toUser", ' ') COLLATE "legacy_meta"."ci"), ("createTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail_contents" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "contents" bytea NOT NULL,
  "toUser" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '',
  CONSTRAINT "mail_contents_contents_length" CHECK (octet_length("contents") <= 16777215),
  CONSTRAINT "mail_contents_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "mail_contents_PRIMARY_pad" ON "cokdb1"."mail_contents" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "mail_contents_user_idx" ON "cokdb1"."mail_contents" ((rtrim("toUser", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail_contents_1016" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "title" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "contents" bytea NOT NULL,
  "rewardId" bytea,
  "itemIdFlag" integer DEFAULT 0,
  "createTime" bigint NOT NULL,
  CONSTRAINT "mail_contents_1016_contents_length" CHECK (octet_length("contents") <= 65535),
  CONSTRAINT "mail_contents_1016_rewardId_length" CHECK (octet_length("rewardId") <= 65535),
  CONSTRAINT "mail_contents_1016_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "mail_contents_1016_PRIMARY_pad" ON "cokdb1"."mail_contents_1016" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail_contents_20141030" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "title" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "contents" bytea NOT NULL,
  "rewardId" bytea,
  "itemIdFlag" integer DEFAULT 0,
  "createTime" bigint NOT NULL,
  CONSTRAINT "mail_contents_20141030_contents_length" CHECK (octet_length("contents") <= 65535),
  CONSTRAINT "mail_contents_20141030_rewardId_length" CHECK (octet_length("rewardId") <= 65535),
  CONSTRAINT "mail_contents_20141030_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "mail_contents_20141030_PRIMARY_pad" ON "cokdb1"."mail_contents_20141030" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail_group" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "groupType" integer DEFAULT 1 NOT NULL,
  "groupIndex" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "updateTime" bigint NOT NULL,
  CONSTRAINT "mail_group_PRIMARY" PRIMARY KEY ("uid", "groupType", "groupIndex")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "mail_group_PRIMARY_pad" ON "cokdb1"."mail_group" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("groupType"), (rtrim("groupIndex", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail_group_20150212" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "groupType" integer DEFAULT 1 NOT NULL,
  "groupIndex" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "updateTime" bigint NOT NULL,
  CONSTRAINT "mail_group_20150212_PRIMARY" PRIMARY KEY ("uid", "groupType", "groupIndex")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "mail_group_20150212_PRIMARY_pad" ON "cokdb1"."mail_group_20150212" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("groupType"), (rtrim("groupIndex", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."mail_reward_log" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "mailId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer,
  "createTime" bigint NOT NULL,
  "status" smallint,
  CONSTRAINT "mail_reward_log_status_range" CHECK ("status" BETWEEN -128 AND 127),
  CONSTRAINT "mail_reward_log_PRIMARY" PRIMARY KEY ("uid", "mailId", "createTime")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "mail_reward_log_PRIMARY_pad" ON "cokdb1"."mail_reward_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("mailId", ' ') COLLATE "legacy_meta"."ci"), ("createTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."marketing_log" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "network" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "time" bigint,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "marketing_log_PRIMARY" PRIMARY KEY ("uid", "id", "network")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "marketing_log_PRIMARY_pad" ON "cokdb1"."marketing_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"), (rtrim("network", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."material_control" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "time" bigint DEFAULT 0,
  CONSTRAINT "material_control_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "material_control_PRIMARY_pad" ON "cokdb1"."material_control" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."material_cost_ranking" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "contributeSum" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "material_cost_ranking_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "material_cost_ranking_PRIMARY_pad" ON "cokdb1"."material_cost_ranking" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."material_cost_record" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer NOT NULL,
  "param1" integer,
  "param2" integer,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  "time" bigint NOT NULL,
  CONSTRAINT "material_cost_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "material_cost_record_PRIMARY_pad" ON "cokdb1"."material_cost_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "material_cost_record_index_user" ON "cokdb1"."material_cost_record" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE INDEX "material_cost_record_index_type" ON "cokdb1"."material_cost_record" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."menu" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "module_id" integer,
  "name" character varying(50) COLLATE "legacy_meta"."ci",
  "pinyin" character varying(200) COLLATE "legacy_meta"."ci",
  "path" character varying(200) COLLATE "legacy_meta"."ci",
  "type" character varying(10) COLLATE "legacy_meta"."ci",
  "p_id" integer,
  "comments" character varying(100) COLLATE "legacy_meta"."ci",
  "is_prod" smallint,
  "is_log" smallint,
  "order_num" character varying(9) COLLATE "legacy_meta"."ci",
  CONSTRAINT "menu_is_prod_range" CHECK ("is_prod" BETWEEN -128 AND 127),
  CONSTRAINT "menu_is_log_range" CHECK ("is_log" BETWEEN -128 AND 127),
  CONSTRAINT "menu_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."methods" (
  "method_id" integer NOT NULL,
  "route_id" integer,
  "method_name" character varying(50) COLLATE "legacy_meta"."ci",
  "method_path" character varying(50) COLLATE "legacy_meta"."ci",
  CONSTRAINT "methods_PRIMARY" PRIMARY KEY ("method_id")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."methods"."route_id" IS '所属路由Id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."methods"."method_name" IS '方法名称';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."methods"."method_path" IS '方法标识';
--> statement-breakpoint
CREATE TABLE "cokdb1"."military_cost_record" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer NOT NULL,
  "param1" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "param2" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  "time" bigint NOT NULL,
  CONSTRAINT "military_cost_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "military_cost_record_PRIMARY_pad" ON "cokdb1"."military_cost_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "military_cost_record_index_user" ON "cokdb1"."military_cost_record" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE INDEX "military_cost_record_index_type" ON "cokdb1"."military_cost_record" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."mod_authorize" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "authorize" integer DEFAULT 1,
  CONSTRAINT "mod_authorize_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "mod_authorize_PRIMARY_pad" ON "cokdb1"."mod_authorize" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."mod_record" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "fromUser" character varying(255) COLLATE "C",
  "toUser" character varying(255) COLLATE "C",
  "mailType" integer,
  "createTime" bigint,
  CONSTRAINT "mod_record_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE INDEX "mod_record_from_idx" ON "cokdb1"."mod_record" ((rtrim("fromUser", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "mod_record_to_idx" ON "cokdb1"."mod_record" ((rtrim("toUser", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "mod_record_time_Idx" ON "cokdb1"."mod_record" (("createTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."modules" (
  "module_id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "module_name" character varying(50) COLLATE "legacy_meta"."ci",
  "module_flag" character varying(50) COLLATE "legacy_meta"."ci",
  "app_id" character varying(32) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "group_name" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  CONSTRAINT "modules_PRIMARY" PRIMARY KEY ("module_id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."monitor_test" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "value" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "monitor_test_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."monster_everyday_refresh" (
  "monster_id" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "monster_num" integer,
  "refreshtime" bigint,
  CONSTRAINT "monster_everyday_refresh_PRIMARY" PRIMARY KEY ("monster_id")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."monster_everyday_refresh"."monster_id" IS '唯一ID，静态表的id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."monster_everyday_refresh"."monster_num" IS '每天可以刷新的数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."monster_everyday_refresh"."refreshtime" IS '刷新的时间';
--> statement-breakpoint
CREATE UNIQUE INDEX "monster_everyday_refresh_PRIMARY_pad" ON "cokdb1"."monster_everyday_refresh" ((rtrim("monster_id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."monster_siege" (
  "allianceId" character varying(40) COLLATE "C" NOT NULL,
  "monsterCastleId" integer DEFAULT 0,
  "startTime" bigint DEFAULT 0,
  "endTime" bigint DEFAULT 0,
  "state" integer DEFAULT 0 NOT NULL,
  "currPhase" integer DEFAULT 0,
  "currRoundIndex" integer DEFAULT 0,
  "currRoundStartTime" bigint DEFAULT 0,
  "currmemberUidListInfo" character varying(4000) COLLATE "C",
  "memberUidListInfo" character varying(4000) COLLATE "C",
  "allianceKillCount" bigint DEFAULT 0,
  "currMonsterInfo" character varying(4000) COLLATE "C",
  "monsterCastleIds" character varying(400) COLLATE "C",
  "monsterPerRoundNum" character varying(500) COLLATE "legacy_meta"."ci",
  CONSTRAINT "monster_siege_PRIMARY" PRIMARY KEY ("allianceId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "monster_siege_PRIMARY_pad" ON "cokdb1"."monster_siege" ((rtrim("allianceId", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."monster_siege_top_history" (
  "allianceId" character varying(40) COLLATE "C" NOT NULL,
  "time" bigint NOT NULL,
  "allianceAbbr" character varying(40) COLLATE "C" NOT NULL,
  "allianceName" character varying(40) COLLATE "C" NOT NULL,
  "rank" integer NOT NULL,
  "killCount" bigint DEFAULT 0,
  "siegeRound" integer DEFAULT 0,
  "validMemberCount" integer DEFAULT 0,
  "allianceCount" integer DEFAULT 0,
  "activityAllianceCount" integer DEFAULT 0,
  "activity30AllianceCount" integer DEFAULT 0,
  "activity40AllianceCount" integer DEFAULT 0,
  "activity50AllianceCount" integer DEFAULT 0,
  "monsterPerRoundNum" character varying(500) COLLATE "legacy_meta"."ci",
  CONSTRAINT "monster_siege_top_history_PRIMARY" PRIMARY KEY ("allianceId", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "monster_siege_top_history_PRIMARY_pad" ON "cokdb1"."monster_siege_top_history" ((rtrim("allianceId", ' ') COLLATE "C"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."monthly_card" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "accept" integer DEFAULT 0,
  "time" bigint DEFAULT 0,
  "available" integer DEFAULT 0,
  "buyTime" bigint DEFAULT 0,
  "optionId" integer,
  CONSTRAINT "monthly_card_PRIMARY" PRIMARY KEY ("uid", "itemId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "monthly_card_PRIMARY_pad" ON "cokdb1"."monthly_card" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_city_log" (
  "pointId" integer NOT NULL,
  "time" bigint NOT NULL,
  "x" integer,
  "y" integer,
  "count" integer,
  "uids" character varying(1000) COLLATE "legacy_meta"."ci",
  CONSTRAINT "move_city_log_PRIMARY" PRIMARY KEY ("pointId", "time")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_city_time" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint DEFAULT 0,
  CONSTRAINT "move_city_time_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_city_time_PRIMARY_pad" ON "cokdb1"."move_city_time" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_PRIMARY_pad" ON "cokdb1"."move_server_record" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_0" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_0_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_0_PRIMARY_pad" ON "cokdb1"."move_server_record_2024_0" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_1" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_1_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_1_PRIMARY_pad" ON "cokdb1"."move_server_record_2024_1" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_10" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_10_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_10_PRIMARY_pad" ON "cokdb1"."move_server_record_2024_10" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_11" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_11_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_11_PRIMARY_pad" ON "cokdb1"."move_server_record_2024_11" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_2" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_2_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_2_PRIMARY_pad" ON "cokdb1"."move_server_record_2024_2" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_3" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_3_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_3_PRIMARY_pad" ON "cokdb1"."move_server_record_2024_3" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_4" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_4_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_4_PRIMARY_pad" ON "cokdb1"."move_server_record_2024_4" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_5" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_5_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_5_PRIMARY_pad" ON "cokdb1"."move_server_record_2024_5" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_6" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_6_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_6_PRIMARY_pad" ON "cokdb1"."move_server_record_2024_6" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_7" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_7_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_7_PRIMARY_pad" ON "cokdb1"."move_server_record_2024_7" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_8" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_8_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_8_PRIMARY_pad" ON "cokdb1"."move_server_record_2024_8" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_server_record_2024_9" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "src" integer NOT NULL,
  "dst" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "move_server_record_2024_9_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_server_record_2024_9_PRIMARY_pad" ON "cokdb1"."move_server_record_2024_9" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."move_total" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "total" integer DEFAULT 0,
  CONSTRAINT "move_total_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "move_total_PRIMARY_pad" ON "cokdb1"."move_total" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
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
  CONSTRAINT "neutral_server_info_open_range" CHECK ("open" BETWEEN -128 AND 127),
  CONSTRAINT "neutral_server_info_PRIMARY" PRIMARY KEY ("serverId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."new_exped_history" (
  "stageId" integer DEFAULT 0,
  "winServerId" integer DEFAULT 0,
  "loseServerId" integer DEFAULT 0,
  "users" character varying(1500) COLLATE "legacy_meta"."ci" DEFAULT '',
  "createTime" bigint DEFAULT 0
);
--> statement-breakpoint
CREATE INDEX "new_exped_history_winServerId_index" ON "cokdb1"."new_exped_history" (("winServerId"));
--> statement-breakpoint
CREATE INDEX "new_exped_history_loseServerId_index" ON "cokdb1"."new_exped_history" (("loseServerId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."new_general" (
  "id" integer DEFAULT 0 NOT NULL,
  "uid" character varying(96) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "exp" integer,
  "level" integer,
  "quality" integer,
  "talentpoint" integer,
  "state" smallint,
  "predatoruid" character varying(96) COLLATE "legacy_meta"."ci",
  "relivetime" bigint,
  "buildingUuid" character varying(96) COLLATE "legacy_meta"."ci",
  "skillInfo" character varying(6000) COLLATE "legacy_meta"."ci",
  "createtime" bigint,
  "talent" character varying(5000) COLLATE "legacy_meta"."ci",
  "serverid" integer,
  "robtime" bigint,
  "killtime" bigint,
  "gethomttime" bigint,
  "optime" character varying(200) COLLATE "legacy_meta"."ci",
  "refineproperty" character varying(300) COLLATE "legacy_meta"."ci",
  "oldrefineproperty" character varying(300) COLLATE "legacy_meta"."ci",
  "refinegold" integer,
  "refinecard" integer,
  "refinecount" integer,
  "lockproperty" character varying(60) COLLATE "legacy_meta"."ci",
  "refreshproperty" character varying(300) COLLATE "legacy_meta"."ci",
  "breach" character varying(128) COLLATE "legacy_meta"."ci",
  "star" integer DEFAULT 1,
  "baseSkill" character varying(256) COLLATE "legacy_meta"."ci",
  CONSTRAINT "new_general_PRIMARY" PRIMARY KEY ("id", "uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "new_general_PRIMARY_pad" ON "cokdb1"."new_general" (("id"), (rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "new_general_predatoruid_index" ON "cokdb1"."new_general" ((rtrim("predatoruid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "new_general_uid" ON "cokdb1"."new_general" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."new_general_buy" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "generalId" integer NOT NULL,
  "countType1" integer DEFAULT 0 NOT NULL,
  "countType2" integer DEFAULT 0 NOT NULL,
  "countType3" integer DEFAULT 0 NOT NULL,
  "countType4" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "new_general_buy_PRIMARY" PRIMARY KEY ("uid", "generalId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "new_general_buy_PRIMARY_pad" ON "cokdb1"."new_general_buy" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("generalId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."new_general_skill" (
  "uid" character varying(96) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "newGeneralId" integer DEFAULT 0 NOT NULL,
  "skillId" character varying(60) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "startTime" bigint,
  "actTime" bigint,
  "endTime" bigint,
  "stat" integer,
  CONSTRAINT "new_general_skill_PRIMARY" PRIMARY KEY ("uid", "newGeneralId", "skillId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "new_general_skill_PRIMARY_pad" ON "cokdb1"."new_general_skill" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("newGeneralId"), (rtrim("skillId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."new_general_status" (
  "uid" character varying(96) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "newGeneralId" integer DEFAULT 0 NOT NULL,
  "stateId" integer DEFAULT 0 NOT NULL,
  "startTime" bigint,
  "endTime" bigint,
  CONSTRAINT "new_general_status_PRIMARY" PRIMARY KEY ("uid", "newGeneralId", "stateId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "new_general_status_PRIMARY_pad" ON "cokdb1"."new_general_status" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("newGeneralId"), ("stateId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."new_sercum_recharge" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "id" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  CONSTRAINT "new_sercum_recharge_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "new_sercum_recharge_PRIMARY_pad" ON "cokdb1"."new_sercum_recharge" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."new_user_score" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci",
  "score" double precision NOT NULL,
  "takeReward" character varying(500) COLLATE "legacy_meta"."ci",
  "rankingrewardstage" character varying(300) COLLATE "legacy_meta"."ci" DEFAULT '',
  "kingdomrewardstage" character varying(300) COLLATE "legacy_meta"."ci" DEFAULT '',
  "stage" integer DEFAULT 0,
  CONSTRAINT "new_user_score_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "new_user_score_PRIMARY_pad" ON "cokdb1"."new_user_score" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "new_user_score_uid_idx" ON "cokdb1"."new_user_score" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "new_user_score_uid_stage_index" ON "cokdb1"."new_user_score" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("stage"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."notice_cost_log" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" smallint,
  "itemId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "cost" integer,
  "createTime" bigint NOT NULL,
  CONSTRAINT "notice_cost_log_type_range" CHECK ("type" BETWEEN -128 AND 127),
  CONSTRAINT "notice_cost_log_PRIMARY" PRIMARY KEY ("uid", "itemId", "createTime")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "notice_cost_log_PRIMARY_pad" ON "cokdb1"."notice_cost_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"), ("createTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."npc_trade" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "trade" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint DEFAULT 0,
  "num" integer DEFAULT 0,
  "superValue" integer DEFAULT 0,
  CONSTRAINT "npc_trade_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "npc_trade_PRIMARY_pad" ON "cokdb1"."npc_trade" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."ob_record" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceIds" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "begin" bigint DEFAULT 0 NOT NULL,
  "serverId" integer DEFAULT 0 NOT NULL,
  "areaId" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "ob_record_PRIMARY" PRIMARY KEY ("uid", "allianceIds")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "ob_record_PRIMARY_pad" ON "cokdb1"."ob_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("allianceIds", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "ob_record_uid" ON "cokdb1"."ob_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("serverId"), ("areaId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."ob_report" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "worldId" integer NOT NULL,
  "content" bytea,
  "createTime" bigint,
  CONSTRAINT "ob_report_content_length" CHECK (octet_length("content") <= 65535),
  CONSTRAINT "ob_report_PRIMARY" PRIMARY KEY ("id", "worldId")
);
--> statement-breakpoint
CREATE INDEX "ob_report_createTime" ON "cokdb1"."ob_report" (("createTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."ob_user" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "worldId" integer,
  "param1" character varying(200) COLLATE "legacy_meta"."ci",
  "createTime" bigint,
  CONSTRAINT "ob_user_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "ob_user_PRIMARY_pad" ON "cokdb1"."ob_user" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."oldmailinsert" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer DEFAULT 1 NOT NULL,
  CONSTRAINT "oldmailinsert_PRIMARY" PRIMARY KEY ("uid", "type")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "oldmailinsert_PRIMARY_pad" ON "cokdb1"."oldmailinsert" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."parse_info" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer NOT NULL,
  "status" integer NOT NULL,
  "audio" integer DEFAULT 1 NOT NULL,
  CONSTRAINT "parse_info_PRIMARY" PRIMARY KEY ("uid", "type")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "parse_info_PRIMARY_pad" ON "cokdb1"."parse_info" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."pay_action" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "exchangeId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "createTime" bigint NOT NULL,
  CONSTRAINT "pay_action_PRIMARY" PRIMARY KEY ("uid", "exchangeId", "createTime")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "pay_action_PRIMARY_pad" ON "cokdb1"."pay_action" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("exchangeId", ' ') COLLATE "legacy_meta"."ci"), ("createTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."pay_order_count" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "className" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action" integer DEFAULT 0,
  "time" bigint DEFAULT 0,
  CONSTRAINT "pay_order_count_PRIMARY" PRIMARY KEY ("uid", "className")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "pay_order_count_PRIMARY_pad" ON "cokdb1"."pay_order_count" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("className", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."pay_order_count_log" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "className" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "action" integer DEFAULT 0,
  "time" bigint DEFAULT 0
);
--> statement-breakpoint
CREATE INDEX "pay_order_count_log_index_time" ON "cokdb1"."pay_order_count_log" (("time"));
--> statement-breakpoint
CREATE INDEX "pay_order_count_log_index_uid_class" ON "cokdb1"."pay_order_count_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("className", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."pay_request" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "optionId" integer,
  "purchaseId" character varying(10) COLLATE "legacy_meta"."ci" DEFAULT '',
  "productId" character varying(10) COLLATE "legacy_meta"."ci" DEFAULT '',
  "status" integer DEFAULT 0,
  "finishTime" bigint DEFAULT 0,
  CONSTRAINT "pay_request_PRIMARY" PRIMARY KEY ("uid", "pf", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "pay_request_PRIMARY_pad" ON "cokdb1"."pay_request" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "pay_request_index_uid_pf_purchaseId" ON "cokdb1"."pay_request" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"), (rtrim("purchaseId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "pay_request_index_uid_pf_productId" ON "cokdb1"."pay_request" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"), (rtrim("productId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."pay_total" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "gold" bigint,
  "updateTime" bigint,
  "type" integer DEFAULT 1 NOT NULL,
  "getLv" integer DEFAULT 0,
  CONSTRAINT "pay_total_PRIMARY" PRIMARY KEY ("uid", "type")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "pay_total_PRIMARY_pad" ON "cokdb1"."pay_total" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."pay_total_log" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer NOT NULL,
  "gold" bigint,
  "createTime" bigint NOT NULL,
  "type" integer DEFAULT 1 NOT NULL,
  CONSTRAINT "pay_total_log_PRIMARY" PRIMARY KEY ("uid", "level", "createTime", "type")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "pay_total_log_PRIMARY_pad" ON "cokdb1"."pay_total_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("level"), ("createTime"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."paycheck" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "orderId" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint,
  "status" character varying(20) COLLATE "legacy_meta"."ci",
  "apidata" bytea,
  CONSTRAINT "paycheck_apidata_length" CHECK (octet_length("apidata") <= 65535),
  CONSTRAINT "paycheck_PRIMARY" PRIMARY KEY ("uid", "orderId", "pf")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "paycheck_PRIMARY_pad" ON "cokdb1"."paycheck" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("orderId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "paycheck_index_time_status" ON "cokdb1"."paycheck" (("time"), (rtrim("status", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."paylog" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "orderId" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "productId" character varying(10) COLLATE "legacy_meta"."ci" DEFAULT '0' NOT NULL,
  "orderInfo" character varying(200) COLLATE "legacy_meta"."ci",
  "orderParam" bytea,
  "comments" character varying(100) COLLATE "legacy_meta"."ci",
  "time" bigint,
  "currency" integer DEFAULT 0,
  "spend" numeric(10,2) DEFAULT 0.00 NOT NULL,
  "paid" numeric(10,2) DEFAULT 0.00,
  "status" integer DEFAULT 0,
  "payLevel" integer NOT NULL,
  "buildingLv" integer DEFAULT 0,
  "receiverId" character varying(40) COLLATE "legacy_meta"."ci",
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "ip" character varying(20) COLLATE "legacy_meta"."ci" DEFAULT '',
  "curGaid" character varying(40) COLLATE "legacy_meta"."ci",
  "truelyIp" character varying(20) COLLATE "legacy_meta"."ci",
  "optionId" character varying(100) COLLATE "legacy_meta"."ci",
  CONSTRAINT "paylog_orderParam_length" CHECK (octet_length("orderParam") <= 65535),
  CONSTRAINT "paylog_PRIMARY" PRIMARY KEY ("uid", "orderId", "pf")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."paylog"."optionId" IS '可选礼包';
--> statement-breakpoint
CREATE UNIQUE INDEX "paylog_PRIMARY_pad" ON "cokdb1"."paylog" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("orderId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "paylog_index_time_pf" ON "cokdb1"."paylog" (("time"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."paylog_back" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "orderId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "productId" character varying(10) COLLATE "legacy_meta"."ci" DEFAULT '0' NOT NULL,
  "time" bigint,
  "currency" integer DEFAULT 0,
  "spend" numeric(10,0) DEFAULT 0 NOT NULL,
  "status" integer DEFAULT 0,
  "payLevel" integer NOT NULL,
  CONSTRAINT "paylog_back_PRIMARY" PRIMARY KEY ("uid", "orderId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "paylog_back_PRIMARY_pad" ON "cokdb1"."paylog_back" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("orderId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."personal_data" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "value" text COLLATE "legacy_meta"."ci",
  CONSTRAINT "personal_data_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "personal_data_PRIMARY_pad" ON "cokdb1"."personal_data" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."pic_upload_record" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "picVer" integer DEFAULT 0,
  "updateTime" bigint DEFAULT 9223372036854775807,
  "report" integer DEFAULT 0,
  "banCount" integer DEFAULT 0,
  "banTime" bigint DEFAULT 0,
  "stat" integer DEFAULT 0,
  CONSTRAINT "pic_upload_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "pic_upload_record_PRIMARY_pad" ON "cokdb1"."pic_upload_record" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "pic_upload_record_time_idx" ON "cokdb1"."pic_upload_record" (("updateTime"));
--> statement-breakpoint
CREATE INDEX "pic_upload_record_report_idx" ON "cokdb1"."pic_upload_record" (("report"));
--> statement-breakpoint
CREATE INDEX "pic_upload_record_stat_idx" ON "cokdb1"."pic_upload_record" (("stat"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."platform_first_login_reward" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "hasReward" integer DEFAULT 0 NOT NULL,
  "pf" character varying(40) COLLATE "legacy_meta"."ci",
  "rewardTime" bigint,
  CONSTRAINT "platform_first_login_reward_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."platform_first_login_reward"."pf" IS '领取时的平台';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."platform_first_login_reward"."rewardTime" IS '领取时间';
--> statement-breakpoint
CREATE UNIQUE INDEX "platform_first_login_reward_PRIMARY_pad" ON "cokdb1"."platform_first_login_reward" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."play_evolutions" (
  "id" integer NOT NULL,
  "hash" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "applied_at" text DEFAULT legacy_meta.utc_now(0) NOT NULL,
  "apply_script" text COLLATE "legacy_meta"."ci",
  "revert_script" text COLLATE "legacy_meta"."ci",
  "state" character varying(255) COLLATE "legacy_meta"."ci",
  "last_problem" text COLLATE "legacy_meta"."ci",
  CONSTRAINT "play_evolutions_applied_at_temporal" CHECK (legacy_meta.valid_temporal("applied_at", 'timestamp', 0)),
  CONSTRAINT "play_evolutions_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TRIGGER a_reset BEFORE UPDATE ON "cokdb1"."play_evolutions" FOR EACH ROW EXECUTE FUNCTION legacy_meta.reset_explicit_timestamp();
--> statement-breakpoint
CREATE TRIGGER b_explicit BEFORE UPDATE OF "applied_at" ON "cokdb1"."play_evolutions" FOR EACH ROW EXECUTE FUNCTION legacy_meta.mark_explicit_timestamp();
--> statement-breakpoint
CREATE FUNCTION legacy_meta."ts_9979bbc04a3e535b92ab"() RETURNS trigger LANGUAGE plpgsql AS $body$
BEGIN
  IF NEW."applied_at" IS NULL OR (TG_OP='UPDATE' AND current_setting('legacy_meta.explicit_timestamp',true)='off' AND (to_jsonb(NEW)-'applied_at') IS DISTINCT FROM (to_jsonb(OLD)-'applied_at')) THEN
    NEW."applied_at" := legacy_meta.utc_now(0);
  END IF;
  RETURN NEW;
END $body$;
--> statement-breakpoint
CREATE TRIGGER c_ts_9979bbc04a3e535b92ab BEFORE INSERT OR UPDATE ON "cokdb1"."play_evolutions" FOR EACH ROW EXECUTE FUNCTION legacy_meta."ts_9979bbc04a3e535b92ab"();
--> statement-breakpoint
CREATE TABLE "cokdb1"."player" (
  "id" character varying(8) COLLATE "legacy_meta"."ci" NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  CONSTRAINT "player_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "player_PRIMARY_pad" ON "cokdb1"."player" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."player_percents_save" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "footEffect" real DEFAULT 0 NOT NULL,
  "rideEffect" real DEFAULT 0 NOT NULL,
  "bowEffect" real DEFAULT 0 NOT NULL,
  "carEffect" real DEFAULT 0 NOT NULL,
  CONSTRAINT "player_percents_save_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "player_percents_save_PRIMARY_pad" ON "cokdb1"."player_percents_save" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."playerinfo" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
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
  "is_reward" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT 'N' NOT NULL,
  CONSTRAINT "playerinfo_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "playerinfo_PRIMARY_pad" ON "cokdb1"."playerinfo" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "playerinfo_power_index" ON "cokdb1"."playerinfo" (("power"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."point_minifort" (
  "pointId" integer NOT NULL,
  "fortPointId" integer NOT NULL,
  CONSTRAINT "point_minifort_PRIMARY" PRIMARY KEY ("pointId", "fortPointId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."post_box" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "from" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "name" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "publicValue" integer,
  "contents" bytea NOT NULL,
  "seal" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '',
  "time" bigint NOT NULL,
  CONSTRAINT "post_box_contents_length" CHECK (octet_length("contents") <= 65535),
  CONSTRAINT "post_box_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "post_box_PRIMARY_pad" ON "cokdb1"."post_box" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "post_box_index_from" ON "cokdb1"."post_box" ((rtrim("from", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "post_box_index_time" ON "cokdb1"."post_box" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."post_mail" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "boxId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "toUser" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "fromUser" character varying(40) COLLATE "legacy_meta"."ci",
  "fromName" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "contents" bytea NOT NULL,
  "seal" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '',
  "createTime" bigint NOT NULL,
  CONSTRAINT "post_mail_contents_length" CHECK (octet_length("contents") <= 65535),
  CONSTRAINT "post_mail_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "post_mail_PRIMARY_pad" ON "cokdb1"."post_mail" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "post_mail_index_toUserTime" ON "cokdb1"."post_mail" ((rtrim("toUser", ' ') COLLATE "legacy_meta"."ci"), ("createTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."post_relation" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "publicValue" character varying(600) COLLATE "legacy_meta"."ci",
  "time" bigint NOT NULL,
  "players" character varying(600) COLLATE "legacy_meta"."ci",
  CONSTRAINT "post_relation_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "post_relation_PRIMARY_pad" ON "cokdb1"."post_relation" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "post_relation_index_time" ON "cokdb1"."post_relation" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."pray_record" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 44571) NOT NULL,
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "cost" integer DEFAULT 0 NOT NULL,
  "resource" character varying(20) COLLATE "C" NOT NULL,
  "num" integer NOT NULL,
  "hit" integer DEFAULT 0,
  "prayTime" bigint,
  CONSTRAINT "pray_record_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE INDEX "pray_record_uid_idx" ON "cokdb1"."pray_record" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "pray_record_resource_idx" ON "cokdb1"."pray_record" ((rtrim("resource", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "pray_record_time_idx" ON "cokdb1"."pray_record" (("prayTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."princess_task" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "sub" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 1 NOT NULL,
  "time" bigint DEFAULT 0,
  "completeTime" bigint DEFAULT 0,
  "pop" integer DEFAULT 0,
  CONSTRAINT "princess_task_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "princess_task_PRIMARY_pad" ON "cokdb1"."princess_task" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."princess_task_record" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "refreshNum" integer DEFAULT 0,
  "refreshTime" bigint DEFAULT 0,
  "completeNum" integer DEFAULT 0,
  "completeTime" bigint DEFAULT 0,
  CONSTRAINT "princess_task_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "princess_task_record_PRIMARY_pad" ON "cokdb1"."princess_task_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."princess_task_stat" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "taskId" integer NOT NULL,
  "taskType" integer NOT NULL,
  "acceptTime" bigint NOT NULL,
  "state" integer NOT NULL,
  "param1" bigint NOT NULL,
  CONSTRAINT "princess_task_stat_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "princess_task_stat_PRIMARY_pad" ON "cokdb1"."princess_task_stat" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "princess_task_stat_index_type" ON "cokdb1"."princess_task_stat" (("state"), ("taskType"));
--> statement-breakpoint
CREATE INDEX "princess_task_stat_index_param" ON "cokdb1"."princess_task_stat" (("state"), ("param1"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."promotion_log" (
  "channel" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "statId" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "exchangeId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "adId" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '',
  "deviceType" integer DEFAULT 0,
  "showTime" bigint,
  "buyTime" bigint,
  "state" integer DEFAULT 0,
  "deviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "accountid" character varying(50) COLLATE "legacy_meta"."ci",
  "campaignid" character varying(50) COLLATE "legacy_meta"."ci",
  "adgroupid" character varying(50) COLLATE "legacy_meta"."ci",
  "creativeid" character varying(50) COLLATE "legacy_meta"."ci",
  "location" character varying(50) COLLATE "legacy_meta"."ci",
  CONSTRAINT "promotion_log_PRIMARY" PRIMARY KEY ("channel", "statId", "exchangeId", "uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "promotion_log_PRIMARY_pad" ON "cokdb1"."promotion_log" ((rtrim("channel", ' ') COLLATE "legacy_meta"."ci"), (rtrim("statId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("exchangeId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."protect_total" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "total" integer DEFAULT 0,
  CONSTRAINT "protect_total_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "protect_total_PRIMARY_pad" ON "cokdb1"."protect_total" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."push_log" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL,
  "message" character varying(100) COLLATE "legacy_meta"."ci",
  "status" integer,
  CONSTRAINT "push_log_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "push_log_PRIMARY_pad" ON "cokdb1"."push_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."push_record" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "type" character varying(10) COLLATE "legacy_meta"."ci" DEFAULT '0',
  "msg" bytea,
  "status" integer DEFAULT 0,
  CONSTRAINT "push_record_msg_length" CHECK (octet_length("msg") <= 65535),
  CONSTRAINT "push_record_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "push_record_PRIMARY_pad" ON "cokdb1"."push_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "push_record_index_type" ON "cokdb1"."push_record" ((rtrim("type", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."question_match" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "result" character varying(40) COLLATE "legacy_meta"."ci",
  "startBetTime" bigint,
  "startTime" bigint,
  "ended" integer,
  "betNum" bigint,
  CONSTRAINT "question_match_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "question_match_PRIMARY_pad" ON "cokdb1"."question_match" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."queue" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "ownerId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "qid" integer NOT NULL,
  "type" integer NOT NULL,
  "itemId" character varying(255) COLLATE "legacy_meta"."ci",
  "startTime" bigint,
  "endTime" bigint NOT NULL,
  "updateTime" bigint NOT NULL,
  "isHelped" integer,
  "para" integer DEFAULT 0,
  "totalTime" bigint DEFAULT 0,
  "exchgType" smallint DEFAULT 0,
  CONSTRAINT "queue_exchgType_range" CHECK ("exchgType" BETWEEN -128 AND 127),
  CONSTRAINT "queue_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."queue"."exchgType" IS '以物易物活动计数类型';
--> statement-breakpoint
CREATE UNIQUE INDEX "queue_PRIMARY_pad" ON "cokdb1"."queue" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "queue_ownerId_index_001" ON "cokdb1"."queue" ((rtrim("ownerId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "queue_updateTime_index" ON "cokdb1"."queue" (("updateTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."receive_heart" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "duration" integer NOT NULL,
  "effecttype" character varying(2) COLLATE "legacy_meta"."ci" NOT NULL,
  "senduid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."receive_item" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "senduid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(50) COLLATE "legacy_meta"."ci" DEFAULT '0' NOT NULL,
  "itemNum" integer DEFAULT 0 NOT NULL,
  "createTime" bigint,
  CONSTRAINT "receive_item_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."receive_item"."uid" IS '用户唯一标识';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."receive_item"."senduid" IS '发送人用户唯一标识';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."receive_item"."itemId" IS '物品ID';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."receive_item"."itemNum" IS '物品数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."receive_item"."createTime" IS '赠送的时间';
--> statement-breakpoint
CREATE TABLE "cokdb1"."red_packets" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "range" integer DEFAULT 0,
  "rangeId" character varying(255) COLLATE "C" DEFAULT '',
  "type" integer DEFAULT 0,
  "sender" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "senderName" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "pic" character varying(40) COLLATE "legacy_meta"."ci",
  "picVer" integer DEFAULT 0,
  "total" integer DEFAULT 0,
  "remain" integer DEFAULT 0,
  "sendTime" bigint DEFAULT 0,
  "endTime" bigint DEFAULT 0,
  "totalPeople" integer DEFAULT 0,
  "curPeople" integer DEFAULT 0,
  "state" integer DEFAULT 0,
  CONSTRAINT "red_packets_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "red_packets_PRIMARY_pad" ON "cokdb1"."red_packets" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "red_packets_state_index" ON "cokdb1"."red_packets" (("state"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."red_packets_records" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "player" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "pic" character varying(40) COLLATE "legacy_meta"."ci",
  "picVer" integer DEFAULT 0,
  "value" integer DEFAULT 0,
  "getTime" bigint DEFAULT 0,
  CONSTRAINT "red_packets_records_PRIMARY" PRIMARY KEY ("uid", "player")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "red_packets_records_PRIMARY_pad" ON "cokdb1"."red_packets_records" ((rtrim("uid", ' ') COLLATE "C"), (rtrim("player", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "red_packets_records_index_player" ON "cokdb1"."red_packets_records" ((rtrim("player", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."redis_cfg_backup" (
  "keyFlag" character varying(128) COLLATE "legacy_meta"."ci" NOT NULL,
  "info" character varying(2048) COLLATE "legacy_meta"."ci" DEFAULT '0',
  CONSTRAINT "redis_cfg_backup_PRIMARY" PRIMARY KEY ("keyFlag")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."redis_cfg_backup"."keyFlag" IS 'key';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."redis_cfg_backup"."info" IS '内容';
--> statement-breakpoint
CREATE UNIQUE INDEX "redis_cfg_backup_PRIMARY_pad" ON "cokdb1"."redis_cfg_backup" ((rtrim("keyFlag", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."refund_log" (
  "refundId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "order" integer NOT NULL,
  "time" bigint NOT NULL,
  "userId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer,
  "itemId" character varying(16) COLLATE "legacy_meta"."ci" NOT NULL,
  "original" bigint NOT NULL,
  "cost" integer NOT NULL,
  "remain" bigint NOT NULL,
  CONSTRAINT "refund_log_PRIMARY" PRIMARY KEY ("refundId", "order")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "refund_log_PRIMARY_pad" ON "cokdb1"."refund_log" ((rtrim("refundId", ' ') COLLATE "legacy_meta"."ci"), ("order"));
--> statement-breakpoint
CREATE INDEX "refund_log_index_time" ON "cokdb1"."refund_log" (("time"), (rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("type"), (rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "refund_log_index_user" ON "cokdb1"."refund_log" ((rtrim("userId", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."report" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "createTime" bigint NOT NULL,
  "report" bytea NOT NULL,
  CONSTRAINT "report_report_length" CHECK (octet_length("report") <= 16777215),
  CONSTRAINT "report_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "report_PRIMARY_pad" ON "cokdb1"."report" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "report_index_time" ON "cokdb1"."report" (("createTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."res_area_count" (
  "areaId" integer NOT NULL,
  "count" integer NOT NULL,
  CONSTRAINT "res_area_count_PRIMARY" PRIMARY KEY ("areaId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."rescue_skill_record" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci",
  "marchUuid" character varying(255) COLLATE "legacy_meta"."ci",
  "targetUid" character varying(255) COLLATE "legacy_meta"."ci",
  "marchType" integer,
  "targetType" integer,
  "attackTime" bigint,
  "returnTime" bigint DEFAULT 0,
  "activate" integer DEFAULT 0,
  "saved" integer DEFAULT 0,
  "attack" integer DEFAULT 0,
  CONSTRAINT "rescue_skill_record_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "rescue_skill_record_PRIMARY_pad" ON "cokdb1"."rescue_skill_record" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "rescue_skill_record_uid_idx" ON "cokdb1"."rescue_skill_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "rescue_skill_record_tuid_idx" ON "cokdb1"."rescue_skill_record" ((rtrim("targetUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "rescue_skill_record_att_time_idx" ON "cokdb1"."rescue_skill_record" (("attackTime"));
--> statement-breakpoint
CREATE INDEX "rescue_skill_record_return_time_idx" ON "cokdb1"."rescue_skill_record" (("returnTime"));
--> statement-breakpoint
CREATE INDEX "rescue_skill_record_muid_idx" ON "cokdb1"."rescue_skill_record" ((rtrim("marchUuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_107" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "version" character varying(255) COLLATE "C" NOT NULL,
  "sid" integer DEFAULT 0,
  "107uid" character varying(255) COLLATE "C",
  "name" character varying(255) COLLATE "C",
  "rewardLevel" integer DEFAULT 0,
  "rewardStatus" integer DEFAULT 0,
  "endTime" bigint DEFAULT 0,
  CONSTRAINT "reward_107_PRIMARY" PRIMARY KEY ("uid", "version")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "reward_107_PRIMARY_pad" ON "cokdb1"."reward_107" ((rtrim("uid", ' ') COLLATE "C"), (rtrim("version", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "reward_107_time_idx" ON "cokdb1"."reward_107" (("endTime"));
--> statement-breakpoint
CREATE INDEX "reward_107_stat_idx" ON "cokdb1"."reward_107" (("rewardStatus"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_item_control" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "count" integer DEFAULT 0 NOT NULL,
  "flushTime" bigint DEFAULT 0,
  CONSTRAINT "reward_item_control_PRIMARY" PRIMARY KEY ("uid", "itemId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "reward_item_control_PRIMARY_pad" ON "cokdb1"."reward_item_control" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "rewardid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "nownum" integer DEFAULT 0,
  "totalnum" bigint DEFAULT 0,
  CONSTRAINT "reward_log_PRIMARY" PRIMARY KEY ("uid", "rewardid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "reward_log_PRIMARY_pad" ON "cokdb1"."reward_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("rewardid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_0" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "rewardid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "nownum" integer DEFAULT 0,
  "totalnum" bigint DEFAULT 0,
  CONSTRAINT "reward_log_0_PRIMARY" PRIMARY KEY ("uid", "rewardid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "reward_log_0_PRIMARY_pad" ON "cokdb1"."reward_log_0" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("rewardid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_1" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "rewardid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "nownum" integer DEFAULT 0,
  "totalnum" bigint DEFAULT 0,
  CONSTRAINT "reward_log_1_PRIMARY" PRIMARY KEY ("uid", "rewardid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "reward_log_1_PRIMARY_pad" ON "cokdb1"."reward_log_1" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("rewardid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_2" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "rewardid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "nownum" integer DEFAULT 0,
  "totalnum" bigint DEFAULT 0,
  CONSTRAINT "reward_log_2_PRIMARY" PRIMARY KEY ("uid", "rewardid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "reward_log_2_PRIMARY_pad" ON "cokdb1"."reward_log_2" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("rewardid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_3" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "rewardid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "nownum" integer DEFAULT 0,
  "totalnum" bigint DEFAULT 0,
  CONSTRAINT "reward_log_3_PRIMARY" PRIMARY KEY ("uid", "rewardid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "reward_log_3_PRIMARY_pad" ON "cokdb1"."reward_log_3" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("rewardid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_4" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "rewardid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "nownum" integer DEFAULT 0,
  "totalnum" bigint DEFAULT 0,
  CONSTRAINT "reward_log_4_PRIMARY" PRIMARY KEY ("uid", "rewardid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "reward_log_4_PRIMARY_pad" ON "cokdb1"."reward_log_4" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("rewardid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_5" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "rewardid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "nownum" integer DEFAULT 0,
  "totalnum" bigint DEFAULT 0,
  CONSTRAINT "reward_log_5_PRIMARY" PRIMARY KEY ("uid", "rewardid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "reward_log_5_PRIMARY_pad" ON "cokdb1"."reward_log_5" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("rewardid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_6" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "rewardid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "nownum" integer DEFAULT 0,
  "totalnum" bigint DEFAULT 0,
  CONSTRAINT "reward_log_6_PRIMARY" PRIMARY KEY ("uid", "rewardid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "reward_log_6_PRIMARY_pad" ON "cokdb1"."reward_log_6" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("rewardid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_7" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "rewardid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "nownum" integer DEFAULT 0,
  "totalnum" bigint DEFAULT 0,
  CONSTRAINT "reward_log_7_PRIMARY" PRIMARY KEY ("uid", "rewardid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "reward_log_7_PRIMARY_pad" ON "cokdb1"."reward_log_7" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("rewardid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_8" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "rewardid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "nownum" integer DEFAULT 0,
  "totalnum" bigint DEFAULT 0,
  CONSTRAINT "reward_log_8_PRIMARY" PRIMARY KEY ("uid", "rewardid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "reward_log_8_PRIMARY_pad" ON "cokdb1"."reward_log_8" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("rewardid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."reward_log_9" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "rewardid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "nownum" integer DEFAULT 0,
  "totalnum" bigint DEFAULT 0,
  CONSTRAINT "reward_log_9_PRIMARY" PRIMARY KEY ("uid", "rewardid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "reward_log_9_PRIMARY_pad" ON "cokdb1"."reward_log_9" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("rewardid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."rob_general" (
  "uid" character varying(96) COLLATE "legacy_meta"."ci",
  "serverid" integer,
  "allianceid" character varying(96) COLLATE "legacy_meta"."ci",
  "alliancename" character varying(255) COLLATE "legacy_meta"."ci",
  "owneruid" character varying(96) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "ownername" character varying(255) COLLATE "legacy_meta"."ci",
  "generalid" integer DEFAULT 0 NOT NULL,
  "robtime" bigint,
  "freetime" bigint,
  "optime" character varying(200) COLLATE "legacy_meta"."ci",
  CONSTRAINT "rob_general_PRIMARY" PRIMARY KEY ("owneruid", "generalid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "rob_general_PRIMARY_pad" ON "cokdb1"."rob_general" ((rtrim("owneruid", ' ') COLLATE "legacy_meta"."ci"), ("generalid"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."role_permission" (
  "role_id" integer NOT NULL,
  "module_permission" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "route_permission" character varying(1000) COLLATE "legacy_meta"."ci",
  "method_permission" character varying(1000) COLLATE "legacy_meta"."ci",
  CONSTRAINT "role_permission_PRIMARY" PRIMARY KEY ("role_id", "module_permission")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "role_permission_PRIMARY_pad" ON "cokdb1"."role_permission" (("role_id"), (rtrim("module_permission", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."roles" (
  "role_id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "role_name" character varying(50) COLLATE "legacy_meta"."ci",
  "role_flag" character varying(50) COLLATE "legacy_meta"."ci",
  CONSTRAINT "roles_PRIMARY" PRIMARY KEY ("role_id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."routes" (
  "route_id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "module_id" integer,
  "route_name" character varying(50) COLLATE "legacy_meta"."ci",
  "route_path" character varying(100) COLLATE "legacy_meta"."ci",
  "log_tag" smallint DEFAULT 0,
  "prt_id" integer,
  "order_num" character varying(12) COLLATE "legacy_meta"."ci",
  "pinyin" character varying(100) COLLATE "legacy_meta"."ci",
  "isProd" smallint DEFAULT 1,
  "type" character varying(6) COLLATE "legacy_meta"."ci" DEFAULT 'other',
  CONSTRAINT "routes_log_tag_range" CHECK ("log_tag" BETWEEN -128 AND 127),
  CONSTRAINT "routes_isProd_range" CHECK ("isProd" BETWEEN -128 AND 127),
  CONSTRAINT "routes_PRIMARY" PRIMARY KEY ("route_id")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."routes"."log_tag" IS '0:不记录日志；1:记录日志';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."routes"."isProd" IS '0:不在线上系统显示该菜单;1:在线上系统显示该菜单；';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."routes"."type" IS '路径类型：menu|button|other';
--> statement-breakpoint
CREATE TABLE "cokdb1"."saga_tower_science" (
  "uid" character varying(32) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemid" integer NOT NULL,
  "level" integer,
  "cdtime" bigint,
  "reserve" integer,
  CONSTRAINT "saga_tower_science_PRIMARY" PRIMARY KEY ("uid", "itemid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "saga_tower_science_PRIMARY_pad" ON "cokdb1"."saga_tower_science" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("itemid"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."sampleuser" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "regTime" bigint NOT NULL,
  "tag" integer NOT NULL,
  CONSTRAINT "sampleuser_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "sampleuser_PRIMARY_pad" ON "cokdb1"."sampleuser" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "sampleuser_tag_index" ON "cokdb1"."sampleuser" (("tag"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."score_act" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "actId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer,
  "score" integer DEFAULT 0 NOT NULL,
  "finishFlag" integer DEFAULT 0,
  "rewardFlag" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "score_act_PRIMARY" PRIMARY KEY ("uid", "actId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "score_act_PRIMARY_pad" ON "cokdb1"."score_act" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("actId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "score_act_actId_idx" ON "cokdb1"."score_act" ((rtrim("actId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."score_act_in" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "actId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "score" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "score_act_in_PRIMARY" PRIMARY KEY ("uid", "allianceId", "actId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "score_act_in_PRIMARY_pad" ON "cokdb1"."score_act_in" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("actId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "score_act_in_actId" ON "cokdb1"."score_act_in" ((rtrim("actId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "score_act_in_al_idx" ON "cokdb1"."score_act_in" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."score_act_record" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "actId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer,
  "score" integer DEFAULT 0 NOT NULL,
  "finishFlag" integer DEFAULT 0,
  "rewardFlag" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "score_act_record_PRIMARY" PRIMARY KEY ("uid", "actId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "score_act_record_PRIMARY_pad" ON "cokdb1"."score_act_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("actId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "score_act_record_actid_idx" ON "cokdb1"."score_act_record" ((rtrim("actId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "score_act_record_rw_idx" ON "cokdb1"."score_act_record" ((rtrim("rewardFlag", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "score_act_record_lv_idx" ON "cokdb1"."score_act_record" (("level"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_activity" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "id" integer NOT NULL,
  "startTime" bigint,
  "endTime" bigint,
  "rewad" integer DEFAULT 0,
  "events" character varying(500) COLLATE "legacy_meta"."ci",
  CONSTRAINT "server_activity_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_activity_PRIMARY_pad" ON "cokdb1"."server_activity" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_announce" (
  "serverId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "randomGeneral" bytea,
  "lastMoniterPushTime" bigint,
  CONSTRAINT "server_announce_randomGeneral_length" CHECK (octet_length("randomGeneral") <= 65535),
  CONSTRAINT "server_announce_PRIMARY" PRIMARY KEY ("serverId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_announce_PRIMARY_pad" ON "cokdb1"."server_announce" ((rtrim("serverId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_config" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "stat" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "server_config_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_config_PRIMARY_pad" ON "cokdb1"."server_config" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_history_top_score" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL,
  "score" double precision DEFAULT 0,
  "rank" integer DEFAULT 0,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "allianceAbbr" character varying(40) COLLATE "legacy_meta"."ci",
  "allianceIcon" character varying(40) COLLATE "legacy_meta"."ci",
  CONSTRAINT "server_history_top_score_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_history_top_score_PRIMARY_pad" ON "cokdb1"."server_history_top_score" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_info" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "activityTime" bigint,
  "activationTime" bigint DEFAULT 0,
  "kaifu" bigint DEFAULT 0,
  "yangfu" bigint DEFAULT 0,
  "daoliangStart" bigint DEFAULT 0,
  "daoliangEnd" bigint DEFAULT 0,
  "shuaguaiActStart" bigint DEFAULT 0,
  "lastMergeMillis" bigint DEFAULT 0,
  "thronePic" character varying(40) COLLATE "legacy_meta"."ci",
  "payTotalTime" bigint DEFAULT 0,
  "crossFightServerId" integer,
  "worldCount" integer DEFAULT 1,
  "mergeTiredRushBeginTime" bigint DEFAULT 0 NOT NULL,
  "resGoldAddEndTime" bigint DEFAULT 0,
  "lastClearMilitaryMailSendTime" bigint DEFAULT 0,
  CONSTRAINT "server_info_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_info_PRIMARY_pad" ON "cokdb1"."server_info" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_info_copy" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "activityTime" bigint,
  "activationTime" bigint DEFAULT 0,
  "kaifu" bigint DEFAULT 0,
  "yangfu" bigint DEFAULT 0,
  "daoliangStart" bigint DEFAULT 0,
  "daoliangEnd" bigint DEFAULT 0,
  "shuaguaiActStart" bigint DEFAULT 0,
  "lastMergeMillis" bigint DEFAULT 0,
  "thronePic" character varying(40) COLLATE "legacy_meta"."ci",
  "payTotalTime" bigint DEFAULT 0,
  "crossFightServerId" integer,
  "worldCount" integer DEFAULT 1,
  "mergeTiredRushBeginTime" bigint DEFAULT 0 NOT NULL,
  "resGoldAddEndTime" bigint DEFAULT 0,
  "lastClearMilitaryMailSendTime" bigint DEFAULT 0,
  CONSTRAINT "server_info_copy_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_info_copy_PRIMARY_pad" ON "cokdb1"."server_info_copy" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_mail_record" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "record" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "state" integer DEFAULT 0
);
--> statement-breakpoint
CREATE INDEX "server_mail_record_index_uid" ON "cokdb1"."server_mail_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("record", ' ') COLLATE "legacy_meta"."ci"), ("state"));
--> statement-breakpoint
CREATE INDEX "server_mail_record_index_record" ON "cokdb1"."server_mail_record" ((rtrim("record", ' ') COLLATE "legacy_meta"."ci"), ("state"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_merge_task" (
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
COMMENT ON COLUMN "cokdb1"."server_merge_task"."state" IS '0 待审核 1 匹配 2 超时 3 不同意 4 等待合服 5 合服完成';
--> statement-breakpoint
CREATE UNIQUE INDEX "server_merge_task_PRIMARY_pad" ON "cokdb1"."server_merge_task" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_push" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
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
  "title" bytea,
  "contents" bytea,
  "reward" bytea,
  "updateVersion" character varying(40) COLLATE "legacy_meta"."ci",
  "state" integer,
  "parse" integer,
  "notification" bytea,
  "reply" integer,
  "likeStatus" integer,
  "confirm" integer DEFAULT 0,
  "platform" character varying(40) COLLATE "legacy_meta"."ci",
  "itemIdFlag" integer DEFAULT 0,
  "activityId" character varying(64) COLLATE "legacy_meta"."ci",
  "countries" character varying(256) COLLATE "legacy_meta"."ci",
  "deviceLimit" integer,
  "CDKeySeries" integer,
  "bind" integer DEFAULT 0,
  "bLvMin" integer DEFAULT 0,
  "bLvMax" integer DEFAULT 0,
  "HDflag" integer DEFAULT 0,
  "mbLevel" integer DEFAULT 0,
  "setReceiveTime" integer DEFAULT 0,
  "tag" character varying(100) COLLATE "legacy_meta"."ci",
  CONSTRAINT "server_push_title_length" CHECK (octet_length("title") <= 65535),
  CONSTRAINT "server_push_contents_length" CHECK (octet_length("contents") <= 16777215),
  CONSTRAINT "server_push_reward_length" CHECK (octet_length("reward") <= 65535),
  CONSTRAINT "server_push_notification_length" CHECK (octet_length("notification") <= 65535),
  CONSTRAINT "server_push_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_push_PRIMARY_pad" ON "cokdb1"."server_push" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "server_push_index_startTime" ON "cokdb1"."server_push" (("startTime"));
--> statement-breakpoint
CREATE INDEX "server_push_index_stateType" ON "cokdb1"."server_push" (("state"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_push_20141106" (
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
  "reply" integer,
  CONSTRAINT "server_push_20141106_title_length" CHECK (octet_length("title") <= 65535),
  CONSTRAINT "server_push_20141106_contents_length" CHECK (octet_length("contents") <= 65535),
  CONSTRAINT "server_push_20141106_reward_length" CHECK (octet_length("reward") <= 65535),
  CONSTRAINT "server_push_20141106_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_push_20141106_PRIMARY_pad" ON "cokdb1"."server_push_20141106" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "server_push_20141106_index_startTime" ON "cokdb1"."server_push_20141106" (("startTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_push_config" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer DEFAULT 0,
  "startTime" bigint,
  "contents" bytea,
  "state" integer,
  CONSTRAINT "server_push_config_contents_length" CHECK (octet_length("contents") <= 65535),
  CONSTRAINT "server_push_config_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_push_config_PRIMARY_pad" ON "cokdb1"."server_push_config" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "server_push_config_index_startTime" ON "cokdb1"."server_push_config" (("startTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_score" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "id" integer NOT NULL,
  "activity" character varying(40) COLLATE "legacy_meta"."ci",
  "readyTime" bigint,
  "beginTime" bigint,
  "endTime" bigint,
  "rewad" integer DEFAULT 0,
  "round" integer DEFAULT 1,
  CONSTRAINT "server_score_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_score_PRIMARY_pad" ON "cokdb1"."server_score" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_top_score" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "actId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "round" integer DEFAULT 0,
  "score" integer DEFAULT 0,
  "rank" integer DEFAULT 0,
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "allianceAbbr" character varying(40) COLLATE "legacy_meta"."ci",
  "allianceIcon" character varying(40) COLLATE "legacy_meta"."ci",
  CONSTRAINT "server_top_score_PRIMARY" PRIMARY KEY ("uid", "actId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_top_score_PRIMARY_pad" ON "cokdb1"."server_top_score" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("actId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_transfer" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "cdTime" bigint,
  "transferTime" bigint,
  "times" integer,
  "beforeServers" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  CONSTRAINT "server_transfer_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_transfer_PRIMARY_pad" ON "cokdb1"."server_transfer" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_update" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "idx" integer NOT NULL,
  "content" bytea,
  "chineseContent" bytea,
  "endTime" bigint DEFAULT 0,
  CONSTRAINT "server_update_content_length" CHECK (octet_length("content") <= 65535),
  CONSTRAINT "server_update_chineseContent_length" CHECK (octet_length("chineseContent") <= 65535),
  CONSTRAINT "server_update_PRIMARY" PRIMARY KEY ("uid", "idx")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_update_PRIMARY_pad" ON "cokdb1"."server_update" ((rtrim("uid", ' ') COLLATE "C"), ("idx"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_update_suggestion" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "updateId" character varying(255) COLLATE "C" NOT NULL,
  "idx" integer NOT NULL,
  "suggestion" bytea,
  "real_uid" character varying(255) COLLATE "C",
  "server" integer,
  "real_name" character varying(255) COLLATE "C",
  "reward_status" integer DEFAULT 0,
  "createTime" bigint DEFAULT 0,
  CONSTRAINT "server_update_suggestion_suggestion_length" CHECK (octet_length("suggestion") <= 65535),
  CONSTRAINT "server_update_suggestion_PRIMARY" PRIMARY KEY ("uid", "updateId", "idx")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_update_suggestion_PRIMARY_pad" ON "cokdb1"."server_update_suggestion" ((rtrim("uid", ' ') COLLATE "C"), (rtrim("updateId", ' ') COLLATE "C"), ("idx"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."server_usermail" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "toUser" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "sendBy" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "sendTime" bigint NOT NULL,
  "title" character varying(40) COLLATE "legacy_meta"."ci",
  "contents" bytea,
  "reward" bytea,
  "rewardStatus" integer,
  CONSTRAINT "server_usermail_contents_length" CHECK (octet_length("contents") <= 65535),
  CONSTRAINT "server_usermail_reward_length" CHECK (octet_length("reward") <= 65535),
  CONSTRAINT "server_usermail_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "server_usermail_PRIMARY_pad" ON "cokdb1"."server_usermail" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "server_usermail_index_sendTime" ON "cokdb1"."server_usermail" (("sendTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."shopping_mall" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "buyDaily" integer DEFAULT 0,
  "buyTime" bigint DEFAULT 0,
  "buyTotal" integer DEFAULT 0,
  "flushTotalTime" bigint DEFAULT 0,
  CONSTRAINT "shopping_mall_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "shopping_mall_PRIMARY_pad" ON "cokdb1"."shopping_mall" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."sign_in" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "day" integer DEFAULT 0,
  "signInTime" bigint DEFAULT 0,
  CONSTRAINT "sign_in_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "sign_in_PRIMARY_pad" ON "cokdb1"."sign_in" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."sign_in_feed" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "feed" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint DEFAULT 0,
  CONSTRAINT "sign_in_feed_PRIMARY" PRIMARY KEY ("uid", "type", "feed")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "sign_in_feed_PRIMARY_pad" ON "cokdb1"."sign_in_feed" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"), (rtrim("feed", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."soccer_match" (
  "id" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "vs" character varying(100) COLLATE "legacy_meta"."ci",
  "idx" integer,
  "winner" character varying(100) COLLATE "legacy_meta"."ci",
  "startBetTime" bigint,
  "startTime" bigint,
  "ended" integer,
  "betNumA" bigint,
  "betNumB" bigint,
  "oddsA" numeric(20,2),
  "oddsB" numeric(20,2),
  CONSTRAINT "soccer_match_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "soccer_match_PRIMARY_pad" ON "cokdb1"."soccer_match" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "soccer_match_idx_sbt" ON "cokdb1"."soccer_match" (("startBetTime"));
--> statement-breakpoint
CREATE INDEX "soccer_match_idx_st" ON "cokdb1"."soccer_match" (("startTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."staff" (
  "id" integer NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  CONSTRAINT "staff_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_adjust" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "device" character varying(10) COLLATE "legacy_meta"."ci",
  "country" character varying(20) COLLATE "legacy_meta"."ci",
  "channel" character varying(50) COLLATE "legacy_meta"."ci",
  "campain" character varying(100) COLLATE "legacy_meta"."ci",
  "fulldata" bytea,
  CONSTRAINT "stat_adjust_fulldata_length" CHECK (octet_length("fulldata") <= 65535),
  CONSTRAINT "stat_adjust_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_adjust_PRIMARY_pad" ON "cokdb1"."stat_adjust" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "stat_adjust_index_query" ON "cokdb1"."stat_adjust" ((rtrim("device", ' ') COLLATE "legacy_meta"."ci"), (rtrim("country", ' ') COLLATE "legacy_meta"."ci"), (rtrim("channel", ' ') COLLATE "legacy_meta"."ci"), (rtrim("campain", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_af" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "afuid" character varying(200) COLLATE "legacy_meta"."ci",
  "device" character varying(10) COLLATE "legacy_meta"."ci",
  "country" character varying(20) COLLATE "legacy_meta"."ci",
  "channel" character varying(50) COLLATE "legacy_meta"."ci",
  "campain" character varying(100) COLLATE "legacy_meta"."ci",
  "fulldata" bytea,
  CONSTRAINT "stat_af_fulldata_length" CHECK (octet_length("fulldata") <= 65535),
  CONSTRAINT "stat_af_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_af_PRIMARY_pad" ON "cokdb1"."stat_af" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "stat_af_index_af" ON "cokdb1"."stat_af" ((rtrim("afuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "stat_af_index_query" ON "cokdb1"."stat_af" ((rtrim("device", ' ') COLLATE "legacy_meta"."ci"), (rtrim("country", ' ') COLLATE "legacy_meta"."ci"), (rtrim("channel", ' ') COLLATE "legacy_meta"."ci"), (rtrim("campain", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_date" (
  "date" text NOT NULL,
  "dau" integer DEFAULT 0 NOT NULL,
  "pay" numeric(12,2) DEFAULT 0.00 NOT NULL,
  "reg" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "stat_date_date_temporal" CHECK (legacy_meta.valid_temporal("date", 'date', 0)),
  CONSTRAINT "stat_date_PRIMARY" PRIMARY KEY ("date")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "disconnect" bigint DEFAULT 0,
  "ip" character varying(20) COLLATE "legacy_meta"."ci",
  "level" integer,
  "castlelevel" integer,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "regTime" bigint DEFAULT 0 NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "trulyip" character varying(20) COLLATE "legacy_meta"."ci",
  "linkname" character varying(40) COLLATE "legacy_meta"."ci",
  "curpf" character varying(20) COLLATE "legacy_meta"."ci",
  "curcountry" character varying(10) COLLATE "legacy_meta"."ci",
  "curgaid" character varying(40) COLLATE "legacy_meta"."ci",
  "curdeviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "appversion" character varying(40) COLLATE "legacy_meta"."ci",
  "curip" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_login_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_login_PRIMARY_pad" ON "cokdb1"."stat_login" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "stat_login_index_timeStamp" ON "cokdb1"."stat_login" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login2" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  CONSTRAINT "stat_login2_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_login2_PRIMARY_pad" ON "cokdb1"."stat_login2" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_0" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "disconnect" bigint DEFAULT 0,
  "ip" character varying(20) COLLATE "legacy_meta"."ci",
  "level" integer,
  "castlelevel" integer,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "regTime" bigint DEFAULT 0 NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "trulyip" character varying(20) COLLATE "legacy_meta"."ci",
  "linkname" character varying(40) COLLATE "legacy_meta"."ci",
  "curpf" character varying(20) COLLATE "legacy_meta"."ci",
  "curcountry" character varying(10) COLLATE "legacy_meta"."ci",
  "curgaid" character varying(40) COLLATE "legacy_meta"."ci",
  "curdeviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "appversion" character varying(40) COLLATE "legacy_meta"."ci",
  "curip" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_login_2024_0_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_login_2024_0_PRIMARY_pad" ON "cokdb1"."stat_login_2024_0" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "stat_login_2024_0_index_timeStamp" ON "cokdb1"."stat_login_2024_0" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_1" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "disconnect" bigint DEFAULT 0,
  "ip" character varying(20) COLLATE "legacy_meta"."ci",
  "level" integer,
  "castlelevel" integer,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "regTime" bigint DEFAULT 0 NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "trulyip" character varying(20) COLLATE "legacy_meta"."ci",
  "linkname" character varying(40) COLLATE "legacy_meta"."ci",
  "curpf" character varying(20) COLLATE "legacy_meta"."ci",
  "curcountry" character varying(10) COLLATE "legacy_meta"."ci",
  "curgaid" character varying(40) COLLATE "legacy_meta"."ci",
  "curdeviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "appversion" character varying(40) COLLATE "legacy_meta"."ci",
  "curip" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_login_2024_1_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_login_2024_1_PRIMARY_pad" ON "cokdb1"."stat_login_2024_1" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "stat_login_2024_1_index_timeStamp" ON "cokdb1"."stat_login_2024_1" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_10" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "disconnect" bigint DEFAULT 0,
  "ip" character varying(20) COLLATE "legacy_meta"."ci",
  "level" integer,
  "castlelevel" integer,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "regTime" bigint DEFAULT 0 NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "trulyip" character varying(20) COLLATE "legacy_meta"."ci",
  "linkname" character varying(40) COLLATE "legacy_meta"."ci",
  "curpf" character varying(20) COLLATE "legacy_meta"."ci",
  "curcountry" character varying(10) COLLATE "legacy_meta"."ci",
  "curgaid" character varying(40) COLLATE "legacy_meta"."ci",
  "curdeviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "appversion" character varying(40) COLLATE "legacy_meta"."ci",
  "curip" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_login_2024_10_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_login_2024_10_PRIMARY_pad" ON "cokdb1"."stat_login_2024_10" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "stat_login_2024_10_index_timeStamp" ON "cokdb1"."stat_login_2024_10" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_11" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "disconnect" bigint DEFAULT 0,
  "ip" character varying(20) COLLATE "legacy_meta"."ci",
  "level" integer,
  "castlelevel" integer,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "regTime" bigint DEFAULT 0 NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "trulyip" character varying(20) COLLATE "legacy_meta"."ci",
  "linkname" character varying(40) COLLATE "legacy_meta"."ci",
  "curpf" character varying(20) COLLATE "legacy_meta"."ci",
  "curcountry" character varying(10) COLLATE "legacy_meta"."ci",
  "curgaid" character varying(40) COLLATE "legacy_meta"."ci",
  "curdeviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "appversion" character varying(40) COLLATE "legacy_meta"."ci",
  "curip" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_login_2024_11_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_login_2024_11_PRIMARY_pad" ON "cokdb1"."stat_login_2024_11" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "stat_login_2024_11_index_timeStamp" ON "cokdb1"."stat_login_2024_11" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_2" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "disconnect" bigint DEFAULT 0,
  "ip" character varying(20) COLLATE "legacy_meta"."ci",
  "level" integer,
  "castlelevel" integer,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "regTime" bigint DEFAULT 0 NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "trulyip" character varying(20) COLLATE "legacy_meta"."ci",
  "linkname" character varying(40) COLLATE "legacy_meta"."ci",
  "curpf" character varying(20) COLLATE "legacy_meta"."ci",
  "curcountry" character varying(10) COLLATE "legacy_meta"."ci",
  "curgaid" character varying(40) COLLATE "legacy_meta"."ci",
  "curdeviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "appversion" character varying(40) COLLATE "legacy_meta"."ci",
  "curip" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_login_2024_2_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_login_2024_2_PRIMARY_pad" ON "cokdb1"."stat_login_2024_2" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "stat_login_2024_2_index_timeStamp" ON "cokdb1"."stat_login_2024_2" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_3" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "disconnect" bigint DEFAULT 0,
  "ip" character varying(20) COLLATE "legacy_meta"."ci",
  "level" integer,
  "castlelevel" integer,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "regTime" bigint DEFAULT 0 NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "trulyip" character varying(20) COLLATE "legacy_meta"."ci",
  "linkname" character varying(40) COLLATE "legacy_meta"."ci",
  "curpf" character varying(20) COLLATE "legacy_meta"."ci",
  "curcountry" character varying(10) COLLATE "legacy_meta"."ci",
  "curgaid" character varying(40) COLLATE "legacy_meta"."ci",
  "curdeviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "appversion" character varying(40) COLLATE "legacy_meta"."ci",
  "curip" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_login_2024_3_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_login_2024_3_PRIMARY_pad" ON "cokdb1"."stat_login_2024_3" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "stat_login_2024_3_index_timeStamp" ON "cokdb1"."stat_login_2024_3" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_4" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "disconnect" bigint DEFAULT 0,
  "ip" character varying(20) COLLATE "legacy_meta"."ci",
  "level" integer,
  "castlelevel" integer,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "regTime" bigint DEFAULT 0 NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "trulyip" character varying(20) COLLATE "legacy_meta"."ci",
  "linkname" character varying(40) COLLATE "legacy_meta"."ci",
  "curpf" character varying(20) COLLATE "legacy_meta"."ci",
  "curcountry" character varying(10) COLLATE "legacy_meta"."ci",
  "curgaid" character varying(40) COLLATE "legacy_meta"."ci",
  "curdeviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "appversion" character varying(40) COLLATE "legacy_meta"."ci",
  "curip" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_login_2024_4_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_login_2024_4_PRIMARY_pad" ON "cokdb1"."stat_login_2024_4" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "stat_login_2024_4_index_timeStamp" ON "cokdb1"."stat_login_2024_4" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_5" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "disconnect" bigint DEFAULT 0,
  "ip" character varying(20) COLLATE "legacy_meta"."ci",
  "level" integer,
  "castlelevel" integer,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "regTime" bigint DEFAULT 0 NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "trulyip" character varying(20) COLLATE "legacy_meta"."ci",
  "linkname" character varying(40) COLLATE "legacy_meta"."ci",
  "curpf" character varying(20) COLLATE "legacy_meta"."ci",
  "curcountry" character varying(10) COLLATE "legacy_meta"."ci",
  "curgaid" character varying(40) COLLATE "legacy_meta"."ci",
  "curdeviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "appversion" character varying(40) COLLATE "legacy_meta"."ci",
  "curip" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_login_2024_5_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_login_2024_5_PRIMARY_pad" ON "cokdb1"."stat_login_2024_5" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "stat_login_2024_5_index_timeStamp" ON "cokdb1"."stat_login_2024_5" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_6" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "disconnect" bigint DEFAULT 0,
  "ip" character varying(20) COLLATE "legacy_meta"."ci",
  "level" integer,
  "castlelevel" integer,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "regTime" bigint DEFAULT 0 NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "trulyip" character varying(20) COLLATE "legacy_meta"."ci",
  "linkname" character varying(40) COLLATE "legacy_meta"."ci",
  "curpf" character varying(20) COLLATE "legacy_meta"."ci",
  "curcountry" character varying(10) COLLATE "legacy_meta"."ci",
  "curgaid" character varying(40) COLLATE "legacy_meta"."ci",
  "curdeviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "appversion" character varying(40) COLLATE "legacy_meta"."ci",
  "curip" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_login_2024_6_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_login_2024_6_PRIMARY_pad" ON "cokdb1"."stat_login_2024_6" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "stat_login_2024_6_index_timeStamp" ON "cokdb1"."stat_login_2024_6" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_7" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "disconnect" bigint DEFAULT 0,
  "ip" character varying(20) COLLATE "legacy_meta"."ci",
  "level" integer,
  "castlelevel" integer,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "regTime" bigint DEFAULT 0 NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "trulyip" character varying(20) COLLATE "legacy_meta"."ci",
  "linkname" character varying(40) COLLATE "legacy_meta"."ci",
  "curpf" character varying(20) COLLATE "legacy_meta"."ci",
  "curcountry" character varying(10) COLLATE "legacy_meta"."ci",
  "curgaid" character varying(40) COLLATE "legacy_meta"."ci",
  "curdeviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "appversion" character varying(40) COLLATE "legacy_meta"."ci",
  "curip" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_login_2024_7_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_login_2024_7_PRIMARY_pad" ON "cokdb1"."stat_login_2024_7" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "stat_login_2024_7_index_timeStamp" ON "cokdb1"."stat_login_2024_7" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_8" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "disconnect" bigint DEFAULT 0,
  "ip" character varying(20) COLLATE "legacy_meta"."ci",
  "level" integer,
  "castlelevel" integer,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "regTime" bigint DEFAULT 0 NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "trulyip" character varying(20) COLLATE "legacy_meta"."ci",
  "linkname" character varying(40) COLLATE "legacy_meta"."ci",
  "curpf" character varying(20) COLLATE "legacy_meta"."ci",
  "curcountry" character varying(10) COLLATE "legacy_meta"."ci",
  "curgaid" character varying(40) COLLATE "legacy_meta"."ci",
  "curdeviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "appversion" character varying(40) COLLATE "legacy_meta"."ci",
  "curip" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_login_2024_8_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_login_2024_8_PRIMARY_pad" ON "cokdb1"."stat_login_2024_8" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "stat_login_2024_8_index_timeStamp" ON "cokdb1"."stat_login_2024_8" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2024_9" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "disconnect" bigint DEFAULT 0,
  "ip" character varying(20) COLLATE "legacy_meta"."ci",
  "level" integer,
  "castlelevel" integer,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "regTime" bigint DEFAULT 0 NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "trulyip" character varying(20) COLLATE "legacy_meta"."ci",
  "linkname" character varying(40) COLLATE "legacy_meta"."ci",
  "curpf" character varying(20) COLLATE "legacy_meta"."ci",
  "curcountry" character varying(10) COLLATE "legacy_meta"."ci",
  "curgaid" character varying(40) COLLATE "legacy_meta"."ci",
  "curdeviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "appversion" character varying(40) COLLATE "legacy_meta"."ci",
  "curip" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_login_2024_9_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_login_2024_9_PRIMARY_pad" ON "cokdb1"."stat_login_2024_9" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "stat_login_2024_9_index_timeStamp" ON "cokdb1"."stat_login_2024_9" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_login_2026_9" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "disconnect" bigint DEFAULT 0,
  "ip" character varying(20) COLLATE "legacy_meta"."ci",
  "level" integer,
  "castlelevel" integer,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "regTime" bigint DEFAULT 0 NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "trulyip" character varying(20) COLLATE "legacy_meta"."ci",
  "linkname" character varying(40) COLLATE "legacy_meta"."ci",
  "curpf" character varying(20) COLLATE "legacy_meta"."ci",
  "curcountry" character varying(10) COLLATE "legacy_meta"."ci",
  "curgaid" character varying(40) COLLATE "legacy_meta"."ci",
  "curdeviceid" character varying(255) COLLATE "legacy_meta"."ci",
  "appversion" character varying(40) COLLATE "legacy_meta"."ci",
  "curip" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_login_2026_9_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_login_2026_9_PRIMARY_pad" ON "cokdb1"."stat_login_2026_9" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE INDEX "stat_login_2026_9_index_timeStamp" ON "cokdb1"."stat_login_2026_9" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_phone" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "model" character varying(255) COLLATE "legacy_meta"."ci",
  "version" character varying(255) COLLATE "legacy_meta"."ci",
  "width" integer,
  "height" integer,
  CONSTRAINT "stat_phone_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_phone_PRIMARY_pad" ON "cokdb1"."stat_phone" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_phone_log" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "phoneDevice" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "model" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "version" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "width" integer NOT NULL,
  "height" integer NOT NULL,
  "count" integer,
  "time" bigint,
  CONSTRAINT "stat_phone_log_PRIMARY" PRIMARY KEY ("uid", "phoneDevice", "model", "version", "width", "height")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_phone_log_PRIMARY_pad" ON "cokdb1"."stat_phone_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("phoneDevice", ' ') COLLATE "legacy_meta"."ci"), (rtrim("model", ' ') COLLATE "legacy_meta"."ci"), (rtrim("version", ' ') COLLATE "legacy_meta"."ci"), ("width"), ("height"));
--> statement-breakpoint
CREATE INDEX "stat_phone_log_idx" ON "cokdb1"."stat_phone_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_reg" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "time" bigint NOT NULL,
  "pf" character varying(20) COLLATE "legacy_meta"."ci",
  "pfId" character varying(200) COLLATE "legacy_meta"."ci",
  "referrer" bytea,
  "country" character varying(10) COLLATE "legacy_meta"."ci",
  "ip" character varying(20) COLLATE "legacy_meta"."ci",
  "ipcountry" character varying(10) COLLATE "legacy_meta"."ci",
  "linkname" character varying(40) COLLATE "legacy_meta"."ci",
  "curip" character varying(20) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_reg_referrer_length" CHECK (octet_length("referrer") <= 65535),
  CONSTRAINT "stat_reg_PRIMARY" PRIMARY KEY ("uid", "type")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_reg_PRIMARY_pad" ON "cokdb1"."stat_reg" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE INDEX "stat_reg_index_time_pf_country" ON "cokdb1"."stat_reg" (("time"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"), (rtrim("country", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "stat_reg_country_index" ON "cokdb1"."stat_reg" ((rtrim("country", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_tutorial" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "tutorial" bigint NOT NULL,
  "time" bigint,
  CONSTRAINT "stat_tutorial_PRIMARY" PRIMARY KEY ("uid", "tutorial")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_tutorial_PRIMARY_pad" ON "cokdb1"."stat_tutorial" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("tutorial"));
--> statement-breakpoint
CREATE INDEX "stat_tutorial_index_time" ON "cokdb1"."stat_tutorial" (("time"));
--> statement-breakpoint
CREATE INDEX "stat_tutorial_index_tutorial" ON "cokdb1"."stat_tutorial" (("tutorial"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_tutorial_analyze" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "tutorial" bigint NOT NULL,
  "time" bigint,
  CONSTRAINT "stat_tutorial_analyze_PRIMARY" PRIMARY KEY ("uid", "tutorial")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_tutorial_analyze_PRIMARY_pad" ON "cokdb1"."stat_tutorial_analyze" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("tutorial"));
--> statement-breakpoint
CREATE INDEX "stat_tutorial_analyze_index_time" ON "cokdb1"."stat_tutorial_analyze" (("time"));
--> statement-breakpoint
CREATE INDEX "stat_tutorial_analyze_index_tutorial" ON "cokdb1"."stat_tutorial_analyze" (("tutorial"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."stat_tutorial_v2" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "tutorial" bigint NOT NULL,
  "time" bigint,
  "appVersion" character varying(40) COLLATE "legacy_meta"."ci",
  CONSTRAINT "stat_tutorial_v2_PRIMARY" PRIMARY KEY ("uid", "tutorial")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "stat_tutorial_v2_PRIMARY_pad" ON "cokdb1"."stat_tutorial_v2" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("tutorial"));
--> statement-breakpoint
CREATE INDEX "stat_tutorial_v2_index_time" ON "cokdb1"."stat_tutorial_v2" (("time"), (rtrim("appVersion", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."subscription_log" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "orderId" character varying(200) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "itemId" character varying(10) COLLATE "legacy_meta"."ci",
  "originalOrderId" character varying(200) COLLATE "legacy_meta"."ci",
  "beginTime" bigint,
  "endTime" bigint,
  "nextCheckTime" bigint,
  CONSTRAINT "subscription_log_PRIMARY" PRIMARY KEY ("uid", "orderId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "subscription_log_PRIMARY_pad" ON "cokdb1"."subscription_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("orderId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "subscription_log_index_uid_itemId" ON "cokdb1"."subscription_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."suggest_log" (
  "uuid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "user" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "timeStamp" bigint NOT NULL,
  "description" bytea,
  "param1" integer,
  "param2" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "suggest_log_description_length" CHECK (octet_length("description") <= 65535),
  CONSTRAINT "suggest_log_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "suggest_log_PRIMARY_pad" ON "cokdb1"."suggest_log" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "suggest_log_index" ON "cokdb1"."suggest_log" ((rtrim("user", ' ') COLLATE "legacy_meta"."ci"), ("timeStamp"));
--> statement-breakpoint
CREATE INDEX "suggest_log_index_2" ON "cokdb1"."suggest_log" ((rtrim("user", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "suggest_log_index_3" ON "cokdb1"."suggest_log" (("param1"), (rtrim("param2", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."suggestion" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "ownerId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "castlelevel" integer,
  "contents" bytea NOT NULL,
  "createTime" bigint NOT NULL,
  "replyContent" bytea,
  "replyTime" bigint,
  CONSTRAINT "suggestion_contents_length" CHECK (octet_length("contents") <= 65535),
  CONSTRAINT "suggestion_replyContent_length" CHECK (octet_length("replyContent") <= 65535),
  CONSTRAINT "suggestion_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "suggestion_PRIMARY_pad" ON "cokdb1"."suggestion" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "suggestion_ownerId" ON "cokdb1"."suggestion" ((rtrim("ownerId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."suit_create_rate" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "rate" integer NOT NULL,
  CONSTRAINT "suit_create_rate_PRIMARY" PRIMARY KEY ("uid", "itemId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "suit_create_rate_PRIMARY_pad" ON "cokdb1"."suit_create_rate" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."suit_decompose_effect" (
  "item1" character varying(100) COLLATE "legacy_meta"."ci",
  "item2" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '0',
  "item3" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '0',
  "item4" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '0',
  "item5" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '0',
  "item6" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '0',
  "owner" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '0' NOT NULL,
  "suitid" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '0' NOT NULL,
  CONSTRAINT "suit_decompose_effect_PRIMARY" PRIMARY KEY ("owner", "suitid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "suit_decompose_effect_PRIMARY_pad" ON "cokdb1"."suit_decompose_effect" ((rtrim("owner", ' ') COLLATE "legacy_meta"."ci"), (rtrim("suitid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "suit_decompose_effect_owner_suit" ON "cokdb1"."suit_decompose_effect" ((rtrim("owner", ' ') COLLATE "legacy_meta"."ci"), (rtrim("suitid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."sumsungactivity" (
  "uid" character varying(70) COLLATE "legacy_meta"."ci" NOT NULL,
  "deviceID" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint,
  CONSTRAINT "sumsungactivity_PRIMARY" PRIMARY KEY ("uid", "deviceID")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."sumsungactivity"."uid" IS '玩家id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."sumsungactivity"."deviceID" IS '设备id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."sumsungactivity"."time" IS '领取时间';
--> statement-breakpoint
CREATE UNIQUE INDEX "sumsungactivity_PRIMARY_pad" ON "cokdb1"."sumsungactivity" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("deviceID", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."super_army_log" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci",
  "castleLevel" integer,
  "level" integer,
  "createTime" bigint,
  CONSTRAINT "super_army_log_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "super_army_log_PRIMARY_pad" ON "cokdb1"."super_army_log" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "super_army_log_createTime_index" ON "cokdb1"."super_army_log" (("createTime"));
--> statement-breakpoint
CREATE INDEX "super_army_log_uid_index" ON "cokdb1"."super_army_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."switches" (
  "name" character varying(255) COLLATE "C" NOT NULL,
  "stat" integer DEFAULT 0,
  "appVersion" character varying(255) COLLATE "C",
  CONSTRAINT "switches_PRIMARY" PRIMARY KEY ("name")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "switches_PRIMARY_pad" ON "cokdb1"."switches" ((rtrim("name", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."system_data" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "value" text COLLATE "legacy_meta"."ci",
  CONSTRAINT "system_data_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "system_data_PRIMARY_pad" ON "cokdb1"."system_data" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."t_hero" (
  "id" character varying(36) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(32) COLLATE "legacy_meta"."ci",
  "heroid" integer,
  "level" smallint,
  "exp" integer,
  "events" text COLLATE "legacy_meta"."ci",
  "createtime" bigint,
  "state" smallint,
  "skinID" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  CONSTRAINT "t_hero_state_range" CHECK ("state" BETWEEN -128 AND 127),
  CONSTRAINT "t_hero_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."t_hero"."skinID" IS '英雄皮肤';
--> statement-breakpoint
CREATE UNIQUE INDEX "t_hero_PRIMARY_pad" ON "cokdb1"."t_hero" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "t_hero_Index_uid" ON "cokdb1"."t_hero" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."t_worldboss" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 8456) NOT NULL,
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
  "killuser" character varying(32) COLLATE "legacy_meta"."ci",
  "reward" smallint,
  "firerange" integer,
  "firespeed" integer,
  "status" smallint,
  CONSTRAINT "t_worldboss_type_range" CHECK ("type" BETWEEN -128 AND 127),
  CONSTRAINT "t_worldboss_reward_range" CHECK ("reward" BETWEEN -128 AND 127),
  CONSTRAINT "t_worldboss_status_range" CHECK ("status" BETWEEN -128 AND 127),
  CONSTRAINT "t_worldboss_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."t_worldbossinfo" (
  "id" character varying(36) COLLATE "C" NOT NULL,
  "bossid" integer,
  "level" smallint,
  "type" smallint,
  "weeklyresettime" bigint,
  "weeklytimes" smallint,
  "dailyresettime" bigint,
  "dailytimes" smallint,
  CONSTRAINT "t_worldbossinfo_type_range" CHECK ("type" BETWEEN -128 AND 127),
  CONSTRAINT "t_worldbossinfo_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "t_worldbossinfo_PRIMARY_pad" ON "cokdb1"."t_worldbossinfo" ((rtrim("id", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."t_worldbossrank" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1131) NOT NULL,
  "bossid" integer,
  "bosstid" integer,
  "uid" character varying(32) COLLATE "legacy_meta"."ci",
  "score" integer,
  "reward" smallint,
  "lastscore" integer,
  "lasttime" bigint,
  CONSTRAINT "t_worldbossrank_reward_range" CHECK ("reward" BETWEEN -128 AND 127),
  CONSTRAINT "t_worldbossrank_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE INDEX "t_worldbossrank_Index_bossid" ON "cokdb1"."t_worldbossrank" (("bossid"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."tavern" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "free" integer NOT NULL,
  "firstFree" integer NOT NULL,
  "firstPay" integer NOT NULL,
  "freeTimes" integer NOT NULL,
  "payTimes" integer NOT NULL,
  "generals" character varying(255) COLLATE "legacy_meta"."ci",
  "generalId1" character varying(40) COLLATE "legacy_meta"."ci",
  "generalId2" character varying(40) COLLATE "legacy_meta"."ci",
  "generalId3" character varying(40) COLLATE "legacy_meta"."ci",
  "generalId4" character varying(40) COLLATE "legacy_meta"."ci",
  "generalId5" character varying(40) COLLATE "legacy_meta"."ci",
  "generalId6" character varying(40) COLLATE "legacy_meta"."ci",
  "recruit1" integer NOT NULL,
  "recruit2" integer NOT NULL,
  "recruit3" integer NOT NULL,
  "recruit4" integer NOT NULL,
  "recruit5" integer NOT NULL,
  "recruit6" integer NOT NULL,
  "addFreeTime" bigint NOT NULL,
  "resetResult" integer NOT NULL,
  CONSTRAINT "tavern_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "tavern_PRIMARY_pad" ON "cokdb1"."tavern" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."team_atk_time" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint DEFAULT 0,
  CONSTRAINT "team_atk_time_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "team_atk_time_PRIMARY_pad" ON "cokdb1"."team_atk_time" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."territory_trap_log" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "allianceid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "logid" integer NOT NULL,
  "param" character varying(100) COLLATE "legacy_meta"."ci" NOT NULL,
  "createtime" bigint DEFAULT 0,
  "paramname" character varying(60) COLLATE "legacy_meta"."ci" DEFAULT '',
  CONSTRAINT "territory_trap_log_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "territory_trap_log_PRIMARY_pad" ON "cokdb1"."territory_trap_log" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "territory_trap_log_allianceid_index" ON "cokdb1"."territory_trap_log" ((rtrim("allianceid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."territory_user_effect" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "pointId" integer NOT NULL,
  "allianceId" character varying(255) COLLATE "C",
  "stat" integer,
  "active" integer,
  CONSTRAINT "territory_user_effect_PRIMARY" PRIMARY KEY ("uid", "pointId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "territory_user_effect_PRIMARY_pad" ON "cokdb1"."territory_user_effect" ((rtrim("uid", ' ') COLLATE "C"), ("pointId"));
--> statement-breakpoint
CREATE INDEX "territory_user_effect_alliance_idx" ON "cokdb1"."territory_user_effect" ((rtrim("allianceId", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."time_notice" (
  "timeType" integer NOT NULL,
  "timeVal" bigint,
  CONSTRAINT "time_notice_PRIMARY" PRIMARY KEY ("timeType")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."time_notice"."timeType" IS '需要记录的时间的时间类型';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."time_notice"."timeVal" IS '时间值(比如,上次鲜花榜刷新的时间)';
--> statement-breakpoint
CREATE TABLE "cokdb1"."time_reward" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(255) COLLATE "legacy_meta"."ci",
  "rewardId" character varying(255) COLLATE "legacy_meta"."ci",
  "lastRewardTime" bigint,
  "nextRewardTime" bigint,
  "count" integer,
  CONSTRAINT "time_reward_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "time_reward_PRIMARY_pad" ON "cokdb1"."time_reward" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."train" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "genUid" character varying(40) COLLATE "legacy_meta"."ci",
  "finishTrain" bigint NOT NULL,
  "endTime" bigint NOT NULL,
  CONSTRAINT "train_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "train_PRIMARY_pad" ON "cokdb1"."train" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."translation" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "content" bytea,
  "en" bytea,
  "originalLang" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT 'cn',
  CONSTRAINT "translation_content_length" CHECK (octet_length("content") <= 65535),
  CONSTRAINT "translation_en_length" CHECK (octet_length("en") <= 65535),
  CONSTRAINT "translation_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."translation"."content" IS '发言内容';
--> statement-breakpoint
CREATE INDEX "translation_index_content" ON "cokdb1"."translation" ((substring("content" from 1 for 50)));
--> statement-breakpoint
CREATE TABLE "cokdb1"."translation_record" (
  "date" character varying(255) COLLATE "legacy_meta"."sv_ci" NOT NULL,
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
  CONSTRAINT "translation_record_PRIMARY" PRIMARY KEY ("date")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "translation_record_PRIMARY_pad" ON "cokdb1"."translation_record" ((rtrim("date", ' ') COLLATE "legacy_meta"."sv_ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."translationv2" (
  "id" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "en" bytea,
  "zh-Hans" bytea,
  "zh-Hant" bytea,
  "ja" bytea,
  "ko" bytea,
  "ru" bytea,
  "es" bytea,
  "ms" bytea,
  "fr" bytea,
  "de" bytea,
  "it" bytea,
  "pt" bytea,
  "count" integer DEFAULT 0,
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
  CONSTRAINT "translationv2_pt_length" CHECK (octet_length("pt") <= 65535),
  CONSTRAINT "translationv2_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "translationv2_PRIMARY_pad" ON "cokdb1"."translationv2" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "translationv2_index_en" ON "cokdb1"."translationv2" ((substring("en" from 1 for 50)));
--> statement-breakpoint
CREATE INDEX "translationv2_index_zh-Hans" ON "cokdb1"."translationv2" ((substring("zh-Hans" from 1 for 20)));
--> statement-breakpoint
CREATE INDEX "translationv2_index_zh-Hant" ON "cokdb1"."translationv2" ((substring("zh-Hant" from 1 for 20)));
--> statement-breakpoint
CREATE INDEX "translationv2_index_ja" ON "cokdb1"."translationv2" ((substring("ja" from 1 for 20)));
--> statement-breakpoint
CREATE INDEX "translationv2_index_ko" ON "cokdb1"."translationv2" ((substring("ko" from 1 for 20)));
--> statement-breakpoint
CREATE INDEX "translationv2_index_ru" ON "cokdb1"."translationv2" ((substring("ru" from 1 for 20)));
--> statement-breakpoint
CREATE INDEX "translationv2_index_es" ON "cokdb1"."translationv2" ((substring("es" from 1 for 20)));
--> statement-breakpoint
CREATE INDEX "translationv2_index_ms" ON "cokdb1"."translationv2" ((substring("ms" from 1 for 20)));
--> statement-breakpoint
CREATE INDEX "translationv2_index_fr" ON "cokdb1"."translationv2" ((substring("fr" from 1 for 20)));
--> statement-breakpoint
CREATE INDEX "translationv2_index_de" ON "cokdb1"."translationv2" ((substring("de" from 1 for 20)));
--> statement-breakpoint
CREATE INDEX "translationv2_index_it" ON "cokdb1"."translationv2" ((substring("it" from 1 for 20)));
--> statement-breakpoint
CREATE INDEX "translationv2_index_pt" ON "cokdb1"."translationv2" ((substring("pt" from 1 for 20)));
--> statement-breakpoint
CREATE INDEX "translationv2_index_count" ON "cokdb1"."translationv2" (("count"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."treasure_map" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "treasureId" character varying(40) COLLATE "legacy_meta"."ci",
  "currentOwner" character varying(40) COLLATE "legacy_meta"."ci",
  "originalOwner" character varying(40) COLLATE "legacy_meta"."ci",
  "targetId" integer,
  "time" integer,
  "colour" integer,
  "marchId" character varying(40) COLLATE "legacy_meta"."ci",
  "startTime" bigint,
  "finishTime" bigint,
  "state" integer,
  CONSTRAINT "treasure_map_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "treasure_map_PRIMARY_pad" ON "cokdb1"."treasure_map" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "treasure_map_index_o_m" ON "cokdb1"."treasure_map" ((rtrim("currentOwner", ' ') COLLATE "legacy_meta"."ci"), (rtrim("marchId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "treasure_map_index_o_t" ON "cokdb1"."treasure_map" ((rtrim("currentOwner", ' ') COLLATE "legacy_meta"."ci"), ("targetId"));
--> statement-breakpoint
CREATE INDEX "treasure_map_index_o_s_c" ON "cokdb1"."treasure_map" ((rtrim("currentOwner", ' ') COLLATE "legacy_meta"."ci"), ("state"), ("colour"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."tree_award" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "freeCount" integer NOT NULL,
  "awardCount" integer NOT NULL,
  "lastFreeTime" bigint NOT NULL,
  "lastAwardTime" bigint NOT NULL,
  "awardMaxCount" integer DEFAULT 0,
  CONSTRAINT "tree_award_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "tree_award_PRIMARY_pad" ON "cokdb1"."tree_award" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."trial_field" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "freeTrial" integer DEFAULT 0,
  "freeFresh" bigint DEFAULT 0,
  "freeAtk" integer DEFAULT 0,
  "monster" character varying(50) COLLATE "legacy_meta"."ci" DEFAULT '',
  "blood" integer DEFAULT 0,
  "screen" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "buyTrial" integer DEFAULT 0,
  "buyAtk" integer DEFAULT 0,
  "chargeAtkTimes" integer DEFAULT 0,
  "rewardMonster" character varying(50) COLLATE "legacy_meta"."ci" DEFAULT '',
  CONSTRAINT "trial_field_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "trial_field_PRIMARY_pad" ON "cokdb1"."trial_field" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."trigger_timmer" (
  "timmer_name" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "count" integer DEFAULT 0 NOT NULL,
  "last_exec_millis" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "trigger_timmer_PRIMARY" PRIMARY KEY ("timmer_name")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "trigger_timmer_PRIMARY_pad" ON "cokdb1"."trigger_timmer" ((rtrim("timmer_name", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."trigger_var" (
  "type" integer NOT NULL,
  "uid" character varying(50) COLLATE "legacy_meta"."ci" DEFAULT '''''' NOT NULL,
  "key" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "value" text COLLATE "legacy_meta"."ci" NOT NULL,
  "refreshtime" bigint DEFAULT 0 NOT NULL,
  "createTime" text DEFAULT legacy_meta.utc_now(0) NOT NULL,
  "lastUpdateTime" text DEFAULT '0000-00-00 00:00:00' NOT NULL,
  CONSTRAINT "trigger_var_createTime_temporal" CHECK (legacy_meta.valid_temporal("createTime", 'timestamp', 0)),
  CONSTRAINT "trigger_var_lastUpdateTime_temporal" CHECK (legacy_meta.valid_temporal("lastUpdateTime", 'timestamp', 0)),
  CONSTRAINT "trigger_var_PRIMARY" PRIMARY KEY ("type", "uid", "key")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "trigger_var_PRIMARY_pad" ON "cokdb1"."trigger_var" (("type"), (rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("key", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "trigger_var_type_key" ON "cokdb1"."trigger_var" (("type"), (rtrim("key", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "trigger_var_uid" ON "cokdb1"."trigger_var" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "trigger_var_createTime" ON "cokdb1"."trigger_var" (("createTime"));
--> statement-breakpoint
CREATE INDEX "trigger_var_lastUpdateTime" ON "cokdb1"."trigger_var" (("lastUpdateTime"));
--> statement-breakpoint
CREATE FUNCTION legacy_meta."ts_7e49818337bd736a7eae"() RETURNS trigger LANGUAGE plpgsql AS $body$
BEGIN
  IF NEW."createTime" IS NULL THEN
    NEW."createTime" := legacy_meta.utc_now(0);
  END IF;
  RETURN NEW;
END $body$;
--> statement-breakpoint
CREATE TRIGGER c_ts_7e49818337bd736a7eae BEFORE INSERT OR UPDATE ON "cokdb1"."trigger_var" FOR EACH ROW EXECUTE FUNCTION legacy_meta."ts_7e49818337bd736a7eae"();
--> statement-breakpoint
CREATE FUNCTION legacy_meta."ts_db32f4bc09f8c9357816"() RETURNS trigger LANGUAGE plpgsql AS $body$
BEGIN
  IF NEW."lastUpdateTime" IS NULL THEN
    NEW."lastUpdateTime" := legacy_meta.utc_now(0);
  END IF;
  RETURN NEW;
END $body$;
--> statement-breakpoint
CREATE TRIGGER c_ts_db32f4bc09f8c9357816 BEFORE INSERT OR UPDATE ON "cokdb1"."trigger_var" FOR EACH ROW EXECUTE FUNCTION legacy_meta."ts_db32f4bc09f8c9357816"();
--> statement-breakpoint
CREATE TABLE "cokdb1"."trouble_log" (
  "uid" bigint,
  "username" character varying(255) COLLATE "legacy_meta"."ci",
  "usetime" bigint,
  "statusid" character varying(255) COLLATE "legacy_meta"."ci"
);
--> statement-breakpoint
CREATE INDEX "trouble_log_trouble_log_uid_index" ON "cokdb1"."trouble_log" (("uid"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."turret_shooting_task" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "turretUid" character varying(255) COLLATE "C",
  "marchUuid" character varying(255) COLLATE "C",
  "startTime" bigint,
  "endTime" bigint,
  CONSTRAINT "turret_shooting_task_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "turret_shooting_task_PRIMARY_pad" ON "cokdb1"."turret_shooting_task" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "turret_shooting_task_uuid_idx" ON "cokdb1"."turret_shooting_task" ((rtrim("marchUuid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "turret_shooting_task_startTime_idx" ON "cokdb1"."turret_shooting_task" (("startTime"));
--> statement-breakpoint
CREATE INDEX "turret_shooting_task_endTime_idx" ON "cokdb1"."turret_shooting_task" (("endTime"));
--> statement-breakpoint
CREATE INDEX "turret_shooting_task_uid_idx" ON "cokdb1"."turret_shooting_task" ((rtrim("turretUid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user" (
  "id" bigint DEFAULT 0 NOT NULL,
  "age" bigint,
  "email" character varying(255) COLLATE "legacy_meta"."ci",
  "name" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_14day_login" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "day" integer DEFAULT 0,
  "lastRewardTime" bigint DEFAULT 0,
  "vipRewardTime" bigint DEFAULT 0,
  "reward" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_14day_login_PRIMARY" PRIMARY KEY ("uid", "type")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_14day_login_PRIMARY_pad" ON "cokdb1"."user_14day_login" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE INDEX "user_14day_login_day_index" ON "cokdb1"."user_14day_login" (("day"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_achievement" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "num" bigint DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  "completeTime" bigint DEFAULT 0,
  "rewardTime" bigint,
  CONSTRAINT "user_achievement_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_achievement_PRIMARY_pad" ON "cokdb1"."user_achievement" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_activation" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "data" bytea,
  CONSTRAINT "user_activation_data_length" CHECK (octet_length("data") <= 65535),
  CONSTRAINT "user_activation_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_activation_PRIMARY_pad" ON "cokdb1"."user_activation" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_activity" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "actId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "status" integer DEFAULT 0 NOT NULL,
  "time" bigint,
  CONSTRAINT "user_activity_PRIMARY" PRIMARY KEY ("uid", "actId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_activity_PRIMARY_pad" ON "cokdb1"."user_activity" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("actId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_activity_new" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "actId" integer NOT NULL,
  "level" integer NOT NULL,
  "rewards" character varying(1000) COLLATE "legacy_meta"."ci" NOT NULL,
  "updateTime" bigint NOT NULL,
  "reserve_1" integer NOT NULL,
  "reserve_2" character varying(1000) COLLATE "legacy_meta"."ci" NOT NULL,
  "flushTimes" integer DEFAULT 0,
  "flushDate" bigint DEFAULT 0,
  "receiveLevels" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '',
  CONSTRAINT "user_activity_new_PRIMARY" PRIMARY KEY ("uid", "actId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_activity_new_PRIMARY_pad" ON "cokdb1"."user_activity_new" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("actId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_alliance_task" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(255) COLLATE "legacy_meta"."ci",
  "num" bigint DEFAULT 0,
  "state" integer DEFAULT 0,
  CONSTRAINT "user_alliance_task_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_alliance_task_PRIMARY_pad" ON "cokdb1"."user_alliance_task" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_alliance_task_id_idx" ON "cokdb1"."user_alliance_task" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_arena" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci",
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
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "armyId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer DEFAULT 0 NOT NULL,
  "free" integer DEFAULT 0 NOT NULL,
  "pve" integer DEFAULT 0 NOT NULL,
  "march" integer DEFAULT 0 NOT NULL,
  "defence" integer DEFAULT 0 NOT NULL,
  "train" integer DEFAULT 0 NOT NULL,
  "foodCostTime" bigint DEFAULT 0 NOT NULL,
  "finishTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "user_army_PRIMARY" PRIMARY KEY ("uid", "armyId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_army_PRIMARY_pad" ON "cokdb1"."user_army" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("armyId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_army_back" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "armyId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer DEFAULT 0 NOT NULL,
  "free" integer DEFAULT 0 NOT NULL,
  "pve" integer DEFAULT 0 NOT NULL,
  "march" integer DEFAULT 0 NOT NULL,
  "defence" integer DEFAULT 0 NOT NULL,
  "train" integer DEFAULT 0 NOT NULL,
  "foodCostTime" bigint DEFAULT 0 NOT NULL,
  "finishTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "user_army_back_PRIMARY" PRIMARY KEY ("uid", "armyId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_army_back_PRIMARY_pad" ON "cokdb1"."user_army_back" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("armyId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_army_bak" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "armyId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer DEFAULT 0 NOT NULL,
  "free" integer DEFAULT 0 NOT NULL,
  "pve" integer DEFAULT 0 NOT NULL,
  "march" integer DEFAULT 0 NOT NULL,
  "defence" integer DEFAULT 0 NOT NULL,
  "train" integer DEFAULT 0 NOT NULL,
  "foodCostTime" bigint DEFAULT 0 NOT NULL,
  "finishTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "user_army_bak_PRIMARY" PRIMARY KEY ("uid", "armyId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_army_bak_PRIMARY_pad" ON "cokdb1"."user_army_bak" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("armyId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_army_change" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "armyId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer DEFAULT 0 NOT NULL,
  "free" integer DEFAULT 0 NOT NULL,
  "pve" integer DEFAULT 0 NOT NULL,
  "march" integer DEFAULT 0 NOT NULL,
  "defence" integer DEFAULT 0 NOT NULL,
  "train" integer DEFAULT 0 NOT NULL,
  "foodCostTime" bigint DEFAULT 0 NOT NULL,
  "finishTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "user_army_change_PRIMARY" PRIMARY KEY ("uid", "armyId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_army_change_PRIMARY_pad" ON "cokdb1"."user_army_change" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("armyId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_army_cross" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "armyId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer DEFAULT 0 NOT NULL,
  "free" integer DEFAULT 0 NOT NULL,
  "pve" integer DEFAULT 0 NOT NULL,
  "march" integer DEFAULT 0 NOT NULL,
  "defence" integer DEFAULT 0 NOT NULL,
  "train" integer DEFAULT 0 NOT NULL,
  "foodCostTime" bigint DEFAULT 0 NOT NULL,
  "finishTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "user_army_cross_PRIMARY" PRIMARY KEY ("uid", "armyId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_army_cross_PRIMARY_pad" ON "cokdb1"."user_army_cross" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("armyId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_assets" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "winPoint" bigint DEFAULT 0 NOT NULL,
  "lastUpdateTime" bigint DEFAULT 0,
  "lastprottectTime" bigint DEFAULT 0,
  CONSTRAINT "user_assets_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_assets_PRIMARY_pad" ON "cokdb1"."user_assets" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_auction" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "gold" bigint,
  CONSTRAINT "user_auction_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_auction_PRIMARY_pad" ON "cokdb1"."user_auction" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_auction_goods" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "gold" integer,
  CONSTRAINT "user_auction_goods_PRIMARY" PRIMARY KEY ("uid", "uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_auction_goods_PRIMARY_pad" ON "cokdb1"."user_auction_goods" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_auction_goods_key_user_auction_goods_uid" ON "cokdb1"."user_auction_goods" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_auction_history" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemNum" integer,
  "price" integer,
  "time" bigint NOT NULL,
  CONSTRAINT "user_auction_history_PRIMARY" PRIMARY KEY ("uid", "uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_auction_history_PRIMARY_pad" ON "cokdb1"."user_auction_history" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE UNIQUE INDEX "user_auction_history_unique_user_auction_history_uuid" ON "cokdb1"."user_auction_history" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_auction_history_key_user_auction_history_uid" ON "cokdb1"."user_auction_history" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_auth" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "female" integer,
  "sealId" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '',
  "seal" bigint DEFAULT 0,
  CONSTRAINT "user_auth_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_auth_PRIMARY_pad" ON "cokdb1"."user_auth" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" bigint DEFAULT 0 NOT NULL,
  "income" bigint DEFAULT 0 NOT NULL,
  "usable_income" bigint DEFAULT 0 NOT NULL,
  "last_income_time" bigint DEFAULT 0 NOT NULL,
  "last_effect_time" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "user_balance_PRIMARY" PRIMARY KEY ("uid", "type")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance"."type" IS '余额类型 0为金币';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance"."num" IS '当前本金';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance"."income" IS '总利息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance"."usable_income" IS '可用利息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance"."last_income_time" IS '最后结算利息时间 毫秒';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance"."last_effect_time" IS '最后播放特效时间';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_balance_PRIMARY_pad" ON "cokdb1"."user_balance" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_0" (
  "uuid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "bank_type" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" bigint DEFAULT 0 NOT NULL,
  "original_num" bigint DEFAULT 0 NOT NULL,
  "curr_sum" bigint DEFAULT 0 NOT NULL,
  "curr_charge0" bigint DEFAULT 0 NOT NULL,
  "curr_usable_income" bigint DEFAULT 0 NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_balance_history_0_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_0"."uuid" IS '唯一id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_0"."bank_type" IS '余额类型 0为金币';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_0"."type" IS '操作类型 0存、1取、2利息结算';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_0"."num" IS '操作数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_0"."original_num" IS '原始数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_0"."curr_sum" IS '操作完后的总金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_0"."curr_charge0" IS '操作完成后的未生效金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_0"."curr_usable_income" IS '操作完成后的可用利息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_0"."time" IS '操作时间 毫秒';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_0"."state" IS '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_balance_history_0_PRIMARY_pad" ON "cokdb1"."user_balance_history_0" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_0_uid_bank_type" ON "cokdb1"."user_balance_history_0" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("bank_type"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_0_time" ON "cokdb1"."user_balance_history_0" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_1" (
  "uuid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "bank_type" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" bigint DEFAULT 0 NOT NULL,
  "original_num" bigint DEFAULT 0 NOT NULL,
  "curr_sum" bigint DEFAULT 0 NOT NULL,
  "curr_charge0" bigint DEFAULT 0 NOT NULL,
  "curr_usable_income" bigint DEFAULT 0 NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_balance_history_1_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_1"."uuid" IS '唯一id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_1"."bank_type" IS '余额类型 0为金币';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_1"."type" IS '操作类型 0存、1取、2利息结算';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_1"."num" IS '操作数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_1"."original_num" IS '原始数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_1"."curr_sum" IS '操作完后的总金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_1"."curr_charge0" IS '操作完成后的未生效金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_1"."curr_usable_income" IS '操作完成后的可用利息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_1"."time" IS '操作时间 毫秒';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_1"."state" IS '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_balance_history_1_PRIMARY_pad" ON "cokdb1"."user_balance_history_1" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_1_uid_bank_type" ON "cokdb1"."user_balance_history_1" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("bank_type"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_1_time" ON "cokdb1"."user_balance_history_1" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_2" (
  "uuid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "bank_type" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" bigint DEFAULT 0 NOT NULL,
  "original_num" bigint DEFAULT 0 NOT NULL,
  "curr_sum" bigint DEFAULT 0 NOT NULL,
  "curr_charge0" bigint DEFAULT 0 NOT NULL,
  "curr_usable_income" bigint DEFAULT 0 NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_balance_history_2_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_2"."uuid" IS '唯一id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_2"."bank_type" IS '余额类型 0为金币';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_2"."type" IS '操作类型 0存、1取、2利息结算';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_2"."num" IS '操作数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_2"."original_num" IS '原始数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_2"."curr_sum" IS '操作完后的总金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_2"."curr_charge0" IS '操作完成后的未生效金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_2"."curr_usable_income" IS '操作完成后的可用利息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_2"."time" IS '操作时间 毫秒';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_2"."state" IS '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_balance_history_2_PRIMARY_pad" ON "cokdb1"."user_balance_history_2" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_2_uid_bank_type" ON "cokdb1"."user_balance_history_2" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("bank_type"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_2_time" ON "cokdb1"."user_balance_history_2" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_3" (
  "uuid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "bank_type" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" bigint DEFAULT 0 NOT NULL,
  "original_num" bigint DEFAULT 0 NOT NULL,
  "curr_sum" bigint DEFAULT 0 NOT NULL,
  "curr_charge0" bigint DEFAULT 0 NOT NULL,
  "curr_usable_income" bigint DEFAULT 0 NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_balance_history_3_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_3"."uuid" IS '唯一id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_3"."bank_type" IS '余额类型 0为金币';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_3"."type" IS '操作类型 0存、1取、2利息结算';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_3"."num" IS '操作数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_3"."original_num" IS '原始数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_3"."curr_sum" IS '操作完后的总金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_3"."curr_charge0" IS '操作完成后的未生效金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_3"."curr_usable_income" IS '操作完成后的可用利息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_3"."time" IS '操作时间 毫秒';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_3"."state" IS '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_balance_history_3_PRIMARY_pad" ON "cokdb1"."user_balance_history_3" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_3_uid_bank_type" ON "cokdb1"."user_balance_history_3" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("bank_type"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_3_time" ON "cokdb1"."user_balance_history_3" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_4" (
  "uuid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "bank_type" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" bigint DEFAULT 0 NOT NULL,
  "original_num" bigint DEFAULT 0 NOT NULL,
  "curr_sum" bigint DEFAULT 0 NOT NULL,
  "curr_charge0" bigint DEFAULT 0 NOT NULL,
  "curr_usable_income" bigint DEFAULT 0 NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_balance_history_4_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_4"."uuid" IS '唯一id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_4"."bank_type" IS '余额类型 0为金币';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_4"."type" IS '操作类型 0存、1取、2利息结算';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_4"."num" IS '操作数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_4"."original_num" IS '原始数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_4"."curr_sum" IS '操作完后的总金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_4"."curr_charge0" IS '操作完成后的未生效金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_4"."curr_usable_income" IS '操作完成后的可用利息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_4"."time" IS '操作时间 毫秒';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_4"."state" IS '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_balance_history_4_PRIMARY_pad" ON "cokdb1"."user_balance_history_4" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_4_uid_bank_type" ON "cokdb1"."user_balance_history_4" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("bank_type"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_4_time" ON "cokdb1"."user_balance_history_4" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_5" (
  "uuid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "bank_type" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" bigint DEFAULT 0 NOT NULL,
  "original_num" bigint DEFAULT 0 NOT NULL,
  "curr_sum" bigint DEFAULT 0 NOT NULL,
  "curr_charge0" bigint DEFAULT 0 NOT NULL,
  "curr_usable_income" bigint DEFAULT 0 NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_balance_history_5_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_5"."uuid" IS '唯一id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_5"."bank_type" IS '余额类型 0为金币';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_5"."type" IS '操作类型 0存、1取、2利息结算';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_5"."num" IS '操作数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_5"."original_num" IS '原始数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_5"."curr_sum" IS '操作完后的总金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_5"."curr_charge0" IS '操作完成后的未生效金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_5"."curr_usable_income" IS '操作完成后的可用利息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_5"."time" IS '操作时间 毫秒';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_5"."state" IS '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_balance_history_5_PRIMARY_pad" ON "cokdb1"."user_balance_history_5" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_5_uid_bank_type" ON "cokdb1"."user_balance_history_5" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("bank_type"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_5_time" ON "cokdb1"."user_balance_history_5" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_6" (
  "uuid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "bank_type" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" bigint DEFAULT 0 NOT NULL,
  "original_num" bigint DEFAULT 0 NOT NULL,
  "curr_sum" bigint DEFAULT 0 NOT NULL,
  "curr_charge0" bigint DEFAULT 0 NOT NULL,
  "curr_usable_income" bigint DEFAULT 0 NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_balance_history_6_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_6"."uuid" IS '唯一id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_6"."bank_type" IS '余额类型 0为金币';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_6"."type" IS '操作类型 0存、1取、2利息结算';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_6"."num" IS '操作数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_6"."original_num" IS '原始数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_6"."curr_sum" IS '操作完后的总金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_6"."curr_charge0" IS '操作完成后的未生效金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_6"."curr_usable_income" IS '操作完成后的可用利息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_6"."time" IS '操作时间 毫秒';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_6"."state" IS '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_balance_history_6_PRIMARY_pad" ON "cokdb1"."user_balance_history_6" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_6_uid_bank_type" ON "cokdb1"."user_balance_history_6" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("bank_type"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_6_time" ON "cokdb1"."user_balance_history_6" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_7" (
  "uuid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "bank_type" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" bigint DEFAULT 0 NOT NULL,
  "original_num" bigint DEFAULT 0 NOT NULL,
  "curr_sum" bigint DEFAULT 0 NOT NULL,
  "curr_charge0" bigint DEFAULT 0 NOT NULL,
  "curr_usable_income" bigint DEFAULT 0 NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_balance_history_7_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_7"."uuid" IS '唯一id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_7"."bank_type" IS '余额类型 0为金币';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_7"."type" IS '操作类型 0存、1取、2利息结算';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_7"."num" IS '操作数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_7"."original_num" IS '原始数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_7"."curr_sum" IS '操作完后的总金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_7"."curr_charge0" IS '操作完成后的未生效金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_7"."curr_usable_income" IS '操作完成后的可用利息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_7"."time" IS '操作时间 毫秒';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_7"."state" IS '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_balance_history_7_PRIMARY_pad" ON "cokdb1"."user_balance_history_7" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_7_uid_bank_type" ON "cokdb1"."user_balance_history_7" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("bank_type"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_7_time" ON "cokdb1"."user_balance_history_7" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_8" (
  "uuid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "bank_type" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" bigint DEFAULT 0 NOT NULL,
  "original_num" bigint DEFAULT 0 NOT NULL,
  "curr_sum" bigint DEFAULT 0 NOT NULL,
  "curr_charge0" bigint DEFAULT 0 NOT NULL,
  "curr_usable_income" bigint DEFAULT 0 NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_balance_history_8_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_8"."uuid" IS '唯一id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_8"."bank_type" IS '余额类型 0为金币';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_8"."type" IS '操作类型 0存、1取、2利息结算';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_8"."num" IS '操作数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_8"."original_num" IS '原始数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_8"."curr_sum" IS '操作完后的总金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_8"."curr_charge0" IS '操作完成后的未生效金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_8"."curr_usable_income" IS '操作完成后的可用利息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_8"."time" IS '操作时间 毫秒';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_8"."state" IS '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_balance_history_8_PRIMARY_pad" ON "cokdb1"."user_balance_history_8" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_8_uid_bank_type" ON "cokdb1"."user_balance_history_8" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("bank_type"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_8_time" ON "cokdb1"."user_balance_history_8" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_balance_history_9" (
  "uuid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "bank_type" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "num" bigint DEFAULT 0 NOT NULL,
  "original_num" bigint DEFAULT 0 NOT NULL,
  "curr_sum" bigint DEFAULT 0 NOT NULL,
  "curr_charge0" bigint DEFAULT 0 NOT NULL,
  "curr_usable_income" bigint DEFAULT 0 NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_balance_history_9_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_9"."uuid" IS '唯一id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_9"."bank_type" IS '余额类型 0为金币';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_9"."type" IS '操作类型 0存、1取、2利息结算';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_9"."num" IS '操作数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_9"."original_num" IS '原始数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_9"."curr_sum" IS '操作完后的总金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_9"."curr_charge0" IS '操作完成后的未生效金额';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_9"."curr_usable_income" IS '操作完成后的可用利息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_9"."time" IS '操作时间 毫秒';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_balance_history_9"."state" IS '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_balance_history_9_PRIMARY_pad" ON "cokdb1"."user_balance_history_9" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_9_uid_bank_type" ON "cokdb1"."user_balance_history_9" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("bank_type"));
--> statement-breakpoint
CREATE INDEX "user_balance_history_9_time" ON "cokdb1"."user_balance_history_9" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_bank" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer DEFAULT 0 NOT NULL,
  "deposit" text COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_bank_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_bank_PRIMARY_pad" ON "cokdb1"."user_bank" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_bet" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci",
  "matchId" character varying(255) COLLATE "legacy_meta"."ci",
  "vs" character varying(100) COLLATE "legacy_meta"."ci",
  "resourceType" integer,
  "betNum" integer,
  "betSide" character varying(50) COLLATE "legacy_meta"."ci",
  "winner" character varying(50) COLLATE "legacy_meta"."ci",
  "ended" integer DEFAULT 0,
  "rewarded" integer DEFAULT 0,
  "odds" numeric(10,2),
  CONSTRAINT "user_bet_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_bet_PRIMARY_pad" ON "cokdb1"."user_bet" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_bet_idx_uid" ON "cokdb1"."user_bet" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_bet_idx_mid" ON "cokdb1"."user_bet" ((rtrim("matchId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_bet_idx_e" ON "cokdb1"."user_bet" (("ended"));
--> statement-breakpoint
CREATE INDEX "user_bet_idx_r" ON "cokdb1"."user_bet" (("rewarded"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_bottle_info" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "throwRemainCount" integer DEFAULT 0 NOT NULL,
  "pickRemainCount" integer DEFAULT 0 NOT NULL,
  "myBottleNum" integer DEFAULT 0 NOT NULL,
  "lastClearTime" bigint DEFAULT 0 NOT NULL,
  "pickBottlesUidsByteArray" bytea,
  CONSTRAINT "user_bottle_info_pickBottlesUidsByteArray_length" CHECK (octet_length("pickBottlesUidsByteArray") <= 65535),
  CONSTRAINT "user_bottle_info_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_bottle_info_PRIMARY_pad" ON "cokdb1"."user_bottle_info" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_branch_city_info" (
  "uid" character varying(32) COLLATE "legacy_meta"."ci" NOT NULL,
  "openstate" smallint NOT NULL,
  "takerewardcount" integer NOT NULL,
  "takerewardtime" bigint,
  CONSTRAINT "user_branch_city_info_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_branch_city_info_PRIMARY_pad" ON "cokdb1"."user_branch_city_info" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_branch_city_reward" (
  "id" integer DEFAULT 0 NOT NULL,
  "uid" character varying(32) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "configid" integer NOT NULL,
  "dieawaytime" bigint,
  "rewardrefreashtime" bigint
);
--> statement-breakpoint
CREATE INDEX "user_branch_city_reward_uid_id_index" ON "cokdb1"."user_branch_city_reward" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("id"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_building" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "pos" integer NOT NULL,
  "level" integer NOT NULL,
  "opType" integer DEFAULT 0,
  "putId" character varying(100) COLLATE "legacy_meta"."ci",
  "reward" integer DEFAULT 0,
  "refreshTime" bigint,
  "updateTime" bigint DEFAULT 0,
  "effectTime" bigint DEFAULT 0,
  "star" integer DEFAULT 0,
  "progress" integer DEFAULT 0,
  "unlockFlag" integer DEFAULT 0 NOT NULL,
  "costUnlockTimes" integer DEFAULT 0,
  CONSTRAINT "user_building_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_building_PRIMARY_pad" ON "cokdb1"."user_building" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_building_ub_uid_index" ON "cokdb1"."user_building" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "user_building_item_index" ON "cokdb1"."user_building" (("itemId"));
--> statement-breakpoint
CREATE INDEX "user_building_itemId_level_index" ON "cokdb1"."user_building" (("itemId"), ("level"));
--> statement-breakpoint
CREATE INDEX "user_building_itemId_star_index" ON "cokdb1"."user_building" (("itemId"), ("star"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_building_bak" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "pos" integer NOT NULL,
  "level" integer NOT NULL,
  "opType" integer DEFAULT 0,
  "putId" character varying(100) COLLATE "legacy_meta"."ci",
  "reward" integer DEFAULT 0,
  "refreshTime" bigint,
  "updateTime" bigint DEFAULT 0,
  "effectTime" bigint DEFAULT 0,
  "star" integer DEFAULT 0,
  "progress" integer DEFAULT 0,
  CONSTRAINT "user_building_bak_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_building_bak_PRIMARY_pad" ON "cokdb1"."user_building_bak" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_building_bak_ub_uid_index" ON "cokdb1"."user_building_bak" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("itemId"));
--> statement-breakpoint
CREATE INDEX "user_building_bak_item_index" ON "cokdb1"."user_building_bak" (("itemId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_building_exp" (
  "uid" character varying(255) COLLATE "legacy_meta"."sv_ci" NOT NULL,
  "historyMax" bigint DEFAULT 0,
  "currentMax" bigint DEFAULT 0,
  CONSTRAINT "user_building_exp_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_building_exp_PRIMARY_pad" ON "cokdb1"."user_building_exp" ((rtrim("uid", ' ') COLLATE "legacy_meta"."sv_ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_cemetery" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "deadSum" bigint DEFAULT 0,
  "deadAbilityValue" bigint DEFAULT 0,
  "contributionValue" integer DEFAULT 0 NOT NULL,
  "needContributionValue" integer DEFAULT 0 NOT NULL,
  "contributionStage" integer DEFAULT 0 NOT NULL,
  "useItemSum" integer DEFAULT 0 NOT NULL,
  "pubDeadInfo" character varying(1500) COLLATE "legacy_meta"."ci" NOT NULL,
  "priDeadInfo" character varying(1500) COLLATE "legacy_meta"."ci" NOT NULL,
  "reviveAbilityValue" bigint DEFAULT 0,
  "tempReviveInfo" character varying(1500) COLLATE "legacy_meta"."ci",
  "isPriInfoEmpty" integer DEFAULT 0,
  "reviveSumThisTime" integer DEFAULT 0,
  "freedata" character varying(1500) COLLATE "legacy_meta"."ci",
  "revived" text COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_cemetery_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery"."deadSum" IS '个人亡兵总数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery"."deadAbilityValue" IS '个人亡兵战斗力';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery"."contributionValue" IS '个人贡献数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery"."needContributionValue" IS '需要贡献数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery"."contributionStage" IS '个人贡献阶段';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery"."useItemSum" IS '使用道具的数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery"."pubDeadInfo" IS '公共复活信息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery"."priDeadInfo" IS '个人复活信息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery"."reviveAbilityValue" IS '已经复活的亡兵战斗力总数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery"."tempReviveInfo" IS '个人墓地本次的复活信息';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery"."isPriInfoEmpty" IS '个人墓地是否为空';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery"."reviveSumThisTime" IS '个人墓地本次可以复活多少人';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_cemetery_PRIMARY_pad" ON "cokdb1"."user_cemetery" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_cemetery_history" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "deadSum" bigint NOT NULL,
  "reviveSum" bigint NOT NULL,
  "useItemSum" integer NOT NULL,
  "mainBuildingLevel" integer NOT NULL,
  "rechargeSum" integer NOT NULL,
  CONSTRAINT "user_cemetery_history_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery_history"."uid" IS '玩家uid';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery_history"."name" IS '玩家昵称';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery_history"."deadSum" IS '死兵总数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery_history"."reviveSum" IS '复活总数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery_history"."useItemSum" IS '使用物品总数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery_history"."mainBuildingLevel" IS '城堡等级';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_cemetery_history"."rechargeSum" IS '充值总数';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_cemetery_history_PRIMARY_pad" ON "cokdb1"."user_cemetery_history" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_civilization_prestige" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "civilizationType" integer NOT NULL,
  "prestigeValue" bigint DEFAULT 0,
  "periodicLimitValue" integer DEFAULT 0,
  "updateTime" bigint DEFAULT 0,
  "rewardLv" integer DEFAULT 0,
  "actionLimits" character varying(3000) COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_civilization_prestige_PRIMARY" PRIMARY KEY ("uid", "civilizationType")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_civilization_prestige_PRIMARY_pad" ON "cokdb1"."user_civilization_prestige" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("civilizationType"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_civilization_science" (
  "baseItemID" integer NOT NULL,
  "userID" character varying(64) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer,
  CONSTRAINT "user_civilization_science_PRIMARY" PRIMARY KEY ("baseItemID", "userID")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_civilization_science_PRIMARY_pad" ON "cokdb1"."user_civilization_science" (("baseItemID"), (rtrim("userID", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_collect_record" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "resource" integer DEFAULT 0,
  "killPeople" integer,
  "train" integer,
  "lastKillTime" bigint,
  "sockByResource" integer,
  "sockByKill" integer,
  "sockByTrain" integer,
  CONSTRAINT "user_collect_record_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_collect_record_PRIMARY_pad" ON "cokdb1"."user_collect_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_comeback_record" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "configId" character varying(11) COLLATE "legacy_meta"."ci" NOT NULL,
  "backType" integer DEFAULT 0 NOT NULL,
  "backTime" bigint DEFAULT 0 NOT NULL,
  "backReward" smallint DEFAULT 0 NOT NULL,
  "dailyReward" character varying(30) COLLATE "legacy_meta"."ci",
  "payReward" character varying(100) COLLATE "legacy_meta"."ci",
  "payTotal" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "user_comeback_record_backReward_range" CHECK ("backReward" BETWEEN -128 AND 127),
  CONSTRAINT "user_comeback_record_PRIMARY" PRIMARY KEY ("uid", "configId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_comeback_record_PRIMARY_pad" ON "cokdb1"."user_comeback_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("configId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_continue_pay" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "productId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "goldCount" integer DEFAULT 0,
  "status" integer,
  "updateTime" bigint,
  CONSTRAINT "user_continue_pay_PRIMARY" PRIMARY KEY ("uid", "productId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_continue_pay_PRIMARY_pad" ON "cokdb1"."user_continue_pay" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("productId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_cross_fight_history" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "startTime" bigint NOT NULL,
  "round" integer NOT NULL,
  "score" bigint DEFAULT 0,
  "rank" integer DEFAULT 0,
  "serverId" integer NOT NULL,
  "worldId" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_cross_fight_history_PRIMARY" PRIMARY KEY ("uid", "startTime", "round", "worldId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_cross_fight_history_PRIMARY_pad" ON "cokdb1"."user_cross_fight_history" ((rtrim("uid", ' ') COLLATE "C"), ("startTime"), ("round"), ("worldId"));
--> statement-breakpoint
CREATE INDEX "user_cross_fight_history_user_startTime" ON "cokdb1"."user_cross_fight_history" ((rtrim("uid", ' ') COLLATE "C"), ("startTime"));
--> statement-breakpoint
CREATE INDEX "user_cross_fight_history_startTime" ON "cokdb1"."user_cross_fight_history" (("startTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_cross_server" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "fromServerId" integer,
  "time" bigint,
  CONSTRAINT "user_cross_server_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_cross_server_PRIMARY_pad" ON "cokdb1"."user_cross_server" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_cross_throne" (
  "id" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 2347) NOT NULL,
  "uid" character varying(128) COLLATE "legacy_meta"."ci",
  "totalKills" bigint DEFAULT 0,
  "totalDeads" bigint,
  "kingdomFightIndex" integer,
  "startTime" bigint,
  "name" character varying(128) COLLATE "legacy_meta"."ci",
  "allianceName" character varying(128) COLLATE "legacy_meta"."ci",
  "abbr" character varying(128) COLLATE "legacy_meta"."ci",
  "kingdomName" character varying(128) COLLATE "legacy_meta"."ci",
  "serverId" integer,
  "deadDetail" character varying(1024) COLLATE "legacy_meta"."ci",
  "deadDetailBak" character varying(1024) COLLATE "legacy_meta"."ci",
  "hasCemeteryCollected" bigint DEFAULT 0,
  CONSTRAINT "user_cross_throne_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_daily_task" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "times" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_daily_task_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_daily_task_PRIMARY_pad" ON "cokdb1"."user_daily_task" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_device_bind_hide" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "hideUid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint,
  CONSTRAINT "user_device_bind_hide_PRIMARY" PRIMARY KEY ("uid", "hideUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_device_bind_hide_PRIMARY_pad" ON "cokdb1"."user_device_bind_hide" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("hideUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_dragon" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer NOT NULL,
  "level" integer NOT NULL,
  "exp" integer NOT NULL,
  "place" character varying(100) COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_dragon_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_dragon_PRIMARY_pad" ON "cokdb1"."user_dragon" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_dragon_uid_index" ON "cokdb1"."user_dragon" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_dragon_battle" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "freeTeleport" integer DEFAULT 0,
  "leaveTime" bigint DEFAULT 0,
  CONSTRAINT "user_dragon_battle_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_dragon_battle_PRIMARY_pad" ON "cokdb1"."user_dragon_battle" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_egg" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "eggId" character varying(10) COLLATE "legacy_meta"."ci" NOT NULL,
  "goods" character varying(200) COLLATE "legacy_meta"."ci" NOT NULL,
  "reward" integer DEFAULT 0,
  CONSTRAINT "user_egg_PRIMARY" PRIMARY KEY ("uid", "eggId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_egg_PRIMARY_pad" ON "cokdb1"."user_egg" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("eggId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_equip" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "on" integer DEFAULT 0 NOT NULL,
  "generalid" integer DEFAULT 0,
  "itemId" integer DEFAULT 0 NOT NULL,
  "cost" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "extraProperty" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "refineProperty" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "lockProperty" character varying(255) COLLATE "legacy_meta"."ci",
  "showSign" integer DEFAULT 1,
  "reforgeCount" integer DEFAULT 0,
  "strengthLevel" integer DEFAULT 0 NOT NULL,
  "crystalCharge" integer DEFAULT 0 NOT NULL,
  "darkCrystalCharge" integer DEFAULT 0 NOT NULL,
  "chargeType" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_equip_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_equip"."showSign" IS 'æ˜¾ç¤ºæ ‡è¯†ï¼Œ0ä¸æ˜¾ç¤ºï¼Œ1æ˜¾ç¤º';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_equip_PRIMARY_pad" ON "cokdb1"."user_equip" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_equip_index_uid_on" ON "cokdb1"."user_equip" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("on"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_equip_bak" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "on" integer DEFAULT 0 NOT NULL,
  "itemId" integer DEFAULT 0 NOT NULL,
  "cost" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "extraProperty" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "refineProperty" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  CONSTRAINT "user_equip_bak_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_equip_bak_PRIMARY_pad" ON "cokdb1"."user_equip_bak" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_equip_bak_index_uid_on" ON "cokdb1"."user_equip_bak" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("on"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_exchange_cycle" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "stage" integer DEFAULT 0,
  "totalstage" integer DEFAULT 0,
  "waittime" bigint DEFAULT 0,
  "totalstage1" integer DEFAULT 0,
  "waittime1" bigint DEFAULT 0,
  "totalstage2" integer DEFAULT 0,
  "waittime2" bigint DEFAULT 0,
  "exchanges" character varying(200) COLLATE "legacy_meta"."ci",
  "stage1" integer DEFAULT 0,
  "stage2" integer DEFAULT 0,
  "cdtime" bigint DEFAULT -1,
  "cdtime1" bigint DEFAULT -1,
  "cdtime2" bigint DEFAULT -1,
  "receive_reward" character varying(255) COLLATE "legacy_meta"."ci",
  "receive_reward1" character varying(255) COLLATE "legacy_meta"."ci",
  "receive_reward2" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_exchange_cycle_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_exchange_cycle"."receive_reward" IS '领取阶段奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_exchange_cycle"."receive_reward1" IS '领取阶段奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_exchange_cycle"."receive_reward2" IS '领取阶段奖励';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_exchange_cycle_PRIMARY_pad" ON "cokdb1"."user_exchange_cycle" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_expedition_info" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "recieveResource" bigint DEFAULT 0 NOT NULL,
  "lastClearTime" bigint DEFAULT 0 NOT NULL,
  "isTakeAward1" smallint DEFAULT 0 NOT NULL,
  "isTakeAward2" smallint DEFAULT 0 NOT NULL,
  "isTakeAward3" smallint DEFAULT 0 NOT NULL,
  "takeTime1" bigint DEFAULT 0 NOT NULL,
  "takeTime2" bigint DEFAULT 0 NOT NULL,
  "takeTime3" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "user_expedition_info_isTakeAward1_range" CHECK ("isTakeAward1" BETWEEN -128 AND 127),
  CONSTRAINT "user_expedition_info_isTakeAward2_range" CHECK ("isTakeAward2" BETWEEN -128 AND 127),
  CONSTRAINT "user_expedition_info_isTakeAward3_range" CHECK ("isTakeAward3" BETWEEN -128 AND 127),
  CONSTRAINT "user_expedition_info_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_expedition_info_PRIMARY_pad" ON "cokdb1"."user_expedition_info" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_expedition_score" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "score" double precision DEFAULT 0,
  CONSTRAINT "user_expedition_score_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_expedition_score_PRIMARY_pad" ON "cokdb1"."user_expedition_score" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_general" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "generalId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "color" integer,
  "status" integer NOT NULL,
  "level" integer NOT NULL,
  "exp" integer DEFAULT 0,
  "time" bigint DEFAULT 0,
  "ability" bytea,
  "abilityIndex" integer DEFAULT 1,
  "plusSkillPoint" integer DEFAULT 0,
  CONSTRAINT "user_general_ability_length" CHECK (octet_length("ability") <= 65535),
  CONSTRAINT "user_general_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_general"."plusSkillPoint" IS '通过物品增加的技能点';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_general_PRIMARY_pad" ON "cokdb1"."user_general" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_general_uid_index_001" ON "cokdb1"."user_general" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_gift" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "giftId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "gifttype" integer NOT NULL,
  "valid" integer DEFAULT 1 NOT NULL,
  "level" integer,
  "item" character varying(255) COLLATE "legacy_meta"."ci",
  "num" integer,
  "para" integer DEFAULT 0,
  "time" bigint NOT NULL,
  "expiretime" integer,
  "exp" integer DEFAULT 0,
  "description" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_gift_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_gift_PRIMARY_pad" ON "cokdb1"."user_gift" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_gift_vote" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "version" integer NOT NULL,
  "type" integer NOT NULL,
  "giftId" integer NOT NULL,
  "time" bigint,
  CONSTRAINT "user_gift_vote_PRIMARY" PRIMARY KEY ("uid", "version", "type", "giftId")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gift_vote"."type" IS '1: 预览、2：投票';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_gift_vote_PRIMARY_pad" ON "cokdb1"."user_gift_vote" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("version"), ("type"), ("giftId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_glory_info" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "strengthenCount" integer NOT NULL,
  "strengthenTime" bigint NOT NULL,
  "expeditionVictoryTimes" integer DEFAULT -1 NOT NULL,
  "weaknessTime" bigint,
  CONSTRAINT "user_glory_info_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_glory_info_PRIMARY_pad" ON "cokdb1"."user_glory_info" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_gold_group_buy" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "buy_time" bigint DEFAULT 0 NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "discount" integer DEFAULT 0 NOT NULL,
  "group_coupon_num" integer DEFAULT 0 NOT NULL,
  "isMail" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_gold_group_buy_PRIMARY" PRIMARY KEY ("uid", "id", "buy_time")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_group_buy"."id" IS '购买物品的静态表id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_group_buy"."buy_time" IS '购买时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_group_buy"."num" IS '购买物品数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_group_buy"."discount" IS '折扣比例分母为100';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_group_buy"."group_coupon_num" IS '使用团购券折数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_group_buy"."isMail" IS '是否发送奖励';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_gold_group_buy_PRIMARY_pad" ON "cokdb1"."user_gold_group_buy" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"), ("buy_time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_gold_wheel" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
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
  "rewardFlags" character varying(200) COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_gold_wheel_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel"."normal_last_free_millis" IS '最后一次获得免费次数时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel"."silver_usable" IS '可用次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel"."silver_usable_free" IS '可用免费次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel"."silver_daily" IS '当天开启次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel"."silver_total" IS '总使用次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel"."silver_last_add_millis" IS '最后一次次数获取时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel"."silver_last_free_millis" IS '最后一次获得免费次数时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel"."gold_daily" IS '当天开启次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel"."gold_usable" IS '可用次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel"."gold_total" IS '总使用次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel"."gold_last_add_millis" IS '最后一次次数获取时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel"."last_normal_wheel_millis" IS '最后一次普通转盘时间';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_gold_wheel_PRIMARY_pad" ON "cokdb1"."user_gold_wheel" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_gold_wheel_histo" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
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
  CONSTRAINT "user_gold_wheel_histo_create_time_temporal" CHECK (legacy_meta.valid_temporal("create_time", 'datetime', 0))
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel_histo"."silver_usable" IS '可用次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel_histo"."silver_usable_free" IS '可用免费次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel_histo"."silver_daily" IS '当天开启次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel_histo"."silver_total" IS '总使用次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel_histo"."silver_last_add_millis" IS '最后一次次数获取时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel_histo"."gold_daily" IS '当天开启次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel_histo"."gold_usable" IS '可用次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel_histo"."gold_total" IS '总使用次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel_histo"."gold_last_add_millis" IS '最后一次次数获取时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_gold_wheel_histo"."last_normal_wheel_millis" IS '最后一次普通转盘时间';
--> statement-breakpoint
CREATE INDEX "user_gold_wheel_histo_uid" ON "cokdb1"."user_gold_wheel_histo" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_grant_title" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "endtime" bigint DEFAULT 0 NOT NULL,
  "targetuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  CONSTRAINT "user_grant_title_PRIMARY" PRIMARY KEY ("uid", "endtime", "targetuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_grant_title"."endtime" IS '结束的时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_grant_title"."targetuid" IS '目标玩家';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_grant_title_PRIMARY_pad" ON "cokdb1"."user_grant_title" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("endtime"), (rtrim("targetuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_growth_fund" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "itemId" character varying(40) COLLATE "legacy_meta"."ci",
  "buyTime" bigint,
  "extra" text COLLATE "legacy_meta"."ci",
  "status" integer,
  CONSTRAINT "user_growth_fund_PRIMARY" PRIMARY KEY ("uid", "type")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_growth_fund_PRIMARY_pad" ON "cokdb1"."user_growth_fund" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_hero" (
  "ownerUid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "heroUid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
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
  "lastKillerUid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '',
  CONSTRAINT "user_hero_PRIMARY" PRIMARY KEY ("heroUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_hero_PRIMARY_pad" ON "cokdb1"."user_hero" ((rtrim("heroUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_hero_ownerUid_index" ON "cokdb1"."user_hero" ((rtrim("ownerUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_honor" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" character varying(50) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "level" integer,
  CONSTRAINT "user_honor_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_honor_PRIMARY_pad" ON "cokdb1"."user_honor" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_hospital" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "armyId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "dead" integer DEFAULT 0 NOT NULL,
  "heal" integer DEFAULT 0 NOT NULL,
  "finishTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "user_hospital_PRIMARY" PRIMARY KEY ("uid", "armyId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_hospital_PRIMARY_pad" ON "cokdb1"."user_hospital" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("armyId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_hot_item" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "price" integer,
  "num" integer,
  "refreshTime" bigint,
  CONSTRAINT "user_hot_item_PRIMARY" PRIMARY KEY ("uid", "itemId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_hot_item_PRIMARY_pad" ON "cokdb1"."user_hot_item" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_hot_item_best" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "goodsId" character varying(20) COLLATE "C" NOT NULL,
  "color" integer DEFAULT 0,
  "price_type" integer DEFAULT 0,
  "price" integer DEFAULT 0,
  "price_hot" integer DEFAULT 0,
  CONSTRAINT "user_hot_item_best_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_hot_item_best_PRIMARY_pad" ON "cokdb1"."user_hot_item_best" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_hot_item_best_v3" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "goodsId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "color" smallint,
  "price_type" integer,
  "price" integer,
  "price_hot" integer,
  CONSTRAINT "user_hot_item_best_v3_color_range" CHECK ("color" BETWEEN -128 AND 127),
  CONSTRAINT "user_hot_item_best_v3_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_hot_item_best_v3_PRIMARY_pad" ON "cokdb1"."user_hot_item_best_v3" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_hot_item_v2" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "goodsId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(20) COLLATE "legacy_meta"."ci",
  "priceType" integer,
  "price" integer NOT NULL,
  "price_hot" integer DEFAULT 0,
  "num" integer,
  "refreshTime" bigint,
  "para1" integer DEFAULT 0,
  CONSTRAINT "user_hot_item_v2_PRIMARY" PRIMARY KEY ("uid", "goodsId", "price")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_hot_item_v2_PRIMARY_pad" ON "cokdb1"."user_hot_item_v2" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("goodsId", ' ') COLLATE "legacy_meta"."ci"), ("price"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_hot_item_v3" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "goodsId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "priceType" integer,
  "price" integer NOT NULL,
  "price_hot" integer,
  "num" integer,
  "refreshTime" bigint,
  "para1" integer,
  "type" smallint,
  CONSTRAINT "user_hot_item_v3_type_range" CHECK ("type" BETWEEN -128 AND 127),
  CONSTRAINT "user_hot_item_v3_PRIMARY" PRIMARY KEY ("uid", "goodsId", "price")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_hot_item_v3_PRIMARY_pad" ON "cokdb1"."user_hot_item_v3" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("goodsId", ' ') COLLATE "legacy_meta"."ci"), ("price"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_item" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "ownerId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "count" integer DEFAULT 0 NOT NULL,
  "value" integer,
  "vanishTime" bigint DEFAULT 0,
  CONSTRAINT "user_item_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_item_PRIMARY_pad" ON "cokdb1"."user_item" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_item_uitem_ownerId_index" ON "cokdb1"."user_item" ((rtrim("ownerId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"), ("value"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_item_bak" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "ownerId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "count" integer DEFAULT 0 NOT NULL,
  "value" integer,
  "vanishTime" bigint DEFAULT 0,
  CONSTRAINT "user_item_bak_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_item_bak_PRIMARY_pad" ON "cokdb1"."user_item_bak" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_item_bak_uitem_ownerId_index" ON "cokdb1"."user_item_bak" ((rtrim("ownerId", ' ') COLLATE "legacy_meta"."ci"), (rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"), ("value"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_item_cd" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "useTime" bigint NOT NULL,
  CONSTRAINT "user_item_cd_PRIMARY" PRIMARY KEY ("uid", "itemId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_item_cd_PRIMARY_pad" ON "cokdb1"."user_item_cd" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_king_skill" (
  "uuid" character varying(128) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(128) COLLATE "legacy_meta"."ci" NOT NULL,
  "skillId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "startTime" bigint,
  "level" integer,
  "endTime" bigint,
  "todayUseTimes" integer DEFAULT 0 NOT NULL,
  "checkDay" bigint DEFAULT 0,
  "hasDonatedMaterial" integer DEFAULT 0 NOT NULL,
  "isSuccessLast" integer DEFAULT 1,
  CONSTRAINT "user_king_skill_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_king_skill_PRIMARY_pad" ON "cokdb1"."user_king_skill" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_knight_title" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "activity_title" integer NOT NULL,
  "unlock_title" bytea,
  "contract_activity_title" integer DEFAULT -1 NOT NULL,
  "contract_unlock_title" bytea,
  "normal_unlock_title" bytea,
  "activeshortCut" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  CONSTRAINT "user_knight_title_unlock_title_length" CHECK (octet_length("unlock_title") <= 65535),
  CONSTRAINT "user_knight_title_contract_unlock_title_length" CHECK (octet_length("contract_unlock_title") <= 65535),
  CONSTRAINT "user_knight_title_normal_unlock_title_length" CHECK (octet_length("normal_unlock_title") <= 65535),
  CONSTRAINT "user_knight_title_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_knight_title_PRIMARY_pad" ON "cokdb1"."user_knight_title" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_login_ip" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "ip" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "count" integer,
  CONSTRAINT "user_login_ip_PRIMARY" PRIMARY KEY ("uid", "ip")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_login_ip_PRIMARY_pad" ON "cokdb1"."user_login_ip" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("ip", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_login_ip_index_uid_count" ON "cokdb1"."user_login_ip" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("count"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_lord" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "userSign" character varying(50) COLLATE "legacy_meta"."ci",
  "medal" character varying(50) COLLATE "legacy_meta"."ci",
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
  CONSTRAINT "user_lord_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_lord"."newSerCumRechargeTotal" IS '新服累计充值';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_lord_PRIMARY_pad" ON "cokdb1"."user_lord" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_lottery" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "lotteryId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "times" integer,
  "updateTime" bigint,
  CONSTRAINT "user_lottery_PRIMARY" PRIMARY KEY ("uid", "lotteryId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_lottery_PRIMARY_pad" ON "cokdb1"."user_lottery" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("lotteryId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_luck_draw" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer NOT NULL,
  "count" integer,
  "upTime" bigint,
  "randTime" bigint,
  "reward" character varying(1000) COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_luck_draw_PRIMARY" PRIMARY KEY ("uid", "type")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_luck_draw_PRIMARY_pad" ON "cokdb1"."user_luck_draw" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_military" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "score" numeric(11,2) DEFAULT 0.00,
  "honor" numeric(11,2) DEFAULT 0.00,
  "exp" integer NOT NULL,
  "level" integer NOT NULL,
  "lastLevel" integer DEFAULT 0,
  "lastScore" numeric(11,2) DEFAULT 0.00,
  "skillStr" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "lastCashTime" bigint DEFAULT 0 NOT NULL,
  "lastResetTime" bigint DEFAULT 0 NOT NULL,
  "honorThisWeek" numeric(11,2) DEFAULT 0.00,
  CONSTRAINT "user_military_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_military_PRIMARY_pad" ON "cokdb1"."user_military" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_military_military_score_index" ON "cokdb1"."user_military" (("score"));
--> statement-breakpoint
CREATE INDEX "user_military_military_exp_index" ON "cokdb1"."user_military" (("exp"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_military_rank" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "militaryScore" numeric(11,2) DEFAULT 0.00,
  "honor" numeric(11,2) DEFAULT 0.00,
  "rankingExp" integer NOT NULL,
  "militaryRank" integer NOT NULL,
  "award" character varying(500) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "lastRanking" integer DEFAULT 0,
  "lastMilitaryScore" numeric(11,2) DEFAULT 0.00,
  "skill" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "status" integer DEFAULT 1 NOT NULL,
  "lastTimeSet0Tostatus" bigint DEFAULT 0 NOT NULL,
  "awardReceived" integer DEFAULT 1 NOT NULL,
  "lastTimeReset" bigint DEFAULT 0 NOT NULL,
  "maxHonorWeekly" numeric(11,2) DEFAULT 0.00,
  "lastRewardTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "user_military_rank_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_military_rank_PRIMARY_pad" ON "cokdb1"."user_military_rank" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_military_rank_index_militaryScore" ON "cokdb1"."user_military_rank" (("militaryScore"));
--> statement-breakpoint
CREATE INDEX "user_military_rank_index_rankingExp" ON "cokdb1"."user_military_rank" (("rankingExp"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_mine" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "fId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" integer DEFAULT 0,
  "level" integer,
  "call" integer DEFAULT 0,
  "exp" integer,
  "miner" integer DEFAULT 0,
  "mineTime" bigint,
  "helpInfo" bytea,
  CONSTRAINT "user_mine_helpInfo_length" CHECK (octet_length("helpInfo") <= 65535),
  CONSTRAINT "user_mine_PRIMARY" PRIMARY KEY ("uid", "fId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_mine_PRIMARY_pad" ON "cokdb1"."user_mine" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("fId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_mine_index_fId" ON "cokdb1"."user_mine" ((rtrim("fId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_miracle_buff_active" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" smallint,
  CONSTRAINT "user_miracle_buff_active_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_miracle_buff_active_PRIMARY_pad" ON "cokdb1"."user_miracle_buff_active" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_mixed_info" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
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
  "dailyTaskId" character varying(320) COLLATE "legacy_meta"."ci" DEFAULT '',
  "clientRecord" character varying(4000) COLLATE "legacy_meta"."ci" DEFAULT '',
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
  "skin" character varying(320) COLLATE "legacy_meta"."ci" DEFAULT '',
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
  "mdata" text COLLATE "legacy_meta"."ci" NOT NULL,
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
  CONSTRAINT "user_mixed_info_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_mixed_info"."clientRecord" IS 'role guide mark';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_mixed_info"."shippingTradeInvest" IS '海运贸易投资';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_mixed_info"."shippingTradeInvestGold" IS '海运贸易投资';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_mixed_info"."mdata" IS '字符集2的16次方-1';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_mixed_info_PRIMARY_pad" ON "cokdb1"."user_mixed_info" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_mixed_info_protectEndTime" ON "cokdb1"."user_mixed_info" (("protectEndTime"));
--> statement-breakpoint
CREATE INDEX "user_mixed_info_protectEndSendTimes" ON "cokdb1"."user_mixed_info" (("protectEndSendTimes"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_monster_siege" (
  "uid" character varying(40) COLLATE "C" NOT NULL,
  "failTimes" integer DEFAULT 0,
  "killMonsterCount" bigint DEFAULT 0,
  "state" integer NOT NULL,
  "goalRank" integer DEFAULT 0,
  "failRounds" character varying(100) COLLATE "C",
  "isfinish" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_monster_siege_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_monster_siege_PRIMARY_pad" ON "cokdb1"."user_monster_siege" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "user_monster_siege_state_index" ON "cokdb1"."user_monster_siege" (("state"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_monster_siege_data" (
  "uid" character varying(40) COLLATE "C" NOT NULL,
  "failTimes" integer DEFAULT 0,
  "killMonsterCount" bigint DEFAULT 0,
  "state" integer NOT NULL,
  "goalRank" integer DEFAULT 0,
  "failRounds" character varying(100) COLLATE "C",
  "recordTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "user_monster_siege_data_PRIMARY" PRIMARY KEY ("uid", "recordTime")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_monster_siege_data_PRIMARY_pad" ON "cokdb1"."user_monster_siege_data" ((rtrim("uid", ' ') COLLATE "C"), ("recordTime"));
--> statement-breakpoint
CREATE INDEX "user_monster_siege_data_state_index" ON "cokdb1"."user_monster_siege_data" (("state"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_monster_siege_history" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceAbbr" character varying(40) COLLATE "legacy_meta"."ci",
  "allianceName" character varying(40) COLLATE "legacy_meta"."ci",
  "rank" integer NOT NULL,
  "killCount" bigint DEFAULT 0,
  "failRounds" character varying(100) COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_monster_siege_history_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_monster_siege_history_PRIMARY_pad" ON "cokdb1"."user_monster_siege_history" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_monster_siege_top_history" (
  "uid" character varying(40) COLLATE "C" NOT NULL,
  "time" bigint NOT NULL,
  "name" character varying(40) COLLATE "C" NOT NULL,
  "allianceAbbr" character varying(40) COLLATE "C",
  "allianceName" character varying(40) COLLATE "C",
  "rank" integer NOT NULL,
  "killCount" bigint DEFAULT 0,
  "failRounds" character varying(100) COLLATE "C",
  CONSTRAINT "user_monster_siege_top_history_PRIMARY" PRIMARY KEY ("uid", "time")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_monster_siege_top_history_PRIMARY_pad" ON "cokdb1"."user_monster_siege_top_history" ((rtrim("uid", ' ') COLLATE "C"), ("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_neutral" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "serverid" integer DEFAULT 0,
  "collectload" integer DEFAULT 0,
  "collecttime" bigint DEFAULT 0,
  "score" double precision DEFAULT 0,
  "leaveTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "user_neutral_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_neutral_PRIMARY_pad" ON "cokdb1"."user_neutral" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_new_daily_task" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" integer NOT NULL,
  "type" integer NOT NULL,
  "num" integer,
  "state" integer,
  CONSTRAINT "user_new_daily_task_PRIMARY" PRIMARY KEY ("uid", "id", "type")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_new_daily_task_PRIMARY_pad" ON "cokdb1"."user_new_daily_task" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("id"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_new_recall_info" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "type" integer,
  "initTime" bigint,
  "country" character varying(40) COLLATE "legacy_meta"."ci",
  "catsleLv" integer,
  "updateTime" bigint,
  "count" integer,
  "extra" text COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_new_recall_info_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_new_recall_info"."type" IS '0-流失玩家，1-活跃玩家';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_new_recall_info"."country" IS '当时国家';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_new_recall_info"."catsleLv" IS '当时大本等级';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_new_recall_info"."count" IS '活跃玩家:已召回玩家数；流失玩家：领取第几天登陆奖励';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_new_recall_info"."extra" IS '活跃用户:流失用户完成任务额外奖励list；流失用户：召回码等';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_new_recall_info_PRIMARY_pad" ON "cokdb1"."user_new_recall_info" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_new_recall_task" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "taskId" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "day" integer,
  "state" integer,
  "targetNum" integer,
  "num" integer,
  "time" bigint,
  "refreshTime" bigint,
  CONSTRAINT "user_new_recall_task_PRIMARY" PRIMARY KEY ("uid", "taskId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_new_recall_task_PRIMARY_pad" ON "cokdb1"."user_new_recall_task" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("taskId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_new_resource_log" (
  "uuid" bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 2311) NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "actionType" integer NOT NULL,
  "sandstone" bigint DEFAULT 0,
  "diamondstone" bigint DEFAULT 0,
  "marble" bigint DEFAULT 0,
  "granite" bigint DEFAULT 0,
  "limestone" bigint DEFAULT 0,
  "updateTime" bigint,
  CONSTRAINT "user_new_resource_log_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE INDEX "user_new_resource_log_uid_index" ON "cokdb1"."user_new_resource_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_olympic_bet" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "questionId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "resourceType" integer NOT NULL,
  "betNum" integer NOT NULL,
  "betCountry" character varying(10) COLLATE "legacy_meta"."ci" NOT NULL,
  "result" character varying(10) COLLATE "legacy_meta"."ci",
  "ended" integer,
  "rewarded" integer,
  "reward" integer,
  CONSTRAINT "user_olympic_bet_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_olympic_bet_PRIMARY_pad" ON "cokdb1"."user_olympic_bet" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_onekey_reload" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "generalId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "equip_list" character varying(2048) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "talentPoint" integer DEFAULT 0 NOT NULL,
  "talent" character varying(5120) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "dragon_stone_rhyme" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  CONSTRAINT "user_onekey_reload_PRIMARY" PRIMARY KEY ("uid", "generalId", "type")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_onekey_reload"."generalId" IS '英雄ID';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_onekey_reload"."type" IS '第几套';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_onekey_reload"."talentPoint" IS '天赋点';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_onekey_reload"."dragon_stone_rhyme" IS '龙韵石';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_onekey_reload_PRIMARY_pad" ON "cokdb1"."user_onekey_reload" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("generalId", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_onlinereward" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "online" bigint DEFAULT 0,
  "refreshTime" bigint DEFAULT 0,
  "use" bigint DEFAULT 0,
  CONSTRAINT "user_onlinereward_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_onlinereward_PRIMARY_pad" ON "cokdb1"."user_onlinereward" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_pay_lottery" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "totalGold" integer,
  "lastGold" integer,
  "lastLuckyNum" integer,
  "lastBonus" integer,
  "count" integer,
  "lastTime" bigint,
  "shareTime" bigint,
  "luckyNum" integer,
  CONSTRAINT "user_pay_lottery_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_pay_lottery_PRIMARY_pad" ON "cokdb1"."user_pay_lottery" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_pay_lottery_log" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "userId" character varying(40) COLLATE "legacy_meta"."ci",
  "name" character varying(40) COLLATE "legacy_meta"."ci",
  "activityId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "spend" numeric(10,2),
  "itemId" character varying(10) COLLATE "legacy_meta"."ci",
  "gold" integer,
  "time" bigint,
  CONSTRAINT "user_pay_lottery_log_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_pay_lottery_log_PRIMARY_pad" ON "cokdb1"."user_pay_lottery_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_pay_reward" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(40) COLLATE "legacy_meta"."ci",
  "buyTime" bigint,
  "refreshTime" bigint,
  "time" bigint,
  "extra" character varying(2000) COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_pay_reward_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_pay_reward_PRIMARY_pad" ON "cokdb1"."user_pay_reward" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_permission" (
  "user_id" integer NOT NULL,
  "module_permission" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "route_permission" character varying(1000) COLLATE "legacy_meta"."ci",
  "method_permission" character varying(1000) COLLATE "legacy_meta"."ci",
  "type" smallint NOT NULL,
  CONSTRAINT "user_permission_PRIMARY" PRIMARY KEY ("user_id", "module_permission", "type")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_permission"."type" IS '1.增 2.减';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_permission_PRIMARY_pad" ON "cokdb1"."user_permission" (("user_id"), (rtrim("module_permission", ' ') COLLATE "legacy_meta"."ci"), ("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_pet_dragon" (
  "uuid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
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
  "travelData" character varying(2000) COLLATE "legacy_meta"."ci",
  "communicateData" character varying(500) COLLATE "legacy_meta"."ci",
  "exp" integer DEFAULT 0,
  "initFriendShipFlag" smallint DEFAULT 0,
  "lastUpLevelTime" bigint DEFAULT 0,
  "lv" smallint DEFAULT 1,
  "nickName" character varying(128) COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_pet_dragon_dragonState_range" CHECK ("dragonState" BETWEEN -128 AND 127),
  CONSTRAINT "user_pet_dragon_useFlag_range" CHECK ("useFlag" BETWEEN -128 AND 127),
  CONSTRAINT "user_pet_dragon_initFriendShipFlag_range" CHECK ("initFriendShipFlag" BETWEEN -128 AND 127),
  CONSTRAINT "user_pet_dragon_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_pet_dragon"."friendShipDecreaseTime" IS 'ä¸Šä¸€æ¬¡å‹å¥½åº¦å‡å°‘çš„æ—¶é—´ï¼›0ï¼šè¡¨ç¤ºæ²¡æœ‰å‡å°‘è¿‡';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_pet_dragon"."travelData" IS '宠物龙历练数据';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_pet_dragon"."communicateData" IS 'ä¸Žå® ç‰©é¾™äº¤æµæ•°æ®';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_pet_dragon"."exp" IS '宠物龙的当前经验';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_pet_dragon"."initFriendShipFlag" IS '宠物龙友好度是否初始化满过';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_pet_dragon"."lastUpLevelTime" IS '宠物龙升级时间戳';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_pet_dragon_PRIMARY_pad" ON "cokdb1"."user_pet_dragon" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_pet_dragon_index_uid" ON "cokdb1"."user_pet_dragon" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_pet_dragon_skill" (
  "uuid" character varying(32) COLLATE "legacy_meta"."ci" NOT NULL,
  "uid" character varying(32) COLLATE "legacy_meta"."ci" NOT NULL,
  "skillId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer,
  "exp" integer,
  "totalExp" integer,
  "ownerId" integer,
  "index1" integer,
  "strengthenLevel" integer DEFAULT 0,
  CONSTRAINT "user_pet_dragon_skill_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_pet_dragon_skill_PRIMARY_pad" ON "cokdb1"."user_pet_dragon_skill" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_pet_dragon_skill_uid" ON "cokdb1"."user_pet_dragon_skill" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_picture" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "uploadTime" bigint DEFAULT 0,
  "auditPerson" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "note" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "state" integer DEFAULT 0,
  "picVer" integer DEFAULT 0,
  CONSTRAINT "user_picture_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_picture_PRIMARY_pad" ON "cokdb1"."user_picture" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_pray" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
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
  CONSTRAINT "user_pray_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_pray_PRIMARY_pad" ON "cokdb1"."user_pray" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_pray_count_idx" ON "cokdb1"."user_pray" (("prayCount"));
--> statement-breakpoint
CREATE INDEX "user_pray_date_idx" ON "cokdb1"."user_pray" (("lastPrayTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_push" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "platform" character varying(20) COLLATE "legacy_meta"."ci",
  "userId" character varying(1000) COLLATE "legacy_meta"."ci",
  "channelId" character varying(40) COLLATE "legacy_meta"."ci",
  "active" integer DEFAULT 1,
  CONSTRAINT "user_push_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_push_PRIMARY_pad" ON "cokdb1"."user_push" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_push_userId" ON "cokdb1"."user_push" ((rtrim(left("userId", 255), ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_recall_task" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "target_num" integer DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  "type_level" integer DEFAULT 0 NOT NULL,
  "receive" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_recall_task_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_recall_task"."id" IS '静态表id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_recall_task"."num" IS '当前完成数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_recall_task"."target_num" IS '目标数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_recall_task"."state" IS '完成状态';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_recall_task"."type_level" IS '类型';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_recall_task"."receive" IS '奖励是否领取';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_recall_task_PRIMARY_pad" ON "cokdb1"."user_recall_task" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_recall_task_notes" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "version" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "receive_mode" integer DEFAULT 0 NOT NULL,
  "refreshTime" bigint DEFAULT 0 NOT NULL,
  "beginTime" bigint DEFAULT 0 NOT NULL,
  "opendTime" bigint DEFAULT 0 NOT NULL,
  "country" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "endTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "user_recall_task_notes_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_recall_task_notes"."version" IS '版本号';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_recall_task_notes"."receive_mode" IS '领取方式0未领取1部分领取';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_recall_task_notes"."refreshTime" IS '领取奖励时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_recall_task_notes"."beginTime" IS '活动玩家自身开启时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_recall_task_notes"."opendTime" IS '该时间决定为召回玩家';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_recall_task_notes"."country" IS '国家';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_recall_task_notes_PRIMARY_pad" ON "cokdb1"."user_recall_task_notes" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_reg" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "appVersion" character varying(40) COLLATE "legacy_meta"."ci",
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_reg_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_reg_PRIMARY_pad" ON "cokdb1"."user_reg" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_reg_copy" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "appVersion" character varying(40) COLLATE "legacy_meta"."ci",
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_reg_copy_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_reg_copy_PRIMARY_pad" ON "cokdb1"."user_reg_copy" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_region_recall" (
  "uid" character varying(32) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "level" integer,
  "ladder" integer,
  "receivedaynum" integer,
  "receivetime" bigint,
  "begintime" bigint,
  "endtime" bigint,
  "country" character varying(32) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "reward" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  CONSTRAINT "user_region_recall_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_region_recall"."uid" IS '唯一ID';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_region_recall"."level" IS '触发时的等级';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_region_recall"."ladder" IS '阶段';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_region_recall"."receivedaynum" IS '已经领取天数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_region_recall"."receivetime" IS '最近一次领取的时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_region_recall"."begintime" IS '上线触发开始的时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_region_recall"."endtime" IS '结束的时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_region_recall"."country" IS '国家';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_region_recall"."reward" IS '奖励的reward';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_region_recall_PRIMARY_pad" ON "cokdb1"."user_region_recall" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_report" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "target_uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer DEFAULT 0 NOT NULL,
  "time" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_report"."target_uid" IS '举报对象的UID';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_report"."type" IS '举报类型';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_report"."time" IS '举报时间';
--> statement-breakpoint
CREATE INDEX "user_report_uid" ON "cokdb1"."user_report" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_report_target_uid" ON "cokdb1"."user_report" ((rtrim("target_uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_report_time" ON "cokdb1"."user_report" (("time"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_resource" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
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
  CONSTRAINT "user_resource_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_resource_PRIMARY_pad" ON "cokdb1"."user_resource" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_resource_bak" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
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
  CONSTRAINT "user_resource_bak_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_resource_bak_PRIMARY_pad" ON "cokdb1"."user_resource_bak" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_resource_bind" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "wood" integer,
  "food" integer,
  "stone" integer,
  "iron" integer,
  "count" integer,
  CONSTRAINT "user_resource_bind_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_resource_bind_PRIMARY_pad" ON "cokdb1"."user_resource_bind" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_resource_copy" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
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
  CONSTRAINT "user_resource_copy_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_resource_copy_PRIMARY_pad" ON "cokdb1"."user_resource_copy" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_resource_log" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "day" character varying(10) COLLATE "legacy_meta"."ci" NOT NULL,
  "resourceType" integer NOT NULL,
  "actionType" integer NOT NULL,
  "rewardType" integer NOT NULL,
  "count" bigint DEFAULT 0,
  "times" integer DEFAULT 0,
  "updateTime" bigint,
  CONSTRAINT "user_resource_log_PRIMARY" PRIMARY KEY ("uid", "day", "resourceType", "actionType", "rewardType")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_resource_log_PRIMARY_pad" ON "cokdb1"."user_resource_log" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("day", ' ') COLLATE "legacy_meta"."ci"), ("resourceType"), ("actionType"), ("rewardType"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_resource_record" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "wood" bigint,
  "stone" bigint,
  "iron" bigint,
  "food" bigint,
  "wood_bind" bigint,
  "stone_bind" bigint,
  "iron_bind" bigint,
  "food_bind" bigint,
  "costItem" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "user_resource_record_PRIMARY" PRIMARY KEY ("uid", "itemId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_resource_record_PRIMARY_pad" ON "cokdb1"."user_resource_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_resource_record_uid_idx" ON "cokdb1"."user_resource_record" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_resource_record_item_idx" ON "cokdb1"."user_resource_record" ((rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_science" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer DEFAULT 0 NOT NULL,
  "cd" bigint DEFAULT 9223372036854775807 NOT NULL,
  CONSTRAINT "user_science_PRIMARY" PRIMARY KEY ("uid", "itemId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_science_PRIMARY_pad" ON "cokdb1"."user_science" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_science_Index_ownerId" ON "cokdb1"."user_science" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_score" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "actId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "round" integer DEFAULT 1,
  "level" integer DEFAULT 1,
  "score" integer DEFAULT 0,
  "reward" integer DEFAULT 0,
  CONSTRAINT "user_score_PRIMARY" PRIMARY KEY ("uid", "actId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_score_PRIMARY_pad" ON "cokdb1"."user_score" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("actId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_score_index_actId" ON "cokdb1"."user_score" ((rtrim("actId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_score_bak" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "actId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "round" integer DEFAULT 1,
  "level" integer DEFAULT 1,
  "score" integer DEFAULT 0,
  "reward" integer DEFAULT 0,
  CONSTRAINT "user_score_bak_PRIMARY" PRIMARY KEY ("uid", "actId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_score_bak_PRIMARY_pad" ON "cokdb1"."user_score_bak" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("actId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_score_bak_index_actId" ON "cokdb1"."user_score_bak" ((rtrim("actId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_single_pay" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "productId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "canRecNum" integer,
  "hasRecNum" integer,
  CONSTRAINT "user_single_pay_PRIMARY" PRIMARY KEY ("uid", "productId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_single_pay_PRIMARY_pad" ON "cokdb1"."user_single_pay" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("productId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_skill" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "ownerId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "skillId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "startTime" bigint DEFAULT 0,
  "actTime" bigint DEFAULT 0,
  "endTime" bigint,
  "stat" integer DEFAULT 0,
  "param1" integer DEFAULT 0,
  "param2" integer DEFAULT 0,
  CONSTRAINT "user_skill_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_skill_PRIMARY_pad" ON "cokdb1"."user_skill" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_skill_ownerId_index" ON "cokdb1"."user_skill" ((rtrim("ownerId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_skill_starttime_index" ON "cokdb1"."user_skill" (("startTime"));
--> statement-breakpoint
CREATE INDEX "user_skill_endtime_index" ON "cokdb1"."user_skill" (("endTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_snowball" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "curLevel" integer,
  "lastThrowTime" bigint,
  "todayThrowCount" integer,
  "lastBuyTime" bigint DEFAULT 0,
  CONSTRAINT "user_snowball_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_snowball_PRIMARY_pad" ON "cokdb1"."user_snowball" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_sock" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "socks" bigint DEFAULT 0,
  "reward" bytea,
  "level" integer DEFAULT 0,
  "refreshtime" bigint,
  CONSTRAINT "user_sock_reward_length" CHECK (octet_length("reward") <= 65535),
  CONSTRAINT "user_sock_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_sock_PRIMARY_pad" ON "cokdb1"."user_sock" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_state" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "stateId" integer NOT NULL,
  "startTime" bigint DEFAULT 0 NOT NULL,
  "endTime" bigint NOT NULL,
  "type" integer DEFAULT 0,
  "type2" integer DEFAULT 0,
  "groupType" integer DEFAULT 0,
  "ranEffId" integer,
  "ranEffValue" integer,
  "property1" character varying(50) COLLATE "legacy_meta"."ci",
  "property2" character varying(50) COLLATE "legacy_meta"."ci",
  "count" integer DEFAULT 1 NOT NULL,
  CONSTRAINT "user_state_PRIMARY" PRIMARY KEY ("uid", "stateId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_state_PRIMARY_pad" ON "cokdb1"."user_state" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("stateId"));
--> statement-breakpoint
CREATE INDEX "user_state_index_uid_type2" ON "cokdb1"."user_state" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type2"));
--> statement-breakpoint
CREATE INDEX "user_state_index_uid_stateId" ON "cokdb1"."user_state" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("stateId"));
--> statement-breakpoint
CREATE INDEX "user_state_index_stateId" ON "cokdb1"."user_state" (("stateId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_story_task" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" integer NOT NULL,
  "type" integer NOT NULL,
  "num" integer,
  "state" integer,
  CONSTRAINT "user_story_task_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_story_task_PRIMARY_pad" ON "cokdb1"."user_story_task" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("id"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_talent" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "talent" bytea,
  CONSTRAINT "user_talent_talent_length" CHECK (octet_length("talent") <= 65535),
  CONSTRAINT "user_talent_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_talent_PRIMARY_pad" ON "cokdb1"."user_talent" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_target_task" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "target_num" integer DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  "type_level" integer DEFAULT 0 NOT NULL,
  "rewardDouble" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "user_target_task_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_target_task"."id" IS '静态表id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_target_task"."num" IS '当前完成数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_target_task"."target_num" IS '目标数量';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_target_task"."state" IS '完成状态';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_target_task"."type_level" IS '类型';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_target_task_PRIMARY_pad" ON "cokdb1"."user_target_task" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_target_task_notes" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "version" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "receive_mode" integer DEFAULT 0 NOT NULL,
  "refreshTime" bigint DEFAULT 0 NOT NULL,
  "beginTime" bigint DEFAULT 0 NOT NULL,
  "opendTime" bigint DEFAULT 0 NOT NULL,
  "isMail" integer DEFAULT 0 NOT NULL,
  "endTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "user_target_task_notes_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_target_task_notes"."version" IS '版本号';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_target_task_notes"."receive_mode" IS '领取方式0未领取1部分领取2支付领取';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_target_task_notes"."refreshTime" IS '领取奖励时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_target_task_notes"."beginTime" IS '活动玩家自身开启时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."user_target_task_notes"."opendTime" IS '活动迭代开启时间';
--> statement-breakpoint
CREATE UNIQUE INDEX "user_target_task_notes_PRIMARY_pad" ON "cokdb1"."user_target_task_notes" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_task" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "state" integer DEFAULT 0 NOT NULL,
  "type" integer DEFAULT 1 NOT NULL,
  CONSTRAINT "user_task_PRIMARY" PRIMARY KEY ("uid", "id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_task_PRIMARY_pad" ON "cokdb1"."user_task" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_tax" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "wood" bigint NOT NULL,
  "food" bigint NOT NULL,
  "iron" bigint NOT NULL,
  "stone" bigint NOT NULL,
  "silver" bigint NOT NULL,
  CONSTRAINT "user_tax_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_tax_PRIMARY_pad" ON "cokdb1"."user_tax" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_territory_donate_resource" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
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
  CONSTRAINT "user_territory_donate_resource_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_territory_donate_resource_PRIMARY_pad" ON "cokdb1"."user_territory_donate_resource" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_territory_resource" (
  "uid" character varying(255) COLLATE "C" NOT NULL,
  "allianceId" character varying(255) COLLATE "C",
  "wood" bigint DEFAULT 0,
  "stone" bigint DEFAULT 0,
  "iron" bigint DEFAULT 0,
  "food" bigint DEFAULT 0,
  "silver" bigint DEFAULT 0,
  "lastUpdateTime" bigint DEFAULT 0,
  CONSTRAINT "user_territory_resource_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_territory_resource_PRIMARY_pad" ON "cokdb1"."user_territory_resource" ((rtrim("uid", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE INDEX "user_territory_resource_al_idx" ON "cokdb1"."user_territory_resource" ((rtrim("allianceId", ' ') COLLATE "C"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_thumbup" (
  "uid" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "type" integer NOT NULL,
  "para1" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "time" bigint,
  CONSTRAINT "user_thumbup_PRIMARY" PRIMARY KEY ("uid", "type", "para1")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_thumbup_PRIMARY_pad" ON "cokdb1"."user_thumbup" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("type"), (rtrim("para1", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "user_thumbup_type" ON "cokdb1"."user_thumbup" (("type"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_timereward" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "level" integer DEFAULT 0,
  "times" integer DEFAULT 0,
  "refreshTime" bigint DEFAULT 0,
  "receiveTime" bigint DEFAULT 0,
  "rewardInfo" bytea,
  CONSTRAINT "user_timereward_rewardInfo_length" CHECK (octet_length("rewardInfo") <= 65535),
  CONSTRAINT "user_timereward_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_timereward_PRIMARY_pad" ON "cokdb1"."user_timereward" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_totem" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "totemId" integer NOT NULL,
  "putTime" bigint,
  CONSTRAINT "user_totem_PRIMARY" PRIMARY KEY ("uid", "totemId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_totem_PRIMARY_pad" ON "cokdb1"."user_totem" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("totemId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_true_info_bind" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "phoneNumber" character varying(11) COLLATE "legacy_meta"."ci",
  "email" character varying(255) COLLATE "legacy_meta"."ci",
  "phoneReward" integer,
  "emailReward" integer,
  "trueInfo" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX "user_true_info_bind_uid, trueInfo" ON "cokdb1"."user_true_info_bind" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("trueInfo"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_used_item" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "itemId" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  CONSTRAINT "user_used_item_PRIMARY" PRIMARY KEY ("uid", "itemId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_used_item_PRIMARY_pad" ON "cokdb1"."user_used_item" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("itemId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_vip" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
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
  CONSTRAINT "user_vip_svip_level_range" CHECK ("svip_level" BETWEEN -128 AND 127),
  CONSTRAINT "user_vip_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_vip_PRIMARY_pad" ON "cokdb1"."user_vip" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_wall" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "armyId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "num" integer DEFAULT 0 NOT NULL,
  "build" integer DEFAULT 0 NOT NULL,
  "finishTime" bigint DEFAULT 0 NOT NULL,
  "level" integer NOT NULL,
  CONSTRAINT "user_wall_PRIMARY" PRIMARY KEY ("uid", "armyId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_wall_PRIMARY_pad" ON "cokdb1"."user_wall" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("armyId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_weakness_building" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "armyId" character varying(20) COLLATE "legacy_meta"."ci" NOT NULL,
  "weakness" integer DEFAULT 0 NOT NULL,
  "marchWeakness" integer NOT NULL,
  "heal" integer DEFAULT 0 NOT NULL,
  "finishTime" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "user_weakness_building_PRIMARY" PRIMARY KEY ("uid", "armyId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_weakness_building_PRIMARY_pad" ON "cokdb1"."user_weakness_building" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), (rtrim("armyId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_world" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "pointId" integer NOT NULL,
  "worldId" integer DEFAULT 0 NOT NULL,
  "color" integer,
  "monsterLock" bytea,
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
  CONSTRAINT "user_world_monsterLock_length" CHECK (octet_length("monsterLock") <= 65535),
  CONSTRAINT "user_world_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_world_PRIMARY_pad" ON "cokdb1"."user_world" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."user_world_pve" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "pointId" integer NOT NULL,
  "attNum" integer NOT NULL,
  "buyNum" integer,
  "monsterInfo" bytea,
  CONSTRAINT "user_world_pve_monsterInfo_length" CHECK (octet_length("monsterInfo") <= 65535),
  CONSTRAINT "user_world_pve_PRIMARY" PRIMARY KEY ("uid", "pointId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_world_pve_PRIMARY_pad" ON "cokdb1"."user_world_pve" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("pointId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."username" (
  "uid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "people" integer DEFAULT 0 NOT NULL,
  "refreshTime" bigint NOT NULL,
  "leagueTime" bigint NOT NULL,
  CONSTRAINT "username_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "username_PRIMARY_pad" ON "cokdb1"."username" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."userprofile" (
  "USN" character varying(11) COLLATE "legacy_meta"."ci",
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer NOT NULL,
  "exp" integer NOT NULL,
  "gold" bigint DEFAULT 0 NOT NULL,
  "paidGold" bigint DEFAULT 0,
  "csmodBalance" bigint DEFAULT 0 NOT NULL,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "parseRegisterId" character varying(255) COLLATE "legacy_meta"."ci",
  "gcmRegisterId" character varying(255) COLLATE "legacy_meta"."ci",
  "openedPos" character varying(500) COLLATE "legacy_meta"."ci",
  "pic" character varying(40) COLLATE "legacy_meta"."ci",
  "picVer" integer DEFAULT 0,
  "country" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci",
  "chNameCount" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '0',
  "worldPoint" integer,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "deviceUuid" character varying(200) COLLATE "legacy_meta"."ci",
  "gaid" character varying(40) COLLATE "legacy_meta"."ci",
  "platform" character varying(40) COLLATE "legacy_meta"."ci",
  "pf" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT 'csmod_games',
  "lang" character varying(40) COLLATE "legacy_meta"."ci",
  "mt" character varying(255) COLLATE "legacy_meta"."ci",
  "appVersion" character varying(40) COLLATE "legacy_meta"."ci",
  "gmFlag" integer DEFAULT 0,
  "regTime" bigint DEFAULT 0 NOT NULL,
  "offLineTime" bigint DEFAULT 0,
  "banTime" bigint DEFAULT 0,
  "banFlag" integer DEFAULT 0,
  "excuteBanTime" bigint DEFAULT 0,
  "banType" integer DEFAULT 0,
  "banTimes" integer DEFAULT 0,
  "chatBanTime" bigint DEFAULT 0,
  "banGMName" character varying(255) COLLATE "legacy_meta"."ci",
  "noticeBanTime" bigint DEFAULT 0,
  "lastOnlineTime" bigint DEFAULT 0,
  "DAILY" character varying(4) COLLATE "legacy_meta"."ci" DEFAULT 'Y' NOT NULL,
  "gmail" character varying(255) COLLATE "legacy_meta"."ci",
  "serverId" integer,
  "crossFightSrcServerId" integer DEFAULT -1 NOT NULL,
  "lastModGoldGetTime" bigint DEFAULT 0,
  "modGoldGetTimeInterval" bigint DEFAULT 0,
  "modGoldAmount" bigint DEFAULT 0,
  "beTrainingModTime" bigint DEFAULT 0,
  "guideStep" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "payRiskFactor" integer DEFAULT 0,
  "phoneDevice" character varying(255) COLLATE "legacy_meta"."ci",
  "crystal" bigint DEFAULT 0,
  "skillMaterial" bigint DEFAULT 0,
  "kingdomContribution" integer DEFAULT 0 NOT NULL,
  "cpCount" integer DEFAULT 0,
  "militaryScore" integer DEFAULT 0,
  "allianceBuildScore" bigint DEFAULT 0,
  "backPlayer" integer DEFAULT 0,
  "backFlag_mc" integer DEFAULT 0,
  "backFlag_op" integer DEFAULT 0,
  "decomposesuiteffect" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '0;0;0',
  "curGaid" character varying(40) COLLATE "legacy_meta"."ci",
  "expeditionCrossCount" integer DEFAULT 0,
  "expeditionCrossTime" bigint DEFAULT 0,
  "expeditionFirstBloodTime" bigint DEFAULT 0,
  "payTotalDollar" numeric(10,2),
  "srcServerId" integer DEFAULT -1 NOT NULL,
  "allianceIdBack" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '',
  "neutralScore" bigint DEFAULT 0 NOT NULL,
  "dmmGold" bigint DEFAULT 0,
  "dmmPaidGold" bigint DEFAULT 0,
  "civilizationType" integer DEFAULT 0,
  "civilizationSorce" bigint DEFAULT 0,
  "paidSpecialGold" bigint,
  "dmmPaidSpecialGold" bigint,
  "crystalGold" bigint DEFAULT 0,
  "picfraId" integer DEFAULT 0,
  CONSTRAINT "userprofile_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."userprofile"."backFlag_mc" IS 'mc 召回标记';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."userprofile"."backFlag_op" IS '运营 召回标记';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."userprofile"."neutralScore" IS '中立地带积分';
--> statement-breakpoint
CREATE UNIQUE INDEX "userprofile_PRIMARY_pad" ON "cokdb1"."userprofile" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "userprofile_name_index" ON "cokdb1"."userprofile" ((rtrim("name", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "userprofile_time_level_index" ON "cokdb1"."userprofile" (("regTime"), ("level"), ("lastOnlineTime"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "userprofile_allianceid_lasttime_index" ON "cokdb1"."userprofile" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"), ("lastOnlineTime"));
--> statement-breakpoint
CREATE INDEX "userprofile_lang_index" ON "cokdb1"."userprofile" ((rtrim("lang", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "userprofile_deviceId" ON "cokdb1"."userprofile" ((rtrim("deviceId", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "userprofile_index_crossServerId" ON "cokdb1"."userprofile" (("crossFightSrcServerId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."userprofile_active" (
  "uuid" integer GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL,
  "uid" character varying(30) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" smallint DEFAULT 0,
  "build_level" smallint DEFAULT 0,
  "honour_level" smallint DEFAULT 0,
  "parse_register_id" character varying(100) COLLATE "legacy_meta"."ci" DEFAULT '',
  "country" character varying(20) COLLATE "legacy_meta"."ci" DEFAULT '',
  "pf" character varying(20) COLLATE "legacy_meta"."ci" DEFAULT '',
  "lang" character varying(20) COLLATE "legacy_meta"."ci" DEFAULT '',
  "vip_level" smallint DEFAULT 0,
  "svip_level" smallint DEFAULT 0,
  "total_pay" integer DEFAULT 0,
  "last_online_time" bigint DEFAULT 0,
  "ban_time" bigint DEFAULT 0,
  "status" smallint DEFAULT 0,
  "push_count" integer DEFAULT 0,
  "pay_sum" numeric(10,2) DEFAULT 0.00,
  "power" bigint DEFAULT 0,
  "user_name" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "most_ip" character varying(16) COLLATE "legacy_meta"."ci" DEFAULT '',
  "app_version" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '',
  "last_pay_time" bigint,
  "gmail" character varying(255) COLLATE "legacy_meta"."ci",
  "reg_time" bigint,
  "reg_ip" character varying(20) COLLATE "legacy_meta"."ci",
  "type" integer,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "exp" integer,
  "offLineTime" bigint,
  "googleAccount" character varying(255) COLLATE "legacy_meta"."ci",
  "facebookAccount" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "userprofile_active_level_range" CHECK ("level" BETWEEN -128 AND 127),
  CONSTRAINT "userprofile_active_build_level_range" CHECK ("build_level" BETWEEN -128 AND 127),
  CONSTRAINT "userprofile_active_honour_level_range" CHECK ("honour_level" BETWEEN -128 AND 127),
  CONSTRAINT "userprofile_active_vip_level_range" CHECK ("vip_level" BETWEEN -128 AND 127),
  CONSTRAINT "userprofile_active_svip_level_range" CHECK ("svip_level" BETWEEN -128 AND 127),
  CONSTRAINT "userprofile_active_status_range" CHECK ("status" BETWEEN -128 AND 127),
  CONSTRAINT "userprofile_active_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE INDEX "userprofile_active_uid" ON "cokdb1"."userprofile_active" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."userprofile_bak" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer NOT NULL,
  "exp" integer NOT NULL,
  "gold" bigint DEFAULT 0 NOT NULL,
  "paidGold" bigint DEFAULT 0,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "parseRegisterId" character varying(255) COLLATE "legacy_meta"."ci",
  "gcmRegisterId" character varying(255) COLLATE "legacy_meta"."ci",
  "openedPos" character varying(500) COLLATE "legacy_meta"."ci",
  "pic" character varying(40) COLLATE "legacy_meta"."ci",
  "picVer" integer DEFAULT 0,
  "country" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci",
  "chNameCount" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '0',
  "worldPoint" integer,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "deviceUuid" character varying(200) COLLATE "legacy_meta"."ci",
  "gaid" character varying(40) COLLATE "legacy_meta"."ci",
  "platform" character varying(40) COLLATE "legacy_meta"."ci",
  "pf" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT 'csmod_games',
  "lang" character varying(40) COLLATE "legacy_meta"."ci",
  "mt" character varying(255) COLLATE "legacy_meta"."ci",
  "appVersion" character varying(40) COLLATE "legacy_meta"."ci",
  "gmFlag" integer DEFAULT 0,
  "regTime" bigint DEFAULT 0 NOT NULL,
  "offLineTime" bigint DEFAULT 0,
  "banTime" bigint DEFAULT 0,
  "banType" integer DEFAULT 0,
  "banTimes" integer DEFAULT 0,
  "chatBanTime" bigint DEFAULT 0,
  "banGMName" character varying(255) COLLATE "legacy_meta"."ci",
  "noticeBanTime" bigint DEFAULT 0,
  "lastOnlineTime" bigint DEFAULT 0,
  "gmail" character varying(255) COLLATE "legacy_meta"."ci",
  "serverId" integer,
  "crossFightSrcServerId" integer DEFAULT -1 NOT NULL,
  "lastModGoldGetTime" bigint DEFAULT 0,
  "modGoldGetTimeInterval" bigint DEFAULT 0,
  "modGoldAmount" bigint DEFAULT 0,
  "beTrainingModTime" bigint DEFAULT 0,
  "guideStep" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "payRiskFactor" integer DEFAULT 0,
  "phoneDevice" character varying(40) COLLATE "legacy_meta"."ci",
  "crystal" bigint DEFAULT 0,
  CONSTRAINT "userprofile_bak_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "userprofile_bak_PRIMARY_pad" ON "cokdb1"."userprofile_bak" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "userprofile_bak_name_index" ON "cokdb1"."userprofile_bak" ((rtrim("name", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "userprofile_bak_time_level_index" ON "cokdb1"."userprofile_bak" (("regTime"), ("level"), ("lastOnlineTime"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "userprofile_bak_allianceid_lasttime_index" ON "cokdb1"."userprofile_bak" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"), ("lastOnlineTime"));
--> statement-breakpoint
CREATE INDEX "userprofile_bak_lang_index" ON "cokdb1"."userprofile_bak" ((rtrim("lang", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."userprofile_del" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "name" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "level" integer NOT NULL,
  "exp" integer NOT NULL,
  "gold" bigint DEFAULT 0 NOT NULL,
  "paidGold" bigint DEFAULT 0,
  "payTotal" bigint DEFAULT 0 NOT NULL,
  "parseRegisterId" character varying(255) COLLATE "legacy_meta"."ci",
  "gcmRegisterId" character varying(255) COLLATE "legacy_meta"."ci",
  "openedPos" character varying(500) COLLATE "legacy_meta"."ci",
  "pic" character varying(40) COLLATE "legacy_meta"."ci",
  "picVer" integer DEFAULT 0,
  "country" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci",
  "chNameCount" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '0',
  "worldPoint" integer,
  "deviceId" character varying(255) COLLATE "legacy_meta"."ci",
  "deviceUuid" character varying(200) COLLATE "legacy_meta"."ci",
  "gaid" character varying(40) COLLATE "legacy_meta"."ci",
  "platform" character varying(40) COLLATE "legacy_meta"."ci",
  "pf" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT 'csmod_games',
  "lang" character varying(40) COLLATE "legacy_meta"."ci",
  "mt" character varying(255) COLLATE "legacy_meta"."ci",
  "appVersion" character varying(40) COLLATE "legacy_meta"."ci",
  "gmFlag" integer DEFAULT 0,
  "regTime" bigint DEFAULT 0 NOT NULL,
  "offLineTime" bigint DEFAULT 0,
  "banTime" bigint DEFAULT 0,
  "banType" integer DEFAULT 0,
  "banTimes" integer DEFAULT 0,
  "chatBanTime" bigint DEFAULT 0,
  "banGMName" character varying(255) COLLATE "legacy_meta"."ci",
  "noticeBanTime" bigint DEFAULT 0,
  "lastOnlineTime" bigint DEFAULT 0,
  "gmail" character varying(255) COLLATE "legacy_meta"."ci",
  "serverId" integer,
  "crossFightSrcServerId" integer DEFAULT -1 NOT NULL,
  "lastModGoldGetTime" bigint DEFAULT 0,
  "modGoldGetTimeInterval" bigint DEFAULT 0,
  "modGoldAmount" bigint DEFAULT 0,
  "beTrainingModTime" bigint DEFAULT 0,
  "guideStep" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '',
  "payRiskFactor" integer DEFAULT 0,
  "phoneDevice" character varying(40) COLLATE "legacy_meta"."ci",
  "crystal" bigint DEFAULT 0,
  "skillMaterial" bigint DEFAULT 0,
  CONSTRAINT "userprofile_del_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "userprofile_del_PRIMARY_pad" ON "cokdb1"."userprofile_del" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "userprofile_del_name_index" ON "cokdb1"."userprofile_del" ((rtrim("name", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "userprofile_del_time_level_index" ON "cokdb1"."userprofile_del" (("regTime"), ("level"), ("lastOnlineTime"), (rtrim("pf", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "userprofile_del_allianceid_lasttime_index" ON "cokdb1"."userprofile_del" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"), ("lastOnlineTime"));
--> statement-breakpoint
CREATE INDEX "userprofile_del_lang_index" ON "cokdb1"."userprofile_del" ((rtrim("lang", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."vip_box_turntable" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "vip" integer NOT NULL,
  "itemidlist" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "tableid" integer NOT NULL,
  "openCount" bigint DEFAULT 0 NOT NULL,
  "stepNum" integer DEFAULT 0 NOT NULL,
  "free" integer DEFAULT 0 NOT NULL,
  "rewardTime" bigint DEFAULT 0,
  "refreshTime" bigint DEFAULT 0,
  CONSTRAINT "vip_box_turntable_PRIMARY" PRIMARY KEY ("uid", "vip")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."vip_box_turntable"."uid" IS '唯一ID';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."vip_box_turntable"."vip" IS 'vip等级';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."vip_box_turntable"."itemidlist" IS '今日已开出id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."vip_box_turntable"."tableid" IS '存储的当前表格id';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."vip_box_turntable"."openCount" IS '打开界面次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."vip_box_turntable"."stepNum" IS '当前打开位置';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."vip_box_turntable"."free" IS '免费次数是否已用';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."vip_box_turntable"."rewardTime" IS '抽取的时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."vip_box_turntable"."refreshTime" IS '每天上线几点刷新的';
--> statement-breakpoint
CREATE UNIQUE INDEX "vip_box_turntable_PRIMARY_pad" ON "cokdb1"."vip_box_turntable" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("vip"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."wishing_tree" (
  "uid" character varying(32) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
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
  CONSTRAINT "wishing_tree_PRIMARY" PRIMARY KEY ("uid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."wishing_tree"."uid" IS '唯一ID';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."wishing_tree"."totalNum" IS '许愿总次数';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."wishing_tree"."type_1" IS '爱情';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."wishing_tree"."type_2" IS '事业';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."wishing_tree"."type_3" IS '精神';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."wishing_tree"."type_4" IS '游戏内';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."wishing_tree"."type_5" IS '金钱';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."wishing_tree"."type_6" IS '健康';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."wishing_tree"."type_7" IS '学业';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."wishing_tree"."type_8" IS '幻想';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."wishing_tree"."type_9" IS '物质';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."wishing_tree"."type_10" IS '杂';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."wishing_tree"."refreshtime" IS '最后一次刷新的时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."wishing_tree"."rewardtime" IS '领奖的时间';
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."wishing_tree"."rewardid" IS '领奖的id';
--> statement-breakpoint
CREATE UNIQUE INDEX "wishing_tree_PRIMARY_pad" ON "cokdb1"."wishing_tree" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_barbarion" (
  "pointId" integer NOT NULL,
  "configId" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "lastArmyMapByteArray" bytea,
  "lastAwardArmyMapByteArray" bytea,
  "lastBeAttackedTime" bigint DEFAULT 0,
  "currentHP" integer DEFAULT 0,
  CONSTRAINT "world_barbarion_lastArmyMapByteArray_length" CHECK (octet_length("lastArmyMapByteArray") <= 65535),
  CONSTRAINT "world_barbarion_lastAwardArmyMapByteArray_length" CHECK (octet_length("lastAwardArmyMapByteArray") <= 65535),
  CONSTRAINT "world_barbarion_PRIMARY" PRIMARY KEY ("pointId")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_barbarion_dead" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "areaId" integer NOT NULL,
  "level" integer NOT NULL,
  "pointItem" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '0',
  "deadFinishTime" bigint NOT NULL,
  CONSTRAINT "world_barbarion_dead_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "world_barbarion_dead_PRIMARY_pad" ON "cokdb1"."world_barbarion_dead" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "world_barbarion_dead_dead_res_time" ON "cokdb1"."world_barbarion_dead" (("deadFinishTime"));
--> statement-breakpoint
CREATE INDEX "world_barbarion_dead_areaId_index" ON "cokdb1"."world_barbarion_dead" (("areaId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_basttile_dead" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "areaId" integer NOT NULL,
  "level" integer NOT NULL,
  "pointItem" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '0',
  "deadFinishTime" bigint NOT NULL,
  CONSTRAINT "world_basttile_dead_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "world_basttile_dead_PRIMARY_pad" ON "cokdb1"."world_basttile_dead" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "world_basttile_dead_dead_res_time" ON "cokdb1"."world_basttile_dead" (("deadFinishTime"));
--> statement-breakpoint
CREATE INDEX "world_basttile_dead_areaId_index" ON "cokdb1"."world_basttile_dead" (("areaId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_favorite" (
  "uid" character varying(255) COLLATE "legacy_meta"."ci" NOT NULL,
  "point" integer NOT NULL,
  "type" integer NOT NULL,
  "cityType" integer DEFAULT -1,
  "resType" integer DEFAULT -1,
  "name" character varying(255) COLLATE "legacy_meta"."ci",
  "server" integer DEFAULT 0 NOT NULL,
  "createTime" bigint DEFAULT 0,
  CONSTRAINT "world_favorite_PRIMARY" PRIMARY KEY ("uid", "point", "server")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "world_favorite_PRIMARY_pad" ON "cokdb1"."world_favorite" ((rtrim("uid", ' ') COLLATE "legacy_meta"."ci"), ("point"), ("server"));
--> statement-breakpoint
CREATE INDEX "world_favorite_time_idx" ON "cokdb1"."world_favorite" (("createTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_field_monster_dead" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "id" integer NOT NULL,
  "monster" character varying(40) COLLATE "legacy_meta"."ci",
  "deadFinishTime" bigint NOT NULL,
  CONSTRAINT "world_field_monster_dead_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "world_field_monster_dead_PRIMARY_pad" ON "cokdb1"."world_field_monster_dead" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "world_field_monster_dead_dead_monster_time" ON "cokdb1"."world_field_monster_dead" (("deadFinishTime"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_flush_barbarion_tmp" (
  "id" integer NOT NULL,
  "pointType" integer NOT NULL,
  "pointItem" character varying(255) COLLATE "legacy_meta"."ci",
  "resLevel" integer DEFAULT 0 NOT NULL,
  "flushTime" bigint DEFAULT 0,
  CONSTRAINT "world_flush_barbarion_tmp_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_flush_basttile_tmp" (
  "id" integer NOT NULL,
  "pointType" integer NOT NULL,
  "pointItem" character varying(255) COLLATE "legacy_meta"."ci",
  "resLevel" integer DEFAULT 0 NOT NULL,
  "flushTime" bigint DEFAULT 0,
  CONSTRAINT "world_flush_basttile_tmp_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_flush_field_monster_tmp" (
  "id" integer NOT NULL,
  "pointType" integer NOT NULL,
  "pointItem" character varying(255) COLLATE "legacy_meta"."ci",
  "startTime" bigint DEFAULT 0 NOT NULL,
  "flushTime" bigint DEFAULT 0,
  CONSTRAINT "world_flush_field_monster_tmp_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_flush_monster_tmp" (
  "id" integer NOT NULL,
  "pointType" integer NOT NULL,
  "flushTime" bigint DEFAULT 0,
  CONSTRAINT "world_flush_monster_tmp_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_flush_resource_new_tmp" (
  "id" integer NOT NULL,
  "pointType" integer NOT NULL,
  "pointItem" character varying(255) COLLATE "legacy_meta"."ci",
  "resLevel" integer DEFAULT 0 NOT NULL,
  "resCostValue" integer DEFAULT 0 NOT NULL,
  "resInitValue" integer NOT NULL,
  "flushTime" bigint DEFAULT 0,
  CONSTRAINT "world_flush_resource_new_tmp_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_flush_resource_tmp" (
  "id" integer NOT NULL,
  "pointType" integer NOT NULL,
  "pointItem" character varying(255) COLLATE "legacy_meta"."ci",
  "resLevel" integer DEFAULT 0 NOT NULL,
  "resCostValue" integer DEFAULT 0 NOT NULL,
  "resInitValue" integer NOT NULL,
  "flushTime" bigint DEFAULT 0,
  CONSTRAINT "world_flush_resource_tmp_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_hero_record" (
  "heroUid" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "heroFreeTime" bigint DEFAULT 0,
  CONSTRAINT "world_hero_record_PRIMARY" PRIMARY KEY ("heroUid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "world_hero_record_PRIMARY_pad" ON "cokdb1"."world_hero_record" ((rtrim("heroUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_march" (
  "uuid" character varying(40) COLLATE "legacy_meta"."ci" DEFAULT '' NOT NULL,
  "ownerUid" character varying(40) COLLATE "legacy_meta"."ci",
  "ownerId" integer NOT NULL,
  "ownerName" character varying(255) COLLATE "legacy_meta"."ci",
  "ownerColor" integer,
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci",
  "teamId" character varying(40) COLLATE "legacy_meta"."ci",
  "armyInfo" bytea,
  "type" integer NOT NULL,
  "targetId" integer NOT NULL,
  "targetType" integer,
  "targetUid" character varying(255) COLLATE "legacy_meta"."ci",
  "marchStartTime" bigint NOT NULL,
  "marchTime" integer,
  "marchArrivalTime" bigint,
  "returnStartTime" bigint,
  "arrivalTime" bigint,
  "exploreTime" bigint,
  "exploreReport" bytea,
  "collectSpd" real,
  "changeCollectSpdTime" bigint,
  "collectedBeforeSpd" bigint,
  "resLevel" integer,
  "plunderRes" character varying(2048) COLLATE "legacy_meta"."ci",
  "retrieveRes" character varying(1024) COLLATE "legacy_meta"."ci",
  "state" integer,
  "extraParam" integer DEFAULT 0,
  "blackLandMarchTime" character varying(2048) COLLATE "legacy_meta"."ci",
  "monsterArmyCount" integer,
  "monsterLevel" integer,
  "monsterInfo" character varying(4000) COLLATE "C",
  "territoryStartTime" bigint,
  "territoryUpdateTime" bigint,
  "territoryStat" integer DEFAULT 0,
  "buildingKillArmy" bytea,
  "slowDown" integer DEFAULT 0,
  "worldId" integer DEFAULT 0 NOT NULL,
  "isDuelSkill" integer DEFAULT 0,
  "fightSide" integer DEFAULT 0,
  "occupyResourceEndTime" bigint DEFAULT 0,
  "superTeam" integer DEFAULT 0,
  "honourWatchtower" integer DEFAULT 0,
  "npcDropAdd" numeric(8,2),
  "record" integer,
  "stamina" integer DEFAULT 0,
  "singleCureAdd" numeric(8,2) DEFAULT 0.00,
  CONSTRAINT "world_march_armyInfo_length" CHECK (octet_length("armyInfo") <= 65535),
  CONSTRAINT "world_march_exploreReport_length" CHECK (octet_length("exploreReport") <= 65535),
  CONSTRAINT "world_march_buildingKillArmy_length" CHECK (octet_length("buildingKillArmy") <= 65535),
  CONSTRAINT "world_march_PRIMARY" PRIMARY KEY ("uuid")
);
--> statement-breakpoint
COMMENT ON COLUMN "cokdb1"."world_march"."honourWatchtower" IS '荣耀瞭望塔标识';
--> statement-breakpoint
CREATE UNIQUE INDEX "world_march_PRIMARY_pad" ON "cokdb1"."world_march" ((rtrim("uuid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "world_march_ownerId_index_001" ON "cokdb1"."world_march" ((rtrim("ownerUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "world_march_targetUid_index" ON "cokdb1"."world_march" ((rtrim("targetUid", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_res_dead" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "areaId" integer NOT NULL,
  "level" integer NOT NULL,
  "pointItem" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '0',
  "deadFinishTime" bigint NOT NULL,
  CONSTRAINT "world_res_dead_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "world_res_dead_PRIMARY_pad" ON "cokdb1"."world_res_dead" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "world_res_dead_dead_res_time" ON "cokdb1"."world_res_dead" (("deadFinishTime"));
--> statement-breakpoint
CREATE INDEX "world_res_dead_areaId_index" ON "cokdb1"."world_res_dead" (("areaId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_res_new_dead" (
  "id" character varying(40) COLLATE "legacy_meta"."ci" NOT NULL,
  "areaId" integer NOT NULL,
  "level" integer NOT NULL,
  "pointItem" character varying(255) COLLATE "legacy_meta"."ci" DEFAULT '0',
  "deadFinishTime" bigint NOT NULL,
  CONSTRAINT "world_res_new_dead_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "world_res_new_dead_PRIMARY_pad" ON "cokdb1"."world_res_new_dead" ((rtrim("id", ' ') COLLATE "legacy_meta"."ci"));
--> statement-breakpoint
CREATE INDEX "world_res_new_dead_dead_res_time" ON "cokdb1"."world_res_new_dead" (("deadFinishTime"));
--> statement-breakpoint
CREATE INDEX "world_res_new_dead_areaId_index" ON "cokdb1"."world_res_new_dead" (("areaId"));
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_res_record" (
  "time" bigint NOT NULL,
  "id" integer NOT NULL,
  "x" integer NOT NULL,
  "y" integer NOT NULL,
  "areaId" integer NOT NULL,
  "level" integer,
  "pointItem" character varying(255) COLLATE "legacy_meta"."ci",
  CONSTRAINT "world_res_record_PRIMARY" PRIMARY KEY ("time", "id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."world_update_gridtype_tmp" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1442402) NOT NULL,
  "gridType" integer NOT NULL,
  "grid2Type" integer NOT NULL,
  CONSTRAINT "world_update_gridtype_tmp_id_range" CHECK ("id" >= 0 AND "id" <= 4294967295),
  CONSTRAINT "world_update_gridtype_tmp_PRIMARY" PRIMARY KEY ("id")
);
--> statement-breakpoint
CREATE TABLE "cokdb1"."worldcup_apply" (
  "allianceId" character varying(50) COLLATE "legacy_meta"."ci" NOT NULL,
  "version" integer NOT NULL,
  "applyUid" character varying(50) COLLATE "legacy_meta"."ci",
  "serverId" integer,
  "time" bigint,
  CONSTRAINT "worldcup_apply_PRIMARY" PRIMARY KEY ("allianceId", "version")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "worldcup_apply_PRIMARY_pad" ON "cokdb1"."worldcup_apply" ((rtrim("allianceId", ' ') COLLATE "legacy_meta"."ci"), ("version"));
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
  "pointItem" character varying(255) COLLATE "legacy_meta"."ci",
  "territoryAlliance" character varying(255) COLLATE "legacy_meta"."ci",
  "territoryId" integer,
  "active" integer,
  "relicAreaId" character varying(255) COLLATE "legacy_meta"."ci",
  "resLevel" integer NOT NULL,
  "resCostValue" integer DEFAULT 0 NOT NULL,
  "resInitValue" integer NOT NULL,
  "ownerId" character varying(255) COLLATE "legacy_meta"."ci",
  "ownerName" character varying(255) COLLATE "legacy_meta"."ci",
  "allianceId" character varying(40) COLLATE "legacy_meta"."ci",
  "cityDefValue" integer,
  "startOccupyTime" bigint DEFAULT 0,
  "ownerMarchUUid" character varying(40) COLLATE "legacy_meta"."ci",
  "flushTime" bigint DEFAULT 0,
  "fireTime" bigint,
  "shieldTime" bigint DEFAULT 0,
  "startTime" bigint,
  "monsterInfo" bytea,
  "resourceShieldTime" bigint DEFAULT 0,
  "monsterCastleState" integer DEFAULT 0,
  "monsterCurrHP" integer DEFAULT 0,
  "flushFlag" integer DEFAULT 0,
  "sendHeartDurationTime" bigint DEFAULT 0,
  "heartType" character varying(5) COLLATE "legacy_meta"."ci",
  "cannonFireTime" bigint,
  "trap" character varying(255) COLLATE "legacy_meta"."ci",
  "reserve" bigint DEFAULT 0,
  CONSTRAINT "worldpoint_monsterInfo_length" CHECK (octet_length("monsterInfo") <= 65535),
  CONSTRAINT "worldpoint_PRIMARY" PRIMARY KEY ("id", "worldId")
);
--> statement-breakpoint
CREATE INDEX "worldpoint_world_res_area_id" ON "cokdb1"."worldpoint" (("areaId"), ("gridType"));
--> statement-breakpoint
CREATE INDEX "worldpoint_world_monster_area_id" ON "cokdb1"."worldpoint" (("monsterAreaId"), ("pointType"), ("gridType"), (rtrim("ownerId", ' ') COLLATE "legacy_meta"."ci"), ("grid2Type"));
--> statement-breakpoint
CREATE INDEX "worldpoint_world_pointType_flushTime_index" ON "cokdb1"."worldpoint" (("pointType"), (rtrim("pointItem", ' ') COLLATE "legacy_meta"."ci"), ("flushTime"), ("gridType"), ("grid2Type"));
--> statement-breakpoint
CREATE INDEX "worldpoint_world_xy_type_country_index" ON "cokdb1"."worldpoint" (("x"), ("y"), ("pointType"));
--> statement-breakpoint
CREATE INDEX "worldpoint_worldId_pointType_gridType_grid2Type" ON "cokdb1"."worldpoint" (("worldId"), ("pointType"), ("gridType"), ("grid2Type"));
