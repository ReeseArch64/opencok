// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const stat_tutorial = cokdb1.table("stat_tutorial", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "tutorial": bigint("tutorial", { mode: "bigint" }).notNull(),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "stat_tutorial_PRIMARY", columns: [table["uid"], table["tutorial"]] }),
  uniqueIndex("stat_tutorial_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"tutorial\"")),
  index("stat_tutorial_index_time").on(sql.raw("\"time\"")),
  index("stat_tutorial_index_tutorial").on(sql.raw("\"tutorial\"")),
]);
