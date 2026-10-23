import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const server_list = cokdb_global.table("server_list", {
  "id": integer("id").notNull().default(sql.raw("0")),
  "port": integer("port"),
  "name": varchar("name", { length: 64 }),
  "zone": varchar("zone", { length: 8 }),
  "ip": varchar("ip", { length: 128 }),
  "state": integer("state").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "server_list_PRIMARY", columns: [table["id"]] }),
  index("server_list_index_ip").on(sql.raw("\"ip\"")),
]);
