// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_hot_item = cokdb1.table("user_hot_item", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": legacyText("itemId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "price": integer("price"),
  "num": integer("num"),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_hot_item_PRIMARY", columns: [table["uid"], table["itemId"]] }),
  uniqueIndex("user_hot_item_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"itemId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
