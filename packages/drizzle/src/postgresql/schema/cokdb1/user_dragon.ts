// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_dragon = cokdb1.table("user_dragon", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": integer("itemId").notNull(),
  "level": integer("level").notNull(),
  "exp": integer("exp").notNull(),
  "place": legacyText("place", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "user_dragon_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("user_dragon_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_dragon_uid_index").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
