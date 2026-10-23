/** Independently authored compatibility functions; no legacy stored-program bodies. */
export const foundationSql = `CREATE SCHEMA legacy_meta;
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
BEGIN PERFORM set_config('legacy_meta.explicit_timestamp','on',true); RETURN NEW; END $body$;`;
