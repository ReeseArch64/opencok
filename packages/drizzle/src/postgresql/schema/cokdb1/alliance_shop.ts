// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_shop = cokdb1.table("alliance_shop", {
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "goodsId": legacyText("goodsId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "count": integer("count"),
}, (table) => [
  primaryKey({ name: "alliance_shop_PRIMARY", columns: [table["allianceId"], table["goodsId"]] }),
  uniqueIndex("alliance_shop_PRIMARY_pad").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"goodsId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_shop_index_alliance").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
