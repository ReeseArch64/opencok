// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const treasure_map = cokdb1.table("treasure_map", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "treasureId": legacyText("treasureId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "currentOwner": legacyText("currentOwner", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "originalOwner": legacyText("originalOwner", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "targetId": integer("targetId"),
  "time": integer("time"),
  "colour": integer("colour"),
  "marchId": legacyText("marchId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "finishTime": bigint("finishTime", { mode: "bigint" }),
  "state": integer("state"),
}, (table) => [
  primaryKey({ name: "treasure_map_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("treasure_map_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("treasure_map_index_o_m").on(sql.raw("rtrim(\"currentOwner\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"marchId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("treasure_map_index_o_t").on(sql.raw("rtrim(\"currentOwner\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"targetId\"")),
  index("treasure_map_index_o_s_c").on(sql.raw("rtrim(\"currentOwner\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"state\""), sql.raw("\"colour\"")),
]);
