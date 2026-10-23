import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const world_res_record = opencok_kingdom.table("world_res_record", {
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "id": integer("id").notNull(),
  "x": integer("x").notNull(),
  "y": integer("y").notNull(),
  "areaId": integer("areaId").notNull(),
  "level": integer("level"),
  "pointItem": varchar("pointItem", { length: 255 }),
}, (table) => [
  primaryKey({ name: "world_res_record_PRIMARY", columns: [table["time"], table["id"]] }),
]);
