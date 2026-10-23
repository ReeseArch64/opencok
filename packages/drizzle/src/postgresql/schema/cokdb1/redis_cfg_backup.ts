// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const redis_cfg_backup = cokdb1.table("redis_cfg_backup", {
  "keyFlag": legacyText("keyFlag", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}).notNull(),
  "info": legacyText("info", {"sqlType":"character varying(2048)","collation":"legacy_meta.ci"}).default(sql.raw("'0'")),
}, (table) => [
  primaryKey({ name: "redis_cfg_backup_PRIMARY", columns: [table["keyFlag"]] }),
  uniqueIndex("redis_cfg_backup_PRIMARY_pad").on(sql.raw("rtrim(\"keyFlag\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
