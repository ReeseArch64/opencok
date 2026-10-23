import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_growth_fund = opencok_kingdom.table("user_growth_fund", {
  "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
  "type": integer("type").notNull().default(sql.raw("0")),
  "itemId": varchar("itemId", { length: 40 }),
  "buyTime": bigint("buyTime", { mode: "bigint" }),
  "extra": text("extra"),
  "status": integer("status"),
}, (table) => [
  primaryKey({ name: "user_growth_fund_PRIMARY", columns: [table["uid"], table["type"]] }),
]);
