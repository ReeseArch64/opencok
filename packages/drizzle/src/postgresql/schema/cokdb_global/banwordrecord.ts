// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const banwordrecord = cokdb_global.table("banwordrecord", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "server": integer("server").notNull(),
  "banTimes": integer("banTimes").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "banwordrecord_PRIMARY", columns: [table["uid"], table["server"]] }),
  uniqueIndex("banwordrecord_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"server\"")),
]);
