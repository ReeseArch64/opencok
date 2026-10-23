import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const world_field_monster_dead = opencok_kingdom.table(
  "world_field_monster_dead",
  {
    "uuid": varchar("uuid", { length: 40 }).notNull(),
    "id": integer("id").notNull(),
    "monster": varchar("monster", { length: 40 }),
    "deadFinishTime": bigint("deadFinishTime", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "world_field_monster_dead_PRIMARY", columns: [table["uuid"]] }),
    index("world_field_monster_dead_dead_monster_time").on(sql.raw('"deadFinishTime"')),
  ],
);
