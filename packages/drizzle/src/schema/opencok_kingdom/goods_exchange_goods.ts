import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const goods_exchange_goods = opencok_kingdom.table("goods_exchange_goods", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({"name":"goods_exchange_goods_id_seq","startWith":3073}),
  "uid": varchar("uid", { length: 40 }).notNull(),
  "type": smallint("type").notNull().default(sql.raw("1")),
  "sumNum": bigint("sumNum", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "stage": smallint("stage").notNull().default(sql.raw("1")),
  "getAward": smallint("getAward").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "goods_exchange_goods_PRIMARY", columns: [table["id"]] }),
  check("goods_exchange_goods_type_range", sql.raw("\"type\" BETWEEN -128 AND 127")),
  check("goods_exchange_goods_stage_range", sql.raw("\"stage\" BETWEEN -128 AND 127")),
  check("goods_exchange_goods_getAward_range", sql.raw("\"getAward\" BETWEEN -128 AND 127")),
]);
