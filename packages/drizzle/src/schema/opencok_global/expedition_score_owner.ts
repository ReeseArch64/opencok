import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const expedition_score_owner = opencok_global.table(
  "expedition_score_owner",
  {
    kingdomId: integer("kingdomId").notNull(),
    ownerEpoch: bigint("ownerEpoch", { mode: "bigint" }).notNull(),
    instanceId: varchar("instanceId", { length: 40 }).notNull(),
    sequence: bigint("sequence", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "expedition_score_owner_PRIMARY", columns: [table.kingdomId] }),
    check(
      "expedition_score_owner_bounds",
      sql.raw('"kingdomId" > 0 AND "ownerEpoch" > 0 AND "sequence" >= 0'),
    ),
  ],
);
