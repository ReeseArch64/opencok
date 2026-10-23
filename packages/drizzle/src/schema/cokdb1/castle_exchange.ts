import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const castle_exchange = cokdb1.table("castle_exchange", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "id": varchar("id", { length: 40 }).notNull(),
  "buy": integer("buy").default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "castle_exchange_PRIMARY", columns: [table["uid"], table["id"]] }),
]);
