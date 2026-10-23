// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_hot_item_best = cokdb1.table("user_hot_item_best", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "goodsId": legacyText("goodsId", {"sqlType":"character varying(20)","collation":"C"}).notNull(),
  "color": integer("color").default(sql.raw("0")),
  "price_type": integer("price_type").default(sql.raw("0")),
  "price": integer("price").default(sql.raw("0")),
  "price_hot": integer("price_hot").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_hot_item_best_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_hot_item_best_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
]);
