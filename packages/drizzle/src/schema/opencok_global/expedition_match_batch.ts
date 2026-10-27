import { sql } from "drizzle-orm";
import { bigint, check, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const expedition_match_batch = opencok_global.table(
  "expedition_match_batch",
  {
    periodId: varchar("periodId", { length: 32 }).notNull(),
    admissionStart: bigint("admissionStart", { mode: "bigint" }).notNull(),
    admissionEnd: bigint("admissionEnd", { mode: "bigint" }).notNull(),
    configuration: text("configuration").notNull(),
    seed: varchar("seed", { length: 32 }).notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
    matchedAt: bigint("matchedAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "expedition_match_batch_PRIMARY", columns: [table.periodId] }),
    check(
      "expedition_match_batch_bounds",
      sql.raw(
        '"admissionStart" >= 0 AND "admissionEnd" > "admissionStart" AND "createdAt" >= "admissionStart" AND ("matchedAt" = 0 OR "matchedAt" >= "admissionEnd") AND octet_length("configuration") BETWEEN 1 AND 8192',
      ),
    ),
  ],
);
