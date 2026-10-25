import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const economy_posting = opencok_kingdom.table(
  "economy_posting",
  {
    kingdomId: integer("kingdomId").notNull(),
    ownerUid: varchar("ownerUid", { length: 40 }).notNull(),
    requestId: varchar("requestId", { length: 128 }).notNull(),
    entry: integer("entry").notNull(),
    accountUid: varchar("accountUid", { length: 40 }).notNull(),
    asset: varchar("asset", { length: 64 }).notNull(),
    delta: bigint("delta", { mode: "bigint" }).notNull(),
    before: bigint("before", { mode: "bigint" }).notNull(),
    after: bigint("after", { mode: "bigint" }).notNull(),
    reason: varchar("reason", { length: 128 }).notNull(),
  },
  (table) => [
    primaryKey({
      name: "economy_posting_PRIMARY",
      columns: [table.kingdomId, table.ownerUid, table.requestId, table.entry],
    }),
    check(
      "economy_posting_balance",
      sql.raw(
        '"before" >= 0 AND "after" >= 0 AND "after"::numeric - "before"::numeric = "delta"::numeric',
      ),
    ),
    check("economy_posting_entry", sql.raw('"entry" >= 0')),
  ],
);
