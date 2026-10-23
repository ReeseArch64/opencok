// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_shophis = cokdb1.table("alliance_shophis", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "userId": legacyText("userId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "goodsId": legacyText("goodsId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "alliance_shophis_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("alliance_shophis_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_shophis_index_alliance").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_shophis_index_user").on(sql.raw("rtrim(\"userId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
