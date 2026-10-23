import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const world_barbarion_dead = cokdb1.table("world_barbarion_dead", {
  "id": varchar("id", { length: 40 }).notNull(),
  "areaId": integer("areaId").notNull(),
  "level": integer("level").notNull(),
  "pointItem": varchar("pointItem", { length: 255 }).default(sql.raw("'0'")),
  "deadFinishTime": bigint("deadFinishTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "world_barbarion_dead_PRIMARY", columns: [table["id"]] }),
  index("world_barbarion_dead_dead_res_time").on(sql.raw("\"deadFinishTime\"")),
  index("world_barbarion_dead_areaId_index").on(sql.raw("\"areaId\"")),
]);
