// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const auction_history = cokdb_global.table("auction_history", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "groupId": integer("groupId"),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": legacyText("itemId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "itemNum": integer("itemNum").notNull(),
  "price": integer("price"),
  "time": bigint("time", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "auction_history_PRIMARY", columns: [table["uid"], table["uuid"]] }),
  uniqueIndex("auction_history_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
