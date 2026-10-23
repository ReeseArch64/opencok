// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_territory_fix_log = cokdb1.table("alliance_territory_fix_log", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "pointId": integer("pointId").notNull(),
  "territoryId": legacyText("territoryId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "territoryType": integer("territoryType").notNull(),
  "playerId": legacyText("playerId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "runTime": bigint("runTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "alliance_territory_fix_log_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("alliance_territory_fix_log_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
