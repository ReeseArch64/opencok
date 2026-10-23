// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const move_server_record_2024_6 = cokdb_global.table("move_server_record_2024_6", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "name": legacyText("name", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "src": integer("src").notNull(),
  "dst": integer("dst").notNull(),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "move_server_record_2024_6_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("move_server_record_2024_6_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
