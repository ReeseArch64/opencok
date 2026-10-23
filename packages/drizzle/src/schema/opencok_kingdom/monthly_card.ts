import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const monthly_card = opencok_kingdom.table("monthly_card", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "itemId": varchar("itemId", { length: 40 }).notNull(),
  "accept": integer("accept").default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  "available": integer("available").default(sql.raw("0")),
  "buyTime": bigint("buyTime", { mode: "bigint" }).default(sql.raw("0")),
  "optionId": integer("optionId"),
}, (table) => [
  primaryKey({ name: "monthly_card_PRIMARY", columns: [table["uid"], table["itemId"]] }),
]);
