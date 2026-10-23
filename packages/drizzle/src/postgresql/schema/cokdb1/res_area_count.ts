// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";
export const res_area_count = cokdb1.table("res_area_count", {
  "areaId": integer("areaId").notNull(),
  "count": integer("count").notNull(),
}, (table) => [
  primaryKey({ name: "res_area_count_PRIMARY", columns: [table["areaId"]] }),
]);
