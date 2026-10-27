import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const world_resource_runtime = opencok_kingdom.table(
  "world_resource_runtime",
  {
    worldId: integer("worldId").notNull(),
    groupStartedAt: bigint("groupStartedAt", { mode: "bigint" }).notNull(),
    usedGroups: varchar("usedGroups", { length: 128 }).notNull(),
    areaCursor: integer("areaCursor").notNull(),
    nextRefreshAt: bigint("nextRefreshAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "world_resource_runtime_PRIMARY", columns: [table.worldId] }),
    check(
      "world_resource_runtime_bounds",
      sql.raw(
        '"worldId" = 0 AND "groupStartedAt" >= 0 AND "areaCursor" >= 0 AND "nextRefreshAt" >= 0 AND octet_length("usedGroups") BETWEEN 1 AND 128',
      ),
    ),
  ],
);
