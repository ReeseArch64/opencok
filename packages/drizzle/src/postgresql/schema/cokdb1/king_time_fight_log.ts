// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const king_time_fight_log = cokdb1.table("king_time_fight_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "logtime": bigint("logtime", { mode: "bigint" }),
  "category": integer("category"),
  "humanUid": legacyText("humanUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "pointId": integer("pointId"),
  "data1": legacyText("data1", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "data2": legacyText("data2", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "data3": legacyText("data3", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "data4": legacyText("data4", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "king_time_fight_log_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("king_time_fight_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("king_time_fight_log_Index_logtime").on(sql.raw("\"logtime\"")),
]);
