// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const castle_exchange = cokdb1.table("castle_exchange", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "id": legacyText("id", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "buy": integer("buy").default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "castle_exchange_PRIMARY", columns: [table["uid"], table["id"]] }),
  uniqueIndex("castle_exchange_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
