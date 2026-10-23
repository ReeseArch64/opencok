// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const logrecord_fight = cokdb1.table("logrecord_fight", {
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "user": legacyText("user", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "timeStamp": bigint("timeStamp", { mode: "bigint" }).notNull(),
  "category": integer("category").notNull(),
  "type": integer("type"),
  "param1": integer("param1"),
  "param2": integer("param2"),
  "param3": integer("param3"),
  "param4": integer("param4"),
  "data1": legacyText("data1", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "data2": legacyText("data2", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "data3": legacyText("data3", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "data4": legacyText("data4", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "data5": legacyText("data5", {"sqlType":"character varying(4086)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "logrecord_fight_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("logrecord_fight_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("logrecord_fight_index").on(sql.raw("\"timeStamp\""), sql.raw("rtrim(\"user\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"category\""), sql.raw("\"type\"")),
  index("logrecord_fight_index_2").on(sql.raw("rtrim(\"user\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"category\""), sql.raw("\"type\""), sql.raw("\"timeStamp\"")),
]);
