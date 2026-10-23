// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_group_buys = cokdb1.table("alliance_group_buys", {
  "id": legacyText("id", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "round": integer("round").notNull(),
  "name": legacyText("name", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "point": integer("point"),
  "buyTime": bigint("buyTime", { mode: "bigint" }),
  "info": legacyText("info", {"sqlType":"character varying(1000)","collation":"legacy_meta.ci"}),
  "reward": integer("reward"),
}, (table) => [
  primaryKey({ name: "alliance_group_buys_PRIMARY", columns: [table["id"], table["uid"], table["round"]] }),
  uniqueIndex("alliance_group_buys_PRIMARY_pad").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"round\"")),
  index("alliance_group_buys_index_allianceId").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_group_buys_index_time").on(sql.raw("\"buyTime\"")),
]);
