// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_shop_make = cokdb1.table("alliance_shop_make", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "goodsId": legacyText("goodsId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "count": integer("count"),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "needTime": bigint("needTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "alliance_shop_make_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("alliance_shop_make_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_shop_make_index_alliance").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
