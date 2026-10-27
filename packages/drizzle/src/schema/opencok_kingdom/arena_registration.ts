import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar, index, check } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const arena_registration = opencok_kingdom.table(
  "arena_registration",
  {
    uid: varchar("uid", { length: 40 }).notNull(),
    rankScore: integer("rankScore").notNull(),
    state: integer("state").notNull(),
    fightServerId: integer("fightServerId").notNull(),
    worldId: integer("worldId").notNull(),
    version: integer("version").notNull(),
    time: bigint("time", { mode: "bigint" }).notNull(),
    totalWinCount: integer("totalWinCount").notNull(),
    totalLoseCount: integer("totalLoseCount").notNull(),
    serialWinCount: integer("serialWinCount").notNull(),
    applicationId: varchar("applicationId", { length: 40 }).notNull(),
  },
  (table) => [
    primaryKey({ name: "arena_registration_PRIMARY", columns: [table.uid] }),
    index("arena_registration_pending").on(table.state, table.time, table.uid),
    check(
      "arena_registration_bounds",
      sql`"state" IN (0, 1, 2, 3) AND "rankScore" >= 0 AND "fightServerId" >= 0 AND "worldId" >= 0 AND "version" >= 0 AND "time" >= 0 AND "totalWinCount" >= 0 AND "totalLoseCount" >= 0 AND "serialWinCount" >= 0`,
    ),
  ],
);
