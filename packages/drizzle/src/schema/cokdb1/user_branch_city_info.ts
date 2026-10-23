import { bigint, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_branch_city_info = cokdb1.table("user_branch_city_info", {
  "uid": varchar("uid", { length: 32 }).notNull(),
  "openstate": smallint("openstate").notNull(),
  "takerewardcount": integer("takerewardcount").notNull(),
  "takerewardtime": bigint("takerewardtime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_branch_city_info_PRIMARY", columns: [table["uid"]] }),
]);
