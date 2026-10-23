// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_item_bak = cokdb1.table("user_item_bak", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "ownerId": legacyText("ownerId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": legacyText("itemId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "count": integer("count").notNull().default(sql.raw("0")),
  "value": integer("value"),
  "vanishTime": bigint("vanishTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_item_bak_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("user_item_bak_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_item_bak_uitem_ownerId_index").on(sql.raw("rtrim(\"ownerId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"itemId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"value\"")),
]);
