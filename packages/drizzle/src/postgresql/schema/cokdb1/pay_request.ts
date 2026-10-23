// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const pay_request = cokdb1.table("pay_request", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "pf": legacyText("pf", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "optionId": integer("optionId"),
  "purchaseId": legacyText("purchaseId", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "productId": legacyText("productId", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "status": integer("status").default(sql.raw("0")),
  "finishTime": bigint("finishTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "pay_request_PRIMARY", columns: [table["uid"], table["pf"], table["time"]] }),
  uniqueIndex("pay_request_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"pf\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"time\"")),
  index("pay_request_index_uid_pf_purchaseId").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"pf\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"purchaseId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("pay_request_index_uid_pf_productId").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"pf\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"productId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
