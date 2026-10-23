import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const tavern = opencok_kingdom.table(
  "tavern",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "free": integer("free").notNull(),
    "firstFree": integer("firstFree").notNull(),
    "firstPay": integer("firstPay").notNull(),
    "freeTimes": integer("freeTimes").notNull(),
    "payTimes": integer("payTimes").notNull(),
    "generals": varchar("generals", { length: 255 }),
    "generalId1": varchar("generalId1", { length: 40 }),
    "generalId2": varchar("generalId2", { length: 40 }),
    "generalId3": varchar("generalId3", { length: 40 }),
    "generalId4": varchar("generalId4", { length: 40 }),
    "generalId5": varchar("generalId5", { length: 40 }),
    "generalId6": varchar("generalId6", { length: 40 }),
    "recruit1": integer("recruit1").notNull(),
    "recruit2": integer("recruit2").notNull(),
    "recruit3": integer("recruit3").notNull(),
    "recruit4": integer("recruit4").notNull(),
    "recruit5": integer("recruit5").notNull(),
    "recruit6": integer("recruit6").notNull(),
    "addFreeTime": bigint("addFreeTime", { mode: "bigint" }).notNull(),
    "resetResult": integer("resetResult").notNull(),
  },
  (table) => [primaryKey({ name: "tavern_PRIMARY", columns: [table["uid"]] })],
);
