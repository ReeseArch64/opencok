import { sql } from "drizzle-orm";
import { check, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const cok_monitor_log = cokdb1.table("cok_monitor_log", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({"name":"cok_monitor_log_id_seq","startWith":1}),
  "url": varchar("url", { length: 500 }),
  "action": varchar("action", { length: 50 }),
  "parameter": text("parameter"),
  "user_name": varchar("user_name", { length: 50 }),
  "access_time": text("access_time"),
  "module_id": integer("module_id"),
}, (table) => [
  primaryKey({ name: "cok_monitor_log_PRIMARY", columns: [table["id"]] }),
  check("cok_monitor_log_access_time_temporal", sql.raw("(\"access_time\" IS NULL OR (CASE WHEN \"access_time\" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left(\"access_time\",4) <> '0000' AND substring(\"access_time\",6,2) <> '00' AND substring(\"access_time\",9,2) <> '00' THEN to_char(to_date(left(\"access_time\",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left(\"access_time\",10) ELSE true END ELSE false END))")),
]);
