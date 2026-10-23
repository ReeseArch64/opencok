import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const bantime_reason = cokdb_global.table("bantime_reason", {
  "serverId": varchar("serverId", { length: 40 }).notNull().default(sql.raw("''")),
  "uid": varchar("uid", { length: 200 }).notNull().default(sql.raw("''")),
  "operator": varchar("operator", { length: 40 }),
  "reason": varchar("reason", { length: 250 }),
  "opeDate": varchar("opeDate", { length: 20 }).default(sql.raw("''")),
  "status": integer("status").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "bantime_reason_PRIMARY", columns: [table["serverId"], table["uid"]] }),
]);
