import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const world_res_record = cokdb1.table("world_res_record", {
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
