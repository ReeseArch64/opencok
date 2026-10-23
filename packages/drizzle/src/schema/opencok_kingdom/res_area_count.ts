import { integer, primaryKey } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const res_area_count = opencok_kingdom.table("res_area_count", {
  "areaId": integer("areaId").notNull(),
  "count": integer("count").notNull(),
}, (table) => [
  primaryKey({ name: "res_area_count_PRIMARY", columns: [table["areaId"]] }),
]);
