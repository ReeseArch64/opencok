// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const subscription_log = cokdb1.table("subscription_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "orderId": legacyText("orderId", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "itemId": legacyText("itemId", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "originalOrderId": legacyText("originalOrderId", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "beginTime": bigint("beginTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "nextCheckTime": bigint("nextCheckTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "subscription_log_PRIMARY", columns: [table["uid"], table["orderId"]] }),
  uniqueIndex("subscription_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"orderId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("subscription_log_index_uid_itemId").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"itemId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
