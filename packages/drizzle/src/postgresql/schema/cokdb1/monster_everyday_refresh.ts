// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const monster_everyday_refresh = cokdb1.table("monster_everyday_refresh", {
  "monster_id": legacyText("monster_id", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "monster_num": integer("monster_num"),
  "refreshtime": bigint("refreshtime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "monster_everyday_refresh_PRIMARY", columns: [table["monster_id"]] }),
  uniqueIndex("monster_everyday_refresh_PRIMARY_pad").on(sql.raw("rtrim(\"monster_id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
