import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const world_basttile_dead = opencok_kingdom.table(
  "world_basttile_dead",
  {
    "id": varchar("id", { length: 40 }).notNull(),
    "areaId": integer("areaId").notNull(),
    "level": integer("level").notNull(),
    "pointItem": varchar("pointItem", { length: 255 }).default(sql.raw("'0'")),
    "deadFinishTime": bigint("deadFinishTime", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "world_basttile_dead_PRIMARY", columns: [table["id"]] }),
    index("world_basttile_dead_dead_res_time").on(sql.raw('"deadFinishTime"')),
    index("world_basttile_dead_areaId_index").on(sql.raw('"areaId"')),
  ],
);
