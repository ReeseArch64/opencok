// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const exchange_gift_log = cokdb1.table("exchange_gift_log", {
  "mailId": legacyText("mailId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "senderId": legacyText("senderId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "receiverId": legacyText("receiverId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "exchangeId": legacyText("exchangeId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "sendTime": bigint("sendTime", { mode: "bigint" }).notNull(),
  "status": smallint("status"),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "exchange_gift_log_PRIMARY", columns: [table["mailId"], table["sendTime"]] }),
  uniqueIndex("exchange_gift_log_PRIMARY_pad").on(sql.raw("rtrim(\"mailId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"sendTime\"")),
  check("exchange_gift_log_status_range", sql.raw("\"status\" BETWEEN -128 AND 127")),
]);
