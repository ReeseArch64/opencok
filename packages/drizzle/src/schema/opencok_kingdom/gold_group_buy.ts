import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const gold_group_buy = opencok_kingdom.table("gold_group_buy", {
  "id": varchar("id", { length: 40 }).notNull(),
  "flushtime": bigint("flushtime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "num": integer("num").notNull().default(sql.raw("0")),
  "create_time": bigint("create_time", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "gold_group_buy_PRIMARY", columns: [table["id"]] }),
]);
