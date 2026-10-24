import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const avatar_completion = opencok_kingdom.table(
  "avatar_completion",
  {
    ownerUid: varchar("ownerUid", { length: 20 }).notNull(),
    sequence: integer("sequence").notNull(),
    hash: varchar("hash", { length: 64 }).notNull(),
    picVer: integer("picVer").notNull(),
    committedAt: bigint("committedAt", { mode: "bigint" }).notNull(),
    effects: text("effects").notNull(),
    pendingEffects: integer("pendingEffects").notNull(),
  },
  (table) => [
    primaryKey({ name: "avatar_completion_PRIMARY", columns: [table.ownerUid, table.sequence] }),
    index("avatar_completion_pending").on(
      table.pendingEffects,
      table.committedAt,
      table.ownerUid,
      table.sequence,
    ),
    check("avatar_completion_owner", sql.raw("\"ownerUid\" ~ '^[0-9]{1,20}$'")),
    check("avatar_completion_sequence", sql.raw('"sequence" >= 1 AND "sequence" <= 999999')),
    check("avatar_completion_hash", sql.raw("\"hash\" ~ '^[a-f0-9]{64}$'")),
    check(
      "avatar_completion_version",
      sql.raw('"picVer" >= 0 AND "picVer" % 1000000 = "sequence"'),
    ),
    check("avatar_completion_time", sql.raw('"committedAt" >= 0')),
    check("avatar_completion_effects_size", sql.raw('octet_length("effects") <= 65535')),
    check(
      "avatar_completion_pending_range",
      sql.raw('"pendingEffects" >= 0 AND "pendingEffects" <= 7'),
    ),
  ],
);
