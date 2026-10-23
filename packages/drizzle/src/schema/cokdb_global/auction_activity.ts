import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const auction_activity = cokdb_global.table("auction_activity", {
  "id": integer("id").notNull().default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }).notNull(),
  "endTime": bigint("endTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "auction_activity_PRIMARY", columns: [table["id"]] }),
]);
