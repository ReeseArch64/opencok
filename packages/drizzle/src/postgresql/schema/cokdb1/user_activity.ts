// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_activity = cokdb1.table("user_activity", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull().default(sql.raw("0")),
  "actId": legacyText("actId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "status": integer("status").notNull().default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_activity_PRIMARY", columns: [table["uid"], table["actId"]] }),
  uniqueIndex("user_activity_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"actId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
