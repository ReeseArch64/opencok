// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_shop_buytoallianceshoprecord = cokdb1.table("alliance_shop_buytoallianceshoprecord", {
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "goodsId": legacyText("goodsId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "count": integer("count").notNull(),
  "buytime": bigint("buytime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "alliance_shop_buytoallianceshoprecord_PRIMARY", columns: [table["allianceId"], table["buytime"]] }),
  uniqueIndex("alliance_shop_buytoallianceshoprecord_PRIMARY_pad").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"buytime\"")),
  index("alliance_shop_buytoallianceshoprecord_buytime").on(sql.raw("\"buytime\"")),
]);
