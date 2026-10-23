import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const world_flush_basttile_tmp = cokdb1.table("world_flush_basttile_tmp", {
  "id": integer("id").notNull(),
  "pointType": integer("pointType").notNull(),
  "pointItem": varchar("pointItem", { length: 255 }),
  "resLevel": integer("resLevel").notNull().default(sql.raw("0")),
  "flushTime": bigint("flushTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "world_flush_basttile_tmp_PRIMARY", columns: [table["id"]] }),
]);
