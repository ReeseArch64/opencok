import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const reward_107 = cokdb1.table("reward_107", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "version": varchar("version", { length: 255 }).notNull(),
  "sid": integer("sid").default(sql.raw("0")),
  "107uid": varchar("107uid", { length: 255 }),
  "name": varchar("name", { length: 255 }),
  "rewardLevel": integer("rewardLevel").default(sql.raw("0")),
  "rewardStatus": integer("rewardStatus").default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "reward_107_PRIMARY", columns: [table["uid"], table["version"]] }),
  index("reward_107_time_idx").on(sql.raw("\"endTime\"")),
  index("reward_107_stat_idx").on(sql.raw("\"rewardStatus\"")),
]);
