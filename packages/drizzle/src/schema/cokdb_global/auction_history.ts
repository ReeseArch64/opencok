import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const auction_history = cokdb_global.table("auction_history", {
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "uuid": varchar("uuid", { length: 255 }).notNull().default(sql.raw("''")),
  "groupId": integer("groupId"),
  "name": varchar("name", { length: 255 }).notNull(),
  "itemId": varchar("itemId", { length: 20 }).notNull(),
  "itemNum": integer("itemNum").notNull(),
  "price": integer("price"),
  "time": bigint("time", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "auction_history_PRIMARY", columns: [table["uid"], table["uuid"]] }),
]);
