// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_gold_wheel = cokdb1.table("user_gold_wheel", {
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "hide_king": integer("hide_king").notNull().default(sql.raw("0")),
  "normal_free": integer("normal_free").notNull().default(sql.raw("0")),
  "normal_total": integer("normal_total").notNull().default(sql.raw("0")),
  "normal_last_free_millis": bigint("normal_last_free_millis", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "silver_usable": integer("silver_usable").notNull().default(sql.raw("0")),
  "silver_usable_free": integer("silver_usable_free").notNull().default(sql.raw("0")),
  "silver_daily": integer("silver_daily").notNull().default(sql.raw("0")),
  "silver_total": integer("silver_total").notNull().default(sql.raw("0")),
  "silver_last_add_millis": bigint("silver_last_add_millis", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "silver_last_free_millis": bigint("silver_last_free_millis", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "gold_daily": integer("gold_daily").notNull().default(sql.raw("0")),
  "gold_usable": integer("gold_usable").notNull().default(sql.raw("0")),
  "gold_total": integer("gold_total").notNull().default(sql.raw("0")),
  "gold_last_add_millis": bigint("gold_last_add_millis", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "last_normal_wheel_millis": bigint("last_normal_wheel_millis", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "rewardFlags": legacyText("rewardFlags", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "user_gold_wheel_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_gold_wheel_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
