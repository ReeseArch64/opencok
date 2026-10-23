// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const action_cost_record_2024_0 = cokdb1.table("action_cost_record_2024_0", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "action_type": integer("action_type").notNull(),
  "cost_type": legacyText("cost_type", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "cost_value": legacyText("cost_value", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "get_type": legacyText("get_type", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "get_value": legacyText("get_value", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "param1": legacyText("param1", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "param2": legacyText("param2", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "update_time": bigint("update_time", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "action_cost_record_2024_0_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("action_cost_record_2024_0_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
