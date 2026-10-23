// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const cross_throne_occupy_record = cokdb1.table("cross_throne_occupy_record", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(50)","collation":"C"}).notNull(),
  "king_info_id": legacyText("king_info_id", {"sqlType":"character varying(50)","collation":"C"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"C"}),
  "name": legacyText("name", {"sqlType":"character varying(50)","collation":"C"}),
  "alliance_abbr": legacyText("alliance_abbr", {"sqlType":"character varying(50)","collation":"C"}),
  "server_id": integer("server_id"),
  "kingdom_name": legacyText("kingdom_name", {"sqlType":"character varying(50)","collation":"C"}),
  "start_millis": bigint("start_millis", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "cross_throne_occupy_record_PRIMARY", columns: [table["uuid"], table["king_info_id"]] }),
  uniqueIndex("cross_throne_occupy_record_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"C\""), sql.raw("rtrim(\"king_info_id\", ' ') COLLATE \"C\"")),
]);
