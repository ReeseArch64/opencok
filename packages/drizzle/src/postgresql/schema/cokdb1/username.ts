// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const username = cokdb1.table("username", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "people": integer("people").notNull().default(sql.raw("0")),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }).notNull(),
  "leagueTime": bigint("leagueTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "username_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("username_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
