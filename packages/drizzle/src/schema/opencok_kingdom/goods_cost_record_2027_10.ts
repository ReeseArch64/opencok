import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const goods_cost_record_2027_10 = opencok_kingdom.table(
  "goods_cost_record_2027_10",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "time": bigint("time", { mode: "bigint" }).notNull(),
    "userId": varchar("userId", { length: 255 }).notNull(),
    "itemId": integer("itemId").notNull(),
    "type": integer("type"),
    "param1": integer("param1"),
    "param2": integer("param2"),
    "original": bigint("original", { mode: "bigint" }).notNull(),
    "cost": integer("cost").notNull(),
    "remain": bigint("remain", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "goods_cost_record_2027_10_PRIMARY", columns: [table["uid"]] }),
    index("goods_cost_record_2027_10_index_type").on(sql.raw('"type"')),
    index("goods_cost_record_2027_10_index_time").on(sql.raw('"time"')),
    index("goods_cost_record_2027_10_index_time_user").on(
      sql.raw('"time"'),
      sql.raw('"userId"'),
      sql.raw('"itemId"'),
    ),
    index("goods_cost_record_2027_10_index_user_time").on(sql.raw('"userId"'), sql.raw('"time"')),
  ],
);
