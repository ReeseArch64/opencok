import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const castle_leveling_0 = cokdb1.table("castle_leveling_0", {
  "uid": varchar("uid", { length: 50 }).notNull(),
  "level": integer("level").notNull(),
  "lv_reward": integer("lv_reward").notNull().default(sql.raw("0")),
  "share_reward_0": integer("share_reward_0").notNull().default(sql.raw("0")),
  "share_reward_1": integer("share_reward_1").notNull().default(sql.raw("0")),
  "share_reward_2": integer("share_reward_2").notNull().default(sql.raw("0")),
  "share_reward_3": integer("share_reward_3").notNull().default(sql.raw("0")),
  "share_reward_4": integer("share_reward_4").notNull().default(sql.raw("0")),
  "share_reward_5": integer("share_reward_5").notNull().default(sql.raw("0")),
  "share_reward_6": integer("share_reward_6").notNull().default(sql.raw("0")),
  "pay_times_0": integer("pay_times_0").notNull().default(sql.raw("0")),
  "pay_times_1": integer("pay_times_1").notNull().default(sql.raw("0")),
  "pay_times_2": integer("pay_times_2").notNull().default(sql.raw("0")),
  "pay_times_3": integer("pay_times_3").notNull().default(sql.raw("0")),
  "pay_times_4": integer("pay_times_4").notNull().default(sql.raw("0")),
  "pay_times_5": integer("pay_times_5").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "castle_leveling_0_PRIMARY", columns: [table["uid"], table["level"]] }),
]);
