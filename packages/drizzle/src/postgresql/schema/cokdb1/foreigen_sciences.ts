// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const foreigen_sciences = cokdb1.table("foreigen_sciences", {
  "uid": legacyText("uid", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}).notNull(),
  "itemid": integer("itemid").notNull(),
  "level": integer("level"),
  "cdtime": bigint("cdtime", { mode: "bigint" }),
  "reserve": integer("reserve"),
}, (table) => [
  primaryKey({ name: "foreigen_sciences_PRIMARY", columns: [table["uid"], table["itemid"]] }),
  uniqueIndex("foreigen_sciences_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"itemid\"")),
]);
