// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_luck_draw = cokdb1.table("user_luck_draw", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull(),
  "count": integer("count"),
  "upTime": bigint("upTime", { mode: "bigint" }),
  "randTime": bigint("randTime", { mode: "bigint" }),
  "reward": legacyText("reward", {"sqlType":"character varying(1000)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "user_luck_draw_PRIMARY", columns: [table["uid"], table["type"]] }),
  uniqueIndex("user_luck_draw_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\"")),
]);
