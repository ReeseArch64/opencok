import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const alliance_shop_buytoallianceshoprecord = cokdb1.table("alliance_shop_buytoallianceshoprecord", {
  "allianceId": varchar("allianceId", { length: 40 }).notNull(),
  "goodsId": varchar("goodsId", { length: 40 }).notNull(),
  "uid": varchar("uid", { length: 255 }).notNull(),
  "count": integer("count").notNull(),
  "buytime": bigint("buytime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "alliance_shop_buytoallianceshoprecord_PRIMARY", columns: [table["allianceId"], table["buytime"]] }),
  index("alliance_shop_buytoallianceshoprecord_buytime").on(sql.raw("\"buytime\"")),
]);
