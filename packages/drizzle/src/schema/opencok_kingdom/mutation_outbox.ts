import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const mutation_outbox = opencok_kingdom.table(
  "mutation_outbox",
  {
    kingdomId: integer("kingdomId").notNull(),
    ownerUid: varchar("ownerUid", { length: 40 }).notNull(),
    requestId: varchar("requestId", { length: 128 }).notNull(),
    eventId: varchar("eventId", { length: 40 }).notNull(),
    eventType: varchar("eventType", { length: 128 }).notNull(),
    payload: bytea("payload").notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
    publishedAt: bigint("publishedAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    index("mutation_outbox_pending").on(table.kingdomId, table.publishedAt, table.createdAt),
    primaryKey({
      name: "mutation_outbox_PRIMARY",
      columns: [table.kingdomId, table.ownerUid, table.requestId, table.eventId],
    }),
    check("mutation_outbox_payload", sql.raw('octet_length("payload") <= 65536')),
    check("mutation_outbox_delivery", sql.raw('"publishedAt" >= 0')),
  ],
);
