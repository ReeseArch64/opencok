// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const stat_tutorial_analyze = cokdb1.table("stat_tutorial_analyze", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "tutorial": bigint("tutorial", { mode: "bigint" }).notNull(),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "stat_tutorial_analyze_PRIMARY", columns: [table["uid"], table["tutorial"]] }),
  uniqueIndex("stat_tutorial_analyze_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"tutorial\"")),
  index("stat_tutorial_analyze_index_time").on(sql.raw("\"time\"")),
  index("stat_tutorial_analyze_index_tutorial").on(sql.raw("\"tutorial\"")),
]);
