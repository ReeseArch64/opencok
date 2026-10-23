import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_continue_pay = opencok_kingdom.table("user_continue_pay", {
  "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
  "productId": varchar("productId", { length: 40 }).notNull(),
  "goldCount": integer("goldCount").default(sql.raw("0")),
  "status": integer("status"),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_continue_pay_PRIMARY", columns: [table["uid"], table["productId"]] }),
]);
