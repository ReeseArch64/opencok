import { sql } from "drizzle-orm";
import { check, index, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const admin_audit_log = opencok_global.table("admin_audit_log", {
  "serial_id": integer("serial_id").notNull().generatedByDefaultAsIdentity({"name":"admin_audit_log_serial_id_seq","startWith":1}),
  "adminname": varchar("adminname", { length: 50 }).notNull(),
  "target_uid": varchar("target_uid", { length: 50 }).notNull().default(sql.raw("''")),
  "target_server": varchar("target_server", { length: 8 }),
  "action_type": smallint("action_type").notNull(),
  "action_detail": varchar("action_detail", { length: 2000 }).notNull().default(sql.raw("''")),
  "ip": varchar("ip", { length: 24 }).notNull().default(sql.raw("'0'")),
  "create_time": integer("create_time").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "admin_audit_log_PRIMARY", columns: [table["serial_id"]] }),
  index("admin_audit_log_tuid").on(sql.raw("\"target_uid\"")),
  index("admin_audit_log_uname").on(sql.raw("\"adminname\"")),
  index("admin_audit_log_atype").on(sql.raw("\"action_type\"")),
  index("admin_audit_log_ctime").on(sql.raw("\"create_time\"")),
  check("admin_audit_log_action_type_range", sql.raw("\"action_type\" BETWEEN -128 AND 127")),
]);
