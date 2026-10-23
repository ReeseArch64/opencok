// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const monthly_card = cokdb1.table("monthly_card", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": legacyText("itemId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "accept": integer("accept").default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  "available": integer("available").default(sql.raw("0")),
  "buyTime": bigint("buyTime", { mode: "bigint" }).default(sql.raw("0")),
  "optionId": integer("optionId"),
}, (table) => [
  primaryKey({ name: "monthly_card_PRIMARY", columns: [table["uid"], table["itemId"]] }),
  uniqueIndex("monthly_card_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"itemId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
