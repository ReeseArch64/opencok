import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const king_allot_tax_record = opencok_kingdom.table(
  "king_allot_tax_record",
  {
    "uuid": varchar("uuid", { length: 255 }).notNull(),
    "kingUid": varchar("kingUid", { length: 255 }),
    "kingName": varchar("kingName", { length: 255 }),
    "toUid": varchar("toUid", { length: 255 }),
    "toUserName": varchar("toUserName", { length: 255 }),
    "wood": bigint("wood", { mode: "bigint" }).default(sql.raw("0")),
    "food": bigint("food", { mode: "bigint" }).default(sql.raw("0")),
    "iron": bigint("iron", { mode: "bigint" }).default(sql.raw("0")),
    "stone": bigint("stone", { mode: "bigint" }).default(sql.raw("0")),
    "sendTime": bigint("sendTime", { mode: "bigint" }).default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "king_allot_tax_record_PRIMARY", columns: [table["uuid"]] }),
    index("king_allot_tax_record_time_index").on(sql.raw('"sendTime"')),
  ],
);
