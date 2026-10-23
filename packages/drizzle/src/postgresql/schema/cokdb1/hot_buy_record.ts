// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const hot_buy_record = cokdb1.table("hot_buy_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "goodsId": legacyText("goodsId", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "buyCount": integer("buyCount").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "hot_buy_record_PRIMARY", columns: [table["uid"], table["goodsId"]] }),
  uniqueIndex("hot_buy_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"goodsId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
