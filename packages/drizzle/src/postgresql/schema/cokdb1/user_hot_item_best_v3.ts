// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_hot_item_best_v3 = cokdb1.table("user_hot_item_best_v3", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "goodsId": legacyText("goodsId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "color": smallint("color"),
  "price_type": integer("price_type"),
  "price": integer("price"),
  "price_hot": integer("price_hot"),
}, (table) => [
  primaryKey({ name: "user_hot_item_best_v3_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_hot_item_best_v3_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("user_hot_item_best_v3_color_range", sql.raw("\"color\" BETWEEN -128 AND 127")),
]);
