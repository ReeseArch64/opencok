import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const monster_everyday_refresh = cokdb1.table("monster_everyday_refresh", {
  "monster_id": varchar("monster_id", { length: 255 }).notNull().default(sql.raw("''")),
  "monster_num": integer("monster_num"),
  "refreshtime": bigint("refreshtime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "monster_everyday_refresh_PRIMARY", columns: [table["monster_id"]] }),
]);
