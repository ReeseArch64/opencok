/** A signed native sequence plus an exact numeric offset spans the full uint64 identity range. */
export const unsignedSequenceMigrationSql = `DO $body$
DECLARE next_id numeric;
BEGIN
  SELECT next_value INTO next_id FROM legacy_meta.unsigned_sequences WHERE name='opencok_chat.chat_message';
  IF next_id IS NOT NULL THEN
    CREATE SEQUENCE legacy_meta.uint64_chat AS bigint INCREMENT BY 1 MINVALUE -9223372036854775807 MAXVALUE 9223372036854775807 START WITH -9223372036854775807 NO CYCLE;
    IF next_id > 18446744073709551615 THEN
      PERFORM setval('legacy_meta.uint64_chat',9223372036854775807,true);
    ELSE
      PERFORM setval('legacy_meta.uint64_chat',(next_id-9223372036854775808)::bigint,false);
    END IF;
  END IF;
END $body$;
CREATE OR REPLACE FUNCTION legacy_meta.next_unsigned(sequence_name text) RETURNS numeric LANGUAGE plpgsql AS $body$
BEGIN
  IF sequence_name <> 'opencok_chat.chat_message' OR to_regclass('legacy_meta.uint64_chat') IS NULL THEN
    RAISE EXCEPTION USING ERRCODE='22003', MESSAGE='Unsigned sequence absent';
  END IF;
  RETURN nextval('legacy_meta.uint64_chat')::numeric + 9223372036854775808;
END $body$;`;
