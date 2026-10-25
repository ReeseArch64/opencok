import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const command_receipt = opencok_kingdom.table(
  "command_receipt",
  {
    kingdomId: integer("kingdomId").notNull(),
    ownerUid: varchar("ownerUid", { length: 40 }).notNull(),
    requestId: varchar("requestId", { length: 128 }).notNull(),
    command: varchar("command", { length: 128 }).notNull(),
    request: bytea("request").notNull(),
    response: bytea("response").notNull(),
    ownerEpoch: bigint("ownerEpoch", { mode: "bigint" }).notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({
      name: "command_receipt_PRIMARY",
      columns: [table.kingdomId, table.ownerUid, table.requestId],
    }),
    check("command_receipt_epoch", sql.raw('"ownerEpoch" > 0')),
    check(
      "command_receipt_bounds",
      sql.raw('octet_length("request") <= 65536 AND octet_length("response") <= 1048576'),
    ),
  ],
);
