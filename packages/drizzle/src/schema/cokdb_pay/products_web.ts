import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_pay } from "../namespaces";

export const products_web = cokdb_pay.table("products_web", {
  "Id": integer("Id").notNull().generatedByDefaultAsIdentity({"name":"products_web_Id_seq","startWith":2}),
  "name": varchar("name", { length: 255 }),
  "price": varchar("price", { length: 255 }),
  "type": varchar("type", { length: 255 }),
}, (table) => [
  primaryKey({ name: "products_web_PRIMARY", columns: [table["Id"]] }),
]);
