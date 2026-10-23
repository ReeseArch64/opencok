import { sql } from "drizzle-orm";
import { check, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const menu = cokdb1.table("menu", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({"name":"menu_id_seq","startWith":1}),
  "module_id": integer("module_id"),
  "name": varchar("name", { length: 50 }),
  "pinyin": varchar("pinyin", { length: 200 }),
  "path": varchar("path", { length: 200 }),
  "type": varchar("type", { length: 10 }),
  "p_id": integer("p_id"),
  "comments": varchar("comments", { length: 100 }),
  "is_prod": smallint("is_prod"),
  "is_log": smallint("is_log"),
  "order_num": varchar("order_num", { length: 9 }),
}, (table) => [
  primaryKey({ name: "menu_PRIMARY", columns: [table["id"]] }),
  check("menu_is_prod_range", sql.raw("\"is_prod\" BETWEEN -128 AND 127")),
  check("menu_is_log_range", sql.raw("\"is_log\" BETWEEN -128 AND 127")),
]);
