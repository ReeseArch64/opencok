// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const dragon_building_record = cokdb1.table("dragon_building_record", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "worldId": integer("worldId").notNull(),
  "buildId": legacyText("buildId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "ownerUid": legacyText("ownerUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "occupyUidsStr": legacyText("occupyUidsStr", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "lastCalcScoreTime": bigint("lastCalcScoreTime", { mode: "bigint" }).notNull(),
  "lastHandKnightTime": integer("lastHandKnightTime").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "dragon_building_record_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("dragon_building_record_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
