// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_member_dragon_right = cokdb1.table("alliance_member_dragon_right", {
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "canFight": smallint("canFight"),
  "leaveTime": bigint("leaveTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "alliance_member_dragon_right_PRIMARY", columns: [table["uid"], table["allianceId"]] }),
  uniqueIndex("alliance_member_dragon_right_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("alliance_member_dragon_right_canFight_range", sql.raw("\"canFight\" BETWEEN -128 AND 127")),
]);
