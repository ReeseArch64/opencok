import { sql } from "drizzle-orm";
import { bigint, check, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const recharge_feedback_claim = opencok_kingdom.table(
  "recharge_feedback_claim",
  {
    uid: varchar("uid", { length: 40 }).notNull(),
    id: varchar("id", { length: 40 }).notNull(),
    startTime: bigint("startTime", { mode: "bigint" }).notNull(),
    endTime: bigint("endTime", { mode: "bigint" }).notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({
      name: "recharge_feedback_claim_PRIMARY",
      columns: [table.uid, table.id, table.startTime, table.endTime],
    }),
    check(
      "recharge_feedback_claim_bounds",
      sql.raw('"startTime" >= 0 AND "endTime" >= "startTime" AND "createdAt" >= 0'),
    ),
  ],
);
