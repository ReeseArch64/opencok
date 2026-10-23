// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const barbarion_statistics = cokdb1.table("barbarion_statistics", {
  "playerUid": legacyText("playerUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "playerName": legacyText("playerName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  "isSuccess": integer("isSuccess").default(sql.raw("0")),
  "strongHoldLevel": integer("strongHoldLevel").default(sql.raw("0")),
  "actType": integer("actType").default(sql.raw("0")),
}, (_table) => [
  uniqueIndex("barbarion_statistics_uid_name_time_index").on(sql.raw("rtrim(\"playerUid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"playerName\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"time\"")),
  index("barbarion_statistics_playerUid_Index").on(sql.raw("rtrim(\"playerUid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("barbarion_statistics_isSuccess_actType_index").on(sql.raw("\"isSuccess\""), sql.raw("\"actType\"")),
  index("barbarion_statistics_strongHoldLevel_index").on(sql.raw("\"strongHoldLevel\"")),
  index("barbarion_statistics_actType_index").on(sql.raw("\"actType\"")),
]);
