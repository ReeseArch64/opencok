// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const item_count_control = cokdb1.table("item_count_control", {
  "itemId": legacyText("itemId", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "count": integer("count"),
  "total": integer("total"),
  "total2": integer("total2"),
  "lastRefreshTime": bigint("lastRefreshTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "item_count_control_PRIMARY", columns: [table["itemId"]] }),
  uniqueIndex("item_count_control_PRIMARY_pad").on(sql.raw("rtrim(\"itemId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
