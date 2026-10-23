// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const saga_tower_science = cokdb1.table("saga_tower_science", {
  "uid": legacyText("uid", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}).notNull(),
  "itemid": integer("itemid").notNull(),
  "level": integer("level"),
  "cdtime": bigint("cdtime", { mode: "bigint" }),
  "reserve": integer("reserve"),
}, (table) => [
  primaryKey({ name: "saga_tower_science_PRIMARY", columns: [table["uid"], table["itemid"]] }),
  uniqueIndex("saga_tower_science_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"itemid\"")),
]);
