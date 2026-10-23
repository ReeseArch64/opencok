import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const cross_throne_occupy_record = cokdb_global.table("cross_throne_occupy_record", {
  "uuid": varchar("uuid", { length: 50 }).notNull().default(sql.raw("''")),
  "king_info_id": varchar("king_info_id", { length: 50 }).notNull().default(sql.raw("''")),
  "uid": varchar("uid", { length: 50 }),
  "name": varchar("name", { length: 50 }),
  "alliance_abbr": varchar("alliance_abbr", { length: 50 }),
  "server_id": integer("server_id"),
  "kingdom_name": varchar("kingdom_name", { length: 50 }),
  "start_millis": bigint("start_millis", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "cross_throne_occupy_record_PRIMARY", columns: [table["king_info_id"], table["uuid"]] }),
]);
