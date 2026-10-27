import { sql } from "drizzle-orm";
import {
  bigint,
  check,
  index,
  integer,
  primaryKey,
  uniqueIndex,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";
export const expedition_calendar = opencok_global.table(
  "expedition_calendar",
  {
    id: varchar("id", { length: 32 }).notNull(),
    startTime: bigint("startTime", { mode: "bigint" }).notNull(),
    endTime: bigint("endTime", { mode: "bigint" }).notNull(),
    schedule: text("schedule").notNull(),
    expectedRealms: varchar("expectedRealms", { length: 1535 }).notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
    cycle: integer("cycle").notNull(),
    state: integer("state").notNull(),
    sourceId: varchar("sourceId", { length: 40 }),
  },
  (table) => [
    primaryKey({ name: "expedition_calendar_PRIMARY", columns: [table.id] }),
    index("expedition_calendar_latest").on(table.endTime),
    uniqueIndex("expedition_calendar_active").on(table.state).where(sql.raw('"state" = 0')),

    check(
      "expedition_calendar_bounds",
      sql.raw(
        '"startTime" >= 0 AND "endTime" > "startTime" AND "createdAt" >= "startTime" AND "createdAt" < "endTime" AND "cycle" > 0 AND "state" IN (0,1) AND octet_length("schedule") BETWEEN 1 AND 8192 AND length("expectedRealms") > 0',
      ),
    ),
  ],
);
