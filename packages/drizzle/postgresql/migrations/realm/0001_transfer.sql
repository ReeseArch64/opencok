ALTER TABLE legacy_meta.manifest ADD COLUMN catalog_hash text;
CREATE TABLE legacy_meta.transfer_tables (
  table_id text PRIMARY KEY,
  manifest_hash text NOT NULL,
  row_count bigint NOT NULL CHECK (row_count>=0),
  digest text NOT NULL CHECK (length(digest)=64)
);
DO $body$
DECLARE sequence_name text;
BEGIN
  IF to_regclass('cokdb1.world_update_gridtype_tmp') IS NOT NULL THEN
    SELECT pg_get_serial_sequence('cokdb1.world_update_gridtype_tmp','id') INTO sequence_name;
    EXECUTE format('ALTER SEQUENCE %s MAXVALUE 4294967295',sequence_name);
  END IF;
END $body$;
