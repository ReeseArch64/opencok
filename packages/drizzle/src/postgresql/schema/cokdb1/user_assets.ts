// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_assets = cokdb1.table("user_assets", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "winPoint": bigint("winPoint", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "lastUpdateTime": bigint("lastUpdateTime", { mode: "bigint" }).default(sql.raw("0")),
  "lastprottectTime": bigint("lastprottectTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_assets_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_assets_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
]);
