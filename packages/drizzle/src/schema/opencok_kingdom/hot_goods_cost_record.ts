import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const hot_goods_cost_record = opencok_kingdom.table(
  "hot_goods_cost_record",
  {
    "uuid": varchar("uuid", { length: 255 }).notNull(),
    "uid": varchar("uid", { length: 255 }).notNull(),
    "goodsId": varchar("goodsId", { length: 20 }).notNull(),
    "priceType": integer("priceType"),
    "price": integer("price"),
    "buyTime": bigint("buyTime", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({ name: "hot_goods_cost_record_PRIMARY", columns: [table["uuid"]] }),
    index("hot_goods_cost_record_uid_idx").on(sql.raw('"uid"')),
    index("hot_goods_cost_record_goods_idx").on(sql.raw('"goodsId"')),
    index("hot_goods_cost_record_time_idx").on(sql.raw('"buyTime"')),
  ],
);
