import { createHash } from "node:crypto";
import type { PoolClient } from "pg";
import { manifest } from "./manifest";
import type { DatabaseRole } from "./model";

export const manifestHash = createHash("sha256").update(JSON.stringify(manifest)).digest("hex");

/** No row data or volatile OIDs: detects drift after an independently tested bootstrap. */
export async function catalogHash(client: PoolClient) {
  const predicate = "n.nspname NOT IN ('pg_catalog','information_schema','drizzle','legacy_meta') AND n.nspname NOT LIKE 'pg_toast%'";
  const queries = [
    `SELECT n.nspname,c.relname,c.relkind FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE ${predicate} AND c.relkind IN ('r','p','v','m','S') ORDER BY 1,2`,
    `SELECT n.nspname,c.relname,s.seqstart::text,s.seqincrement::text,s.seqmax::text,s.seqmin::text,s.seqcache::text,s.seqcycle FROM pg_sequence s JOIN pg_class c ON c.oid=s.seqrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE ${predicate} ORDER BY 1,2`,
    `SELECT n.nspname,c.relname,a.attname,format_type(a.atttypid,a.atttypmod) AS type,a.attnotnull,a.attidentity,pg_get_expr(d.adbin,d.adrelid) AS default_sql,co.collname,col_description(c.oid,a.attnum) AS comment
      FROM pg_attribute a JOIN pg_class c ON c.oid=a.attrelid JOIN pg_namespace n ON n.oid=c.relnamespace LEFT JOIN pg_attrdef d ON d.adrelid=a.attrelid AND d.adnum=a.attnum LEFT JOIN pg_collation co ON co.oid=a.attcollation
      WHERE ${predicate} AND c.relkind IN ('r','p') AND a.attnum>0 AND NOT a.attisdropped ORDER BY n.nspname,c.relname,a.attnum`,
    `SELECT schemaname,tablename,indexname,indexdef FROM pg_indexes WHERE schemaname IN ('cokdb1','cokdb_global','cokdb_pay','opencok_chat') ORDER BY 1,2,3`,
    `SELECT n.nspname,c.relname,con.conname,pg_get_constraintdef(con.oid) AS definition FROM pg_constraint con JOIN pg_class c ON c.oid=con.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE ${predicate} ORDER BY 1,2,3`,
    `SELECT n.nspname,c.relname,t.tgname,pg_get_triggerdef(t.oid) AS definition FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE ${predicate} AND NOT t.tgisinternal ORDER BY 1,2,3`,
    `SELECT p.proname,pg_get_functiondef(p.oid) AS definition FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='legacy_meta' ORDER BY 1,2`,
    `SELECT collname,collprovider,collisdeterministic,colllocale,collversion FROM pg_collation c JOIN pg_namespace n ON n.oid=c.collnamespace WHERE n.nspname='legacy_meta' ORDER BY 1`,
  ];
  const hash = createHash("sha256");
  for (const query of queries) hash.update(JSON.stringify((await client.query(query)).rows));
  return hash.digest("hex");
}

export async function verifyTarget(client: PoolClient, role: DatabaseRole) {
  const result = await client.query("SELECT hash,role,catalog_hash FROM legacy_meta.manifest");
  if (result.rowCount !== 1 || result.rows[0].hash !== manifestHash || result.rows[0].role !== role || result.rows[0].catalog_hash !== await catalogHash(client)) {
    throw new Error("PostgreSQL target manifest, role or catalog differs from the reviewed baseline");
  }
}
