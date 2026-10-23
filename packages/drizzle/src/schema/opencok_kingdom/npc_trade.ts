import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const npc_trade = opencok_kingdom.table("npc_trade", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "trade": varchar("trade", { length: 100 }).notNull(),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  "num": integer("num").default(sql.raw("0")),
  "superValue": integer("superValue").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "npc_trade_PRIMARY", columns: [table["uid"]] }),
]);
