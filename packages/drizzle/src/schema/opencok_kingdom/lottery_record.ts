import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const lottery_record = opencok_kingdom.table("lottery_record", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "type": integer("type").notNull(),
  "superMode": integer("superMode").notNull(),
  "step": integer("step").notNull(),
  "times1": integer("times1").notNull(),
  "times2": integer("times2").notNull(),
  "multiple": integer("multiple").notNull(),
  "result": varchar("result", { length: 100 }).notNull(),
  "lotteryId": varchar("lotteryId", { length: 40 }).notNull(),
  "lotteryInfo1": varchar("lotteryInfo1", { length: 200 }).notNull(),
  "lotteryInfo2": varchar("lotteryInfo2", { length: 100 }).notNull(),
  "updateTime": bigint("updateTime", { mode: "bigint" }).notNull(),
  "times3": integer("times3").default(sql.raw("0")),
  "times4": integer("times4").default(sql.raw("0")),
  "boxTimes": integer("boxTimes").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "lottery_record_PRIMARY", columns: [table["uid"]] }),
]);
