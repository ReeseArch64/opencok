import { sql } from "drizzle-orm";
import { bigint, index, integer, numeric, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_military = cokdb1.table("user_military", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "score": numeric("score", { precision: 11, scale: 2, mode: "number" }).default(sql.raw("0.00")),
  "honor": numeric("honor", { precision: 11, scale: 2, mode: "number" }).default(sql.raw("0.00")),
  "exp": integer("exp").notNull(),
  "level": integer("level").notNull(),
  "lastLevel": integer("lastLevel").default(sql.raw("0")),
  "lastScore": numeric("lastScore", { precision: 11, scale: 2, mode: "number" }).default(sql.raw("0.00")),
  "skillStr": varchar("skillStr", { length: 255 }).default(sql.raw("''")),
  "lastCashTime": bigint("lastCashTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "lastResetTime": bigint("lastResetTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "honorThisWeek": numeric("honorThisWeek", { precision: 11, scale: 2, mode: "number" }).default(sql.raw("0.00")),
}, (table) => [
  primaryKey({ name: "user_military_PRIMARY", columns: [table["uid"]] }),
  index("user_military_military_score_index").on(sql.raw("\"score\"")),
  index("user_military_military_exp_index").on(sql.raw("\"exp\"")),
]);
