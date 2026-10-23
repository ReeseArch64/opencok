import { sql } from "drizzle-orm";
import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_pay } from "../namespaces";

export const products = cokdb_pay.table("products", {
  "id": varchar("id", { length: 255 }).notNull(),
  "name": varchar("name", { length: 255 }).notNull().default(sql.raw("'Land of WaR Shop'")),
  "price": varchar("price", { length: 255 }),
  "shop_type": varchar("shop_type", { length: 255 }).notNull().default(sql.raw("'inapp'")),
}, (table) => [
  primaryKey({ name: "products_PRIMARY", columns: [table["id"]] }),
]);
