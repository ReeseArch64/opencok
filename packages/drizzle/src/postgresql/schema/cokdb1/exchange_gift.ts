// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const exchange_gift = cokdb1.table("exchange_gift", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "receiverId": legacyText("receiverId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "exchangeId": legacyText("exchangeId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "sendTime": bigint("sendTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "exchange_gift_PRIMARY", columns: [table["uid"], table["receiverId"], table["exchangeId"]] }),
  uniqueIndex("exchange_gift_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"receiverId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"exchangeId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
