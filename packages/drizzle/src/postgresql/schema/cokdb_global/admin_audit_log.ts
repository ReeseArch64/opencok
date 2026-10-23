// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, index, integer, primaryKey, smallint } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const admin_audit_log = cokdb_global.table("admin_audit_log", {
  "serial_id": integer("serial_id").notNull().generatedByDefaultAsIdentity({ name: "admin_audit_log_serial_id_seq", startWith: 1 }),
  "adminname": legacyText("adminname", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "target_uid": legacyText("target_uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "target_server": legacyText("target_server", {"sqlType":"character varying(8)","collation":"legacy_meta.ci"}),
  "action_type": smallint("action_type").notNull(),
  "action_detail": legacyText("action_detail", {"sqlType":"character varying(2000)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "ip": legacyText("ip", {"sqlType":"character varying(24)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'0'")),
  "create_time": integer("create_time").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "admin_audit_log_PRIMARY", columns: [table["serial_id"]] }),
  index("admin_audit_log_tuid").on(sql.raw("rtrim(\"target_uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("admin_audit_log_uname").on(sql.raw("rtrim(\"adminname\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("admin_audit_log_atype").on(sql.raw("\"action_type\"")),
  index("admin_audit_log_ctime").on(sql.raw("\"create_time\"")),
  check("admin_audit_log_action_type_range", sql.raw("\"action_type\" BETWEEN -128 AND 127")),
]);
