import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const totem_delivery = opencok_kingdom.table(
  "totem_delivery",
  {
    activationId: varchar("activationId", { length: 40 }).notNull(),
    targetUid: varchar("targetUid", { length: 40 }).notNull(),
    stateId: integer("stateId").notNull(),
    appliedAt: bigint("appliedAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "totem_delivery_PRIMARY", columns: [table.activationId, table.targetUid] }),
    index("totem_delivery_pending").on(table.targetUid, table.appliedAt, table.activationId),
    check("totem_delivery_bounds", sql`"stateId" > 0 AND "appliedAt" >= 0`),
  ],
);
