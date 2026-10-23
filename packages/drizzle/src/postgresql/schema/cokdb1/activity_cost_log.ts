// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const activity_cost_log = cokdb1.table("activity_cost_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "userId": legacyText("userId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "type": integer("type"),
  "total": bigint("total", { mode: "bigint" }),
  "lv": integer("lv"),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "activity_cost_log_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("activity_cost_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
