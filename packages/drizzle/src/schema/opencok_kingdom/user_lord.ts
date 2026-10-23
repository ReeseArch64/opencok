import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_lord = opencok_kingdom.table("user_lord", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "userSign": varchar("userSign", { length: 50 }),
  "medal": varchar("medal", { length: 50 }),
  "levelUp": integer("levelUp").default(sql.raw("1")),
  "firstJoinAllianceFlag": integer("firstJoinAllianceFlag").default(sql.raw("1")),
  "newPlayerAwardSoldierFlag": integer("newPlayerAwardSoldierFlag").default(sql.raw("0")),
  "lastPayTime": bigint("lastPayTime", { mode: "bigint" }).default(sql.raw("0")),
  "pveLevel": integer("pveLevel").default(sql.raw("1")),
  "firstBindAccountRewardFlag": integer("firstBindAccountRewardFlag"),
  "dailyTaskFlushTime": bigint("dailyTaskFlushTime", { mode: "bigint" }).default(sql.raw("0")),
  "dailyTaskComplete": integer("dailyTaskComplete").default(sql.raw("0")),
  "isHDLogin": integer("isHDLogin").default(sql.raw("0")),
  "freshRecharge": integer("freshRecharge").default(sql.raw("0")),
  "freshRechargeTotal": integer("freshRechargeTotal").default(sql.raw("0")),
  "barbarionCount": integer("barbarionCount").default(sql.raw("0")),
  "lastClearBarbarionTime": bigint("lastClearBarbarionTime", { mode: "bigint" }).default(sql.raw("0")),
  "newSerCumRechargeTotal": bigint("newSerCumRechargeTotal", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "newDailyTaskFlushTime": bigint("newDailyTaskFlushTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "newDailyTaskBoxRewardId": integer("newDailyTaskBoxRewardId").notNull().default(sql.raw("0")),
  "newDailyTaskBoxRewardState": integer("newDailyTaskBoxRewardState").notNull().default(sql.raw("0")),
  "castleLevelUp": integer("castleLevelUp").default(sql.raw("0")),
  "castleLevelUpStatus": integer("castleLevelUpStatus").default(sql.raw("0")),
  "remainAttackLeaderBossTime": integer("remainAttackLeaderBossTime").default(sql.raw("0")),
  "refreshAtkLeaderBossTime": bigint("refreshAtkLeaderBossTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_lord_PRIMARY", columns: [table["uid"]] }),
]);
