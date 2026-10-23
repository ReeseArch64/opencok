// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const action_record_pack = cokdb1.table("action_record_pack", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull(),
  "type1": integer("type1"),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "powerDelta": bigint("powerDelta", { mode: "bigint" }),
  "deadDelta": integer("deadDelta").notNull().default(sql.raw("0")),
  "armyDelta": integer("armyDelta").notNull().default(sql.raw("0")),
  "item": legacyText("item", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "param": legacyText("param", {"sqlType":"character varying(1024)","collation":"legacy_meta.ci"}),
  "gold": integer("gold"),
}, (_table) => [
  index("action_record_pack_uid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\""), sql.raw("\"type1\"")),
  index("action_record_pack_time").on(sql.raw("\"time\"")),
]);
