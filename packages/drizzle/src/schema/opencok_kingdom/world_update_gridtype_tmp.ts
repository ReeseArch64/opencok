import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const world_update_gridtype_tmp = opencok_kingdom.table("world_update_gridtype_tmp", {
  "id": bigint("id", { mode: "number" }).notNull().generatedByDefaultAsIdentity({"name":"world_update_gridtype_tmp_id_seq","startWith":1442402,"maxValue":4294967295}),
  "gridType": integer("gridType").notNull(),
  "grid2Type": integer("grid2Type").notNull(),
}, (table) => [
  primaryKey({ name: "world_update_gridtype_tmp_PRIMARY", columns: [table["id"]] }),
  check("world_update_gridtype_tmp_id_range", sql.raw("\"id\" >= 0 AND \"id\" <= 4294967295")),
]);
