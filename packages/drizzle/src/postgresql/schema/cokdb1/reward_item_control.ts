// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const reward_item_control = cokdb1.table("reward_item_control", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": legacyText("itemId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "count": integer("count").notNull().default(sql.raw("0")),
  "flushTime": bigint("flushTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "reward_item_control_PRIMARY", columns: [table["uid"], table["itemId"]] }),
  uniqueIndex("reward_item_control_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"itemId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
