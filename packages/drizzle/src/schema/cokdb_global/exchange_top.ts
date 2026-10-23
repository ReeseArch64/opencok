import { sql } from "drizzle-orm";
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const exchange_top = cokdb_global.table("exchange_top", {
  "serverId": integer("serverId").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "exchange_top_PRIMARY", columns: [table["serverId"]] }),
]);
