// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_civilization_science = cokdb1.table("user_civilization_science", {
  "baseItemID": integer("baseItemID").notNull(),
  "userID": legacyText("userID", {"sqlType":"character varying(64)","collation":"legacy_meta.ci"}).notNull(),
  "level": integer("level"),
}, (table) => [
  primaryKey({ name: "user_civilization_science_PRIMARY", columns: [table["baseItemID"], table["userID"]] }),
  uniqueIndex("user_civilization_science_PRIMARY_pad").on(sql.raw("\"baseItemID\""), sql.raw("rtrim(\"userID\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
