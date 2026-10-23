// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const world_hero_record = cokdb1.table("world_hero_record", {
  "heroUid": legacyText("heroUid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "heroFreeTime": bigint("heroFreeTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "world_hero_record_PRIMARY", columns: [table["heroUid"]] }),
  uniqueIndex("world_hero_record_PRIMARY_pad").on(sql.raw("rtrim(\"heroUid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
