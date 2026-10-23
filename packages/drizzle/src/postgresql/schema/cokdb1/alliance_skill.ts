// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_skill = cokdb1.table("alliance_skill", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}).notNull(),
  "skillId": legacyText("skillId", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}),
  "curEnergy": integer("curEnergy"),
  "costEnergy": integer("costEnergy"),
  "buildingUid": legacyText("buildingUid", {"sqlType":"character varying(256)","collation":"legacy_meta.ci"}),
  "effect": integer("effect").default(sql.raw("0")),
  "effectValue": integer("effectValue").default(sql.raw("0")),
  "statusId": legacyText("statusId", {"sqlType":"character varying(11)","collation":"legacy_meta.ci"}).default(sql.raw("'0'")),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "alliance_skill_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("alliance_skill_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
