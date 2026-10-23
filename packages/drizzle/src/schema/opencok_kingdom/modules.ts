import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const modules = opencok_kingdom.table("modules", {
  "module_id": integer("module_id").notNull().generatedByDefaultAsIdentity({"name":"modules_module_id_seq","startWith":1}),
  "module_name": varchar("module_name", { length: 50 }),
  "module_flag": varchar("module_flag", { length: 50 }),
  "app_id": varchar("app_id", { length: 32 }).notNull().default(sql.raw("''")),
  "group_name": varchar("group_name", { length: 255 }).notNull().default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "modules_PRIMARY", columns: [table["module_id"]] }),
]);
