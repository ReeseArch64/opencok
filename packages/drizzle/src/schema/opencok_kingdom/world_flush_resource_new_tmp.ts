import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const world_flush_resource_new_tmp = opencok_kingdom.table("world_flush_resource_new_tmp", {
  "id": integer("id").notNull(),
  "pointType": integer("pointType").notNull(),
  "pointItem": varchar("pointItem", { length: 255 }),
  "resLevel": integer("resLevel").notNull().default(sql.raw("0")),
  "resCostValue": integer("resCostValue").notNull().default(sql.raw("0")),
  "resInitValue": integer("resInitValue").notNull(),
  "flushTime": bigint("flushTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "world_flush_resource_new_tmp_PRIMARY", columns: [table["id"]] }),
]);
