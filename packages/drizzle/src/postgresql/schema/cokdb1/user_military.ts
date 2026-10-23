// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_military = cokdb1.table("user_military", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "score": legacyNumber("score", {"sqlType":"numeric(11,2)"}).default(sql.raw("0.00")),
  "honor": legacyNumber("honor", {"sqlType":"numeric(11,2)"}).default(sql.raw("0.00")),
  "exp": integer("exp").notNull(),
  "level": integer("level").notNull(),
  "lastLevel": integer("lastLevel").default(sql.raw("0")),
  "lastScore": legacyNumber("lastScore", {"sqlType":"numeric(11,2)"}).default(sql.raw("0.00")),
  "skillStr": legacyText("skillStr", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "lastCashTime": bigint("lastCashTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "lastResetTime": bigint("lastResetTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "honorThisWeek": legacyNumber("honorThisWeek", {"sqlType":"numeric(11,2)"}).default(sql.raw("0.00")),
}, (table) => [
  primaryKey({ name: "user_military_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_military_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_military_military_score_index").on(sql.raw("\"score\"")),
  index("user_military_military_exp_index").on(sql.raw("\"exp\"")),
]);
