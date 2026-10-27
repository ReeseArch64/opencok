import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar, check } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const world_march_checkpoint = opencok_kingdom.table(
  "world_march_checkpoint",
  {
    id: varchar("id", { length: 40 }).notNull(),
    ownerUid: varchar("ownerUid", { length: 40 }).notNull(),
    version: integer("version").notNull(),
    status: integer("status").notNull(),
    dueAt: bigint("dueAt", { mode: "bigint" }).notNull(),
    payload: bytea("payload").notNull(),
  },
  (table) => [
    check(
      "world_march_checkpoint_bounds",
      sql`"version" >= 1 AND "status" IN (0, 1) AND "dueAt" >= 0 AND octet_length("payload") <= 65535`,
    ),
    primaryKey({ name: "world_march_checkpoint_PRIMARY", columns: [table.id] }),
    index("world_march_checkpoint_due").on(table.status, table.dueAt, table.id),
    index("world_march_checkpoint_owner").on(table.ownerUid),
  ],
);
