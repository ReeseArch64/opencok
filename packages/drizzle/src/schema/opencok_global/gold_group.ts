import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const gold_group = opencok_global.table("gold_group", {
  "itemId": integer("itemId").notNull().default(sql.raw("0")),
  "num": bigint("num", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "gold_group_PRIMARY", columns: [table["itemId"], table["startTime"]] }),
]);
