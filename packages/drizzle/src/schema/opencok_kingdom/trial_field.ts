import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const trial_field = opencok_kingdom.table("trial_field", {
  "uid": varchar("uid", { length: 50 }).notNull(),
  "freeTrial": integer("freeTrial").default(sql.raw("0")),
  "freeFresh": bigint("freeFresh", { mode: "bigint" }).default(sql.raw("0")),
  "freeAtk": integer("freeAtk").default(sql.raw("0")),
  "monster": varchar("monster", { length: 50 }).default(sql.raw("''")),
  "blood": integer("blood").default(sql.raw("0")),
  "screen": varchar("screen", { length: 255 }).default(sql.raw("''")),
  "buyTrial": integer("buyTrial").default(sql.raw("0")),
  "buyAtk": integer("buyAtk").default(sql.raw("0")),
  "chargeAtkTimes": integer("chargeAtkTimes").default(sql.raw("0")),
  "rewardMonster": varchar("rewardMonster", { length: 50 }).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "trial_field_PRIMARY", columns: [table["uid"]] }),
]);
