// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const pay_total = cokdb1.table("pay_total", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "gold": bigint("gold", { mode: "bigint" }),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
  "type": integer("type").notNull().default(sql.raw("1")),
  "getLv": integer("getLv").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "pay_total_PRIMARY", columns: [table["uid"], table["type"]] }),
  uniqueIndex("pay_total_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\"")),
]);
