// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const activity_cost = cokdb1.table("activity_cost", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull(),
  "total": bigint("total", { mode: "bigint" }),
  "para1": bigint("para1", { mode: "bigint" }),
  "para2": bigint("para2", { mode: "bigint" }),
  "lv": integer("lv"),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
  "getLv": legacyText("getLv", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "activity_cost_PRIMARY", columns: [table["uid"], table["type"]] }),
  uniqueIndex("activity_cost_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\"")),
]);
