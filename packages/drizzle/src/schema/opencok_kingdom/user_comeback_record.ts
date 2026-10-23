import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_comeback_record = opencok_kingdom.table(
  "user_comeback_record",
  {
    "uid": varchar("uid", { length: 50 }).notNull(),
    "deviceId": varchar("deviceId", { length: 255 }),
    "configId": varchar("configId", { length: 11 }).notNull(),
    "backType": integer("backType").notNull().default(sql.raw("0")),
    "backTime": bigint("backTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "backReward": smallint("backReward").notNull().default(sql.raw("0")),
    "dailyReward": varchar("dailyReward", { length: 30 }),
    "payReward": varchar("payReward", { length: 100 }),
    "payTotal": bigint("payTotal", { mode: "bigint" }).notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({
      name: "user_comeback_record_PRIMARY",
      columns: [table["uid"], table["configId"]],
    }),
    check("user_comeback_record_backReward_range", sql.raw('"backReward" BETWEEN -128 AND 127')),
  ],
);
