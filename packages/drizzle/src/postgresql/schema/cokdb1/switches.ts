// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const switches = cokdb1.table("switches", {
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "stat": integer("stat").default(sql.raw("0")),
  "appVersion": legacyText("appVersion", {"sqlType":"character varying(255)","collation":"C"}),
}, (table) => [
  primaryKey({ name: "switches_PRIMARY", columns: [table["name"]] }),
  uniqueIndex("switches_PRIMARY_pad").on(sql.raw("rtrim(\"name\", ' ') COLLATE \"C\"")),
]);
