import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const exchange_group_type = opencok_kingdom.table("exchange_group_type", {
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "group_type": integer("group_type").notNull().default(sql.raw("0")),
  "id": integer("id"),
  "refreshtime": bigint("refreshtime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "exchange_group_type_PRIMARY", columns: [table["uid"], table["group_type"]] }),
]);
