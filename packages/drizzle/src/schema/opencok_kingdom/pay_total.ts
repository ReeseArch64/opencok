import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const pay_total = opencok_kingdom.table("pay_total", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "gold": bigint("gold", { mode: "bigint" }),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
  "type": integer("type").notNull().default(sql.raw("1")),
  "getLv": integer("getLv").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "pay_total_PRIMARY", columns: [table["uid"], table["type"]] }),
]);
