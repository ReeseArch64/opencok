import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const exchange_log = cokdb_global.table("exchange_log", {
  "Id": integer("Id").notNull().generatedByDefaultAsIdentity({"name":"exchange_log_Id_seq","startWith":64}),
  "orderId": varchar("orderId", { length: 255 }).notNull().default(sql.raw("''")),
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "productId": varchar("productId", { length: 255 }).notNull().default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "exchange_log_PRIMARY", columns: [table["Id"]] }),
]);
