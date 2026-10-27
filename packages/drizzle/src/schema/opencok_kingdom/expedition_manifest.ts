import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const expedition_manifest = opencok_kingdom.table(
  "expedition_manifest",
  {
    periodId: varchar("periodId", { length: 40 }).notNull(),
    serverId: integer("serverId").notNull(),
    matchServerId: integer("matchServerId").notNull(),
    schedule: text("schedule").notNull(),
    startTime: bigint("startTime", { mode: "bigint" }).notNull(),
    endTime: bigint("endTime", { mode: "bigint" }).notNull(),
    recordedAt: bigint("recordedAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "expedition_manifest_PRIMARY", columns: [table.periodId, table.serverId] }),
    index("expedition_manifest_end").on(table.endTime),
    check(
      "expedition_manifest_bounds",
      sql.raw(
        '"serverId" > 0 AND "matchServerId" > 0 AND "serverId" <> "matchServerId" AND "startTime" >= 0 AND "endTime" > "startTime" AND "recordedAt" >= 0 AND octet_length("schedule") BETWEEN 1 AND 8192',
      ),
    ),
  ],
);
