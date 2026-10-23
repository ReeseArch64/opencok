// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const hot_info_before_refresh = cokdb1.table("hot_info_before_refresh", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "goodsId": legacyText("goodsId", {"sqlType":"character varying(20)","collation":"C"}).notNull(),
  "itemId": legacyText("itemId", {"sqlType":"character varying(20)","collation":"C"}),
  "priceType": integer("priceType"),
  "price": integer("price").notNull(),
  "num": integer("num"),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "gold": integer("gold").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "hot_info_before_refresh_PRIMARY", columns: [table["uid"], table["goodsId"], table["price"], table["refreshTime"]] }),
  uniqueIndex("hot_info_before_refresh_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\""), sql.raw("rtrim(\"goodsId\", ' ') COLLATE \"C\""), sql.raw("\"price\""), sql.raw("\"refreshTime\"")),
  index("hot_info_before_refresh_time_idx").on(sql.raw("\"refreshTime\"")),
]);
