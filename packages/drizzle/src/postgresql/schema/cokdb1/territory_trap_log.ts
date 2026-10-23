// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const territory_trap_log = cokdb1.table("territory_trap_log", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "allianceid": legacyText("allianceid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "logid": integer("logid").notNull(),
  "param": legacyText("param", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "createtime": bigint("createtime", { mode: "bigint" }).default(sql.raw("0")),
  "paramname": legacyText("paramname", {"sqlType":"character varying(60)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "territory_trap_log_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("territory_trap_log_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("territory_trap_log_allianceid_index").on(sql.raw("rtrim(\"allianceid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
