// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const stat_phone_log = cokdb1.table("stat_phone_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "phoneDevice": legacyText("phoneDevice", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "model": legacyText("model", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "version": legacyText("version", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "width": integer("width").notNull(),
  "height": integer("height").notNull(),
  "count": integer("count"),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "stat_phone_log_PRIMARY", columns: [table["uid"], table["phoneDevice"], table["model"], table["version"], table["width"], table["height"]] }),
  uniqueIndex("stat_phone_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"phoneDevice\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"model\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"version\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"width\""), sql.raw("\"height\"")),
  index("stat_phone_log_idx").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"time\"")),
]);
