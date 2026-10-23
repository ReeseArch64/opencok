// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const cn_regpay = cokdb_global.table("cn_regpay", {
  "date": integer("date").notNull(),
  "pf": legacyText("pf", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "dau": integer("dau").notNull().default(sql.raw("0")),
  "reg": integer("reg").default(sql.raw("0")),
  "payucnt": integer("payucnt").default(sql.raw("0")),
  "paysum": integer("paysum").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "cn_regpay_PRIMARY", columns: [table["date"], table["pf"]] }),
  uniqueIndex("cn_regpay_PRIMARY_pad").on(sql.raw("\"date\""), sql.raw("rtrim(\"pf\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
