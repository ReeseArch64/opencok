// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, primaryKey } from "drizzle-orm/pg-core";
import { legacyNumber, legacyTemporal } from "../../types";
import { cokdb_global } from "../namespaces";
export const adcost = cokdb_global.table("adcost", {
  "date": legacyTemporal("date").notNull(),
  "googleplay": legacyNumber("googleplay", {"sqlType":"numeric(12,2)"}),
  "facebook": legacyNumber("facebook", {"sqlType":"numeric(12,2)"}),
  "cn": legacyNumber("cn", {"sqlType":"numeric(12,2)"}),
  "kr": legacyNumber("kr", {"sqlType":"numeric(12,2)"}),
  "jp": legacyNumber("jp", {"sqlType":"numeric(12,2)"}),
  "th": legacyNumber("th", {"sqlType":"numeric(12,2)"}),
  "ru": legacyNumber("ru", {"sqlType":"numeric(12,2)"}),
  "tw": legacyNumber("tw", {"sqlType":"numeric(12,2)"}),
}, (table) => [
  primaryKey({ name: "adcost_PRIMARY", columns: [table["date"]] }),
  check("adcost_date_temporal", sql.raw("legacy_meta.valid_temporal(\"date\", 'date', 0)")),
]);
