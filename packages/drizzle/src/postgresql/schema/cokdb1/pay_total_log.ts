// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const pay_total_log = cokdb1.table("pay_total_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "level": integer("level").notNull(),
  "gold": bigint("gold", { mode: "bigint" }),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
  "type": integer("type").notNull().default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "pay_total_log_PRIMARY", columns: [table["uid"], table["level"], table["createTime"], table["type"]] }),
  uniqueIndex("pay_total_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"level\""), sql.raw("\"createTime\""), sql.raw("\"type\"")),
]);
