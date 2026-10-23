// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_egg = cokdb1.table("user_egg", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "eggId": legacyText("eggId", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).notNull(),
  "goods": legacyText("goods", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "reward": integer("reward").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_egg_PRIMARY", columns: [table["uid"], table["eggId"]] }),
  uniqueIndex("user_egg_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"eggId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
