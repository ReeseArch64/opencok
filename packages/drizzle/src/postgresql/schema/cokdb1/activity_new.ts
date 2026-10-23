// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const activity_new = cokdb1.table("activity_new", {
  "type": legacyText("type", {"sqlType":"character varying(11)","collation":"legacy_meta.ci"}).notNull(),
  "activityInfo": legacyText("activityInfo", {"sqlType":"character varying(2000)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "activity_new_PRIMARY", columns: [table["type"]] }),
  uniqueIndex("activity_new_PRIMARY_pad").on(sql.raw("rtrim(\"type\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
