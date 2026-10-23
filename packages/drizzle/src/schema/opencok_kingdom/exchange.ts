import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const exchange = opencok_kingdom.table(
  "exchange",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "id": varchar("id", { length: 40 }).notNull(),
    "buy": integer("buy").default(sql.raw("0")),
    "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
    "flush": bigint("flush", { mode: "bigint" }).default(sql.raw("0")),
  },
  (table) => [primaryKey({ name: "exchange_PRIMARY", columns: [table["uid"], table["id"]] })],
);
