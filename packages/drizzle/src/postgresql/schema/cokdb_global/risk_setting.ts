// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const risk_setting = cokdb_global.table("risk_setting", {
  "id": legacyText("id", {"sqlType":"character varying(40)","collation":"C"}).notNull(),
  "k1": integer("k1"),
  "k2": integer("k2"),
  "k3": integer("k3"),
}, (table) => [
  primaryKey({ name: "risk_setting_PRIMARY", columns: [table["id"]] }),
  uniqueIndex("risk_setting_PRIMARY_pad").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"C\"")),
]);
