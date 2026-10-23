// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const auction = cokdb_global.table("auction", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "groupId": integer("groupId").notNull(),
  "cfgId": legacyText("cfgId", {"sqlType":"character varying(30)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": legacyText("itemId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "num": integer("num").notNull(),
  "color": integer("color").notNull(),
  "endTime": bigint("endTime", { mode: "bigint" }).notNull(),
  "zoneId": integer("zoneId"),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "price": integer("price").notNull(),
  "add": integer("add").notNull(),
  "decision": integer("decision").notNull(),
  "end": integer("end").notNull(),
  "type": integer("type").notNull(),
}, (table) => [
  primaryKey({ name: "auction_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("auction_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
