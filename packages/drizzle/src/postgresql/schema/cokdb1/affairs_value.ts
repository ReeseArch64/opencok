// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const affairs_value = cokdb1.table("affairs_value", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "people": integer("people").notNull().default(sql.raw("0")),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }).notNull(),
  "leagueTime": bigint("leagueTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "affairs_value_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("affairs_value_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
