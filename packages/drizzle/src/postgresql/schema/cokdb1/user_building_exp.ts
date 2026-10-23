// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_building_exp = cokdb1.table("user_building_exp", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.sv_ci"}).notNull(),
  "historyMax": bigint("historyMax", { mode: "bigint" }).default(sql.raw("0")),
  "currentMax": bigint("currentMax", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_building_exp_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_building_exp_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"sv_ci\"")),
]);
