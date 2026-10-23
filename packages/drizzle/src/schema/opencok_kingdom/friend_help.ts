import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const friend_help = opencok_kingdom.table("friend_help", {
  "fromId": varchar("fromId", { length: 40 }).notNull(),
  "toId": varchar("toId", { length: 20 }).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "friend_help_PRIMARY", columns: [table["fromId"], table["toId"]] }),
]);
