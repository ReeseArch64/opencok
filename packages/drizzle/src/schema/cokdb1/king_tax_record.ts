import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const king_tax_record = cokdb1.table("king_tax_record", {
  "uuid": varchar("uuid", { length: 255 }).notNull(),
  "taxTime": bigint("taxTime", { mode: "bigint" }).default(sql.raw("0")),
  "type": integer("type").default(sql.raw("0")),
  "targetServerName": varchar("targetServerName", { length: 255 }),
  "targetServerId": integer("targetServerId").default(sql.raw("0")),
  "wood": bigint("wood", { mode: "bigint" }).default(sql.raw("0")),
  "food": bigint("food", { mode: "bigint" }).default(sql.raw("0")),
  "iron": bigint("iron", { mode: "bigint" }).default(sql.raw("0")),
  "stone": bigint("stone", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "king_tax_record_PRIMARY", columns: [table["uuid"]] }),
  index("king_tax_record_time_index").on(sql.raw("\"taxTime\"")),
]);
