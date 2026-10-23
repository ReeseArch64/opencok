// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_achievement = cokdb1.table("user_achievement", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "id": legacyText("id", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "num": bigint("num", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "state": integer("state").notNull().default(sql.raw("0")),
  "completeTime": bigint("completeTime", { mode: "bigint" }).default(sql.raw("0")),
  "rewardTime": bigint("rewardTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_achievement_PRIMARY", columns: [table["uid"], table["id"]] }),
  uniqueIndex("user_achievement_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
