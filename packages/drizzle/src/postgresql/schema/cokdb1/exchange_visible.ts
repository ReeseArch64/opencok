// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const exchange_visible = cokdb1.table("exchange_visible", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "exchangeId": legacyText("exchangeId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "createTime": bigint("createTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "exchange_visible_PRIMARY", columns: [table["uid"], table["exchangeId"]] }),
  uniqueIndex("exchange_visible_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"exchangeId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("exchange_visible_uid_index").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
