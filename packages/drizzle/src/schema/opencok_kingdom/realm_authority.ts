import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const realm_authority = opencok_kingdom.table(
  "realm_authority",
  {
    kingdomId: integer("kingdomId").notNull(),
    ownerEpoch: bigint("ownerEpoch", { mode: "bigint" }).notNull(),
    instanceId: varchar("instanceId", { length: 40 }).notNull(),
    acquiredAt: bigint("acquiredAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "realm_authority_PRIMARY", columns: [table.kingdomId] }),
    check("realm_authority_kingdom_positive", sql`${table.kingdomId} > 0`),
    check("realm_authority_epoch_positive", sql`${table.ownerEpoch} > 0`),
  ],
);
