// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const shopping_mall = cokdb1.table("shopping_mall", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "id": legacyText("id", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "buyDaily": integer("buyDaily").default(sql.raw("0")),
  "buyTime": bigint("buyTime", { mode: "bigint" }).default(sql.raw("0")),
  "buyTotal": integer("buyTotal").default(sql.raw("0")),
  "flushTotalTime": bigint("flushTotalTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "shopping_mall_PRIMARY", columns: [table["uid"], table["id"]] }),
  uniqueIndex("shopping_mall_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
