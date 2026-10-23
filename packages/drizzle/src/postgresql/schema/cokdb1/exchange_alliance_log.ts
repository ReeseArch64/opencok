// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const exchange_alliance_log = cokdb1.table("exchange_alliance_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "orderId": legacyText("orderId", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
  "status": smallint("status"),
}, (table) => [
  primaryKey({ name: "exchange_alliance_log_PRIMARY", columns: [table["uid"], table["orderId"], table["createTime"]] }),
  uniqueIndex("exchange_alliance_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"orderId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"createTime\"")),
  check("exchange_alliance_log_status_range", sql.raw("\"status\" BETWEEN -128 AND 127")),
]);
