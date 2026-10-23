// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyTemporal, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const trigger_var = cokdb1.table("trigger_var", {
  "type": integer("type").notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''''''")),
  "key": legacyText("key", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "value": legacyText("value", {"sqlType":"text","collation":"legacy_meta.ci"}).notNull(),
  "refreshtime": bigint("refreshtime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "createTime": legacyTemporal("createTime").notNull().default(sql.raw("legacy_meta.utc_now(0)")),
  "lastUpdateTime": legacyTemporal("lastUpdateTime").notNull().default(sql.raw("'0000-00-00 00:00:00'")),
}, (table) => [
  primaryKey({ name: "trigger_var_PRIMARY", columns: [table["type"], table["uid"], table["key"]] }),
  uniqueIndex("trigger_var_PRIMARY_pad").on(sql.raw("\"type\""), sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"key\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("trigger_var_type_key").on(sql.raw("\"type\""), sql.raw("rtrim(\"key\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("trigger_var_uid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("trigger_var_createTime").on(sql.raw("\"createTime\"")),
  index("trigger_var_lastUpdateTime").on(sql.raw("\"lastUpdateTime\"")),
  check("trigger_var_createTime_temporal", sql.raw("legacy_meta.valid_temporal(\"createTime\", 'timestamp', 0)")),
  check("trigger_var_lastUpdateTime_temporal", sql.raw("legacy_meta.valid_temporal(\"lastUpdateTime\", 'timestamp', 0)")),
]);
