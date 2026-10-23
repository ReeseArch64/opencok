import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const fast_carry_activity = cokdb1.table("fast_carry_activity", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "type": varchar("type", { length: 40 }).notNull().default(sql.raw("'17'")),
  "totalPoint": integer("totalPoint").notNull().default(sql.raw("0")),
  "lastEndTime": bigint("lastEndTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "reward1": varchar("reward1", { length: 40 }).notNull().default(sql.raw("'-1'")),
  "reward2": varchar("reward2", { length: 40 }).notNull().default(sql.raw("'-1'")),
  "reward3": varchar("reward3", { length: 40 }).notNull().default(sql.raw("'-1'")),
  "reward4": varchar("reward4", { length: 40 }).notNull().default(sql.raw("'-1'")),
  "goalReward1": integer("goalReward1").notNull().default(sql.raw("0")),
  "goalReward2": integer("goalReward2").notNull().default(sql.raw("0")),
  "goalReward3": integer("goalReward3").notNull().default(sql.raw("0")),
  "goalReward4": integer("goalReward4").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "fast_carry_activity_PRIMARY", columns: [table["uid"], table["lastEndTime"]] }),
  index("fast_carry_activity_goalReward").on(sql.raw("\"goalReward1\""), sql.raw("\"goalReward2\""), sql.raw("\"goalReward3\""), sql.raw("\"goalReward4\"")),
]);
