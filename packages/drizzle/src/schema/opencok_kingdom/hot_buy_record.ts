import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const hot_buy_record = opencok_kingdom.table(
  "hot_buy_record",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "goodsId": varchar("goodsId", { length: 50 }).notNull(),
    "buyCount": integer("buyCount").default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "hot_buy_record_PRIMARY", columns: [table["uid"], table["goodsId"]] }),
  ],
);
