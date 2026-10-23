// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const logstat = cokdb1.table("logstat", {
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "user": legacyText("user", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "timeStamp": bigint("timeStamp", { mode: "bigint" }).notNull(),
  "type": integer("type"),
  "param1": integer("param1"),
  "param2": integer("param2"),
  "param3": integer("param3"),
  "param4": integer("param4"),
  "param5": integer("param5"),
  "data1": integer("data1"),
  "data2": bigint("data2", { mode: "bigint" }),
  "data3": integer("data3"),
  "data4": integer("data4"),
  "data5": integer("data5"),
  "data6": integer("data6"),
  "data7": integer("data7"),
  "data8": integer("data8"),
}, (table) => [
  primaryKey({ name: "logstat_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("logstat_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("logstat_index").on(sql.raw("\"timeStamp\""), sql.raw("rtrim(\"user\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\""), sql.raw("\"param1\""), sql.raw("\"param2\""), sql.raw("\"param3\"")),
  index("logstat_index2").on(sql.raw("\"type\""), sql.raw("\"timeStamp\""), sql.raw("rtrim(\"user\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
