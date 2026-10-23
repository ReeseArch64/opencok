// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyNumber, legacyTemporal } from "../../types";
import { cokdb1 } from "../namespaces";
export const stat_date = cokdb1.table("stat_date", {
  "date": legacyTemporal("date").notNull(),
  "dau": integer("dau").notNull().default(sql.raw("0")),
  "pay": legacyNumber("pay", {"sqlType":"numeric(12,2)"}).notNull().default(sql.raw("0.00")),
  "reg": integer("reg").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "stat_date_PRIMARY", columns: [table["date"]] }),
  check("stat_date_date_temporal", sql.raw("legacy_meta.valid_temporal(\"date\", 'date', 0)")),
]);
