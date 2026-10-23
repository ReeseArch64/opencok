import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_pay } from "../namespaces";

export const goods_name = cokdb_pay.table("goods_name", {
  "id": varchar("id", { length: 255 }).notNull(),
  "name": varchar("name", { length: 255 }),
  "icon": varchar("icon", { length: 255 }),
}, (table) => [
  primaryKey({ name: "goods_name_PRIMARY", columns: [table["id"]] }),
]);
