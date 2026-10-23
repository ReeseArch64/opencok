import { sql } from "drizzle-orm";
import { index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const suit_decompose_effect = opencok_kingdom.table(
  "suit_decompose_effect",
  {
    "item1": varchar("item1", { length: 100 }),
    "item2": varchar("item2", { length: 100 }).default(sql.raw("'0'")),
    "item3": varchar("item3", { length: 100 }).default(sql.raw("'0'")),
    "item4": varchar("item4", { length: 100 }).default(sql.raw("'0'")),
    "item5": varchar("item5", { length: 100 }).default(sql.raw("'0'")),
    "item6": varchar("item6", { length: 100 }).default(sql.raw("'0'")),
    "owner": varchar("owner", { length: 100 }).notNull().default(sql.raw("'0'")),
    "suitid": varchar("suitid", { length: 100 }).notNull().default(sql.raw("'0'")),
  },
  (table) => [
    primaryKey({
      name: "suit_decompose_effect_PRIMARY",
      columns: [table["owner"], table["suitid"]],
    }),
    index("suit_decompose_effect_owner_suit").on(sql.raw('"owner"'), sql.raw('"suitid"')),
  ],
);
