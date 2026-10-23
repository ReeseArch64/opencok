// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const cross_throne_occupy_record = cokdb_global.table("cross_throne_occupy_record", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "king_info_id": legacyText("king_info_id", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "name": legacyText("name", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "alliance_abbr": legacyText("alliance_abbr", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "server_id": integer("server_id"),
  "kingdom_name": legacyText("kingdom_name", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "start_millis": bigint("start_millis", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "cross_throne_occupy_record_PRIMARY", columns: [table["king_info_id"], table["uuid"]] }),
  uniqueIndex("cross_throne_occupy_record_PRIMARY_pad").on(sql.raw("rtrim(\"king_info_id\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
