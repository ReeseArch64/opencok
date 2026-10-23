import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const shopping_mall = cokdb1.table("shopping_mall", {
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "id": varchar("id", { length: 40 }).notNull(),
  "buyDaily": integer("buyDaily").default(sql.raw("0")),
  "buyTime": bigint("buyTime", { mode: "bigint" }).default(sql.raw("0")),
  "buyTotal": integer("buyTotal").default(sql.raw("0")),
  "flushTotalTime": bigint("flushTotalTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "shopping_mall_PRIMARY", columns: [table["uid"], table["id"]] }),
]);
