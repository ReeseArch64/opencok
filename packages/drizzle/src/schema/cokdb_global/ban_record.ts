import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const ban_record = cokdb_global.table("ban_record", {
  "uuid": varchar("uuid", { length: 40 }).notNull(),
  "serverId": integer("serverId").notNull(),
  "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  "operator": varchar("operator", { length: 40 }),
  "reason": varchar("reason", { length: 250 }),
  "opDate": varchar("opDate", { length: 20 }).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "ban_record_PRIMARY", columns: [table["uuid"]] }),
  index("ban_record_index_uid").on(sql.raw("\"uid\"")),
]);
