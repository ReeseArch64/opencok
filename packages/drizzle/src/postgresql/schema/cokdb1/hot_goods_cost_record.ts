// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const hot_goods_cost_record = cokdb1.table("hot_goods_cost_record", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "goodsId": legacyText("goodsId", {"sqlType":"character varying(20)","collation":"C"}).notNull(),
  "priceType": integer("priceType"),
  "price": integer("price"),
  "buyTime": bigint("buyTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "hot_goods_cost_record_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("hot_goods_cost_record_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"C\"")),
  index("hot_goods_cost_record_uid_idx").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
  index("hot_goods_cost_record_goods_idx").on(sql.raw("rtrim(\"goodsId\", ' ') COLLATE \"C\"")),
  index("hot_goods_cost_record_time_idx").on(sql.raw("\"buyTime\"")),
]);
