import { sql } from "drizzle-orm";
import {
  bigint,
  check,
  index,
  integer,
  primaryKey,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const timed_activity = opencok_kingdom.table(
  "timed_activity",
  {
    id: varchar("id", { length: 40 }).notNull(),
    ownerId: varchar("ownerId", { length: 40 }).notNull(),
    queueId: varchar("queueId", { length: 40 }).notNull(),
    type: integer("type").notNull(),
    itemId: varchar("itemId", { length: 255 }).notNull(),
    startedAt: bigint("startedAt", { mode: "bigint" }).notNull(),
    dueAt: bigint("dueAt", { mode: "bigint" }).notNull(),
    version: integer("version").notNull(),
    status: integer("status").notNull(),
  },
  (table) => [
    primaryKey({ name: "timed_activity_PRIMARY", columns: [table.id] }),
    uniqueIndex("timed_activity_running_queue")
      .on(table.queueId)
      .where(sql`"status" = 0`),
    index("timed_activity_due").on(table.status, table.dueAt),
    index("timed_activity_owner").on(table.ownerId),
    check(
      "timed_activity_state",
      sql`"status" IN (0, 1, 2) AND "version" >= 1 AND "dueAt" >= "startedAt"`,
    ),
  ],
);
