import { sql } from "drizzle-orm";
import { bigint, index, integer, numeric, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_military_rank = opencok_kingdom.table("user_military_rank", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "militaryScore": numeric("militaryScore", { precision: 11, scale: 2, mode: "number" }).default(sql.raw("0.00")),
  "honor": numeric("honor", { precision: 11, scale: 2, mode: "number" }).default(sql.raw("0.00")),
  "rankingExp": integer("rankingExp").notNull(),
  "militaryRank": integer("militaryRank").notNull(),
  "award": varchar("award", { length: 500 }).notNull().default(sql.raw("''")),
  "lastRanking": integer("lastRanking").default(sql.raw("0")),
  "lastMilitaryScore": numeric("lastMilitaryScore", { precision: 11, scale: 2, mode: "number" }).default(sql.raw("0.00")),
  "skill": varchar("skill", { length: 255 }).default(sql.raw("''")),
  "status": integer("status").notNull().default(sql.raw("1")),
  "lastTimeSet0Tostatus": bigint("lastTimeSet0Tostatus", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "awardReceived": integer("awardReceived").notNull().default(sql.raw("1")),
  "lastTimeReset": bigint("lastTimeReset", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "maxHonorWeekly": numeric("maxHonorWeekly", { precision: 11, scale: 2, mode: "number" }).default(sql.raw("0.00")),
  "lastRewardTime": bigint("lastRewardTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_military_rank_PRIMARY", columns: [table["uid"]] }),
  index("user_military_rank_index_militaryScore").on(sql.raw("\"militaryScore\"")),
  index("user_military_rank_index_rankingExp").on(sql.raw("\"rankingExp\"")),
]);
