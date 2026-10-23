// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyTemporal, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const dragon_playoff_properties = cokdb1.table("dragon_playoff_properties", {
  "key": legacyText("key", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "value": legacyText("value", {"sqlType":"character varying(1000)","collation":"legacy_meta.ci"}),
  "updateTime": legacyTemporal("updateTime").notNull().default(sql.raw("legacy_meta.utc_now(0)")),
}, (table) => [
  primaryKey({ name: "dragon_playoff_properties_PRIMARY", columns: [table["key"]] }),
  uniqueIndex("dragon_playoff_properties_PRIMARY_pad").on(sql.raw("rtrim(\"key\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("dragon_playoff_properties_updateTime_temporal", sql.raw("legacy_meta.valid_temporal(\"updateTime\", 'timestamp', 0)")),
]);
