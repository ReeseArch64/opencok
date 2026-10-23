// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_hot_item_v2 = cokdb1.table("user_hot_item_v2", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "goodsId": legacyText("goodsId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": legacyText("itemId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "priceType": integer("priceType"),
  "price": integer("price").notNull(),
  "price_hot": integer("price_hot").default(sql.raw("0")),
  "num": integer("num"),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }),
  "para1": integer("para1").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_hot_item_v2_PRIMARY", columns: [table["uid"], table["goodsId"], table["price"]] }),
  uniqueIndex("user_hot_item_v2_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"goodsId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"price\"")),
]);
