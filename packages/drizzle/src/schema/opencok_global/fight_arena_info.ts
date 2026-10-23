import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const fight_arena_info = opencok_global.table(
  "fight_arena_info",
  {
    "worldId": integer("worldId").notNull(),
    "state": integer("state"),
    "endTime": bigint("endTime", { mode: "bigint" }),
    "version": integer("version"),
  },
  (table) => [primaryKey({ name: "fight_arena_info_PRIMARY", columns: [table["worldId"]] })],
);
