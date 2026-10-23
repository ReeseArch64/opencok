// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const logaction = cokdb1.table("logaction", {
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "user": legacyText("user", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "timeStamp": bigint("timeStamp", { mode: "bigint" }).notNull(),
  "action": legacyText("action", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "code": legacyText("code", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "info": legacyText("info", {"sqlType":"character varying(2048)","collation":"legacy_meta.ci"}).notNull(),
  "param": legacyBytes("param"),
}, (table) => [
  primaryKey({ name: "logaction_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("logaction_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("logaction_index").on(sql.raw("\"timeStamp\""), sql.raw("rtrim(\"user\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"action\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"code\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("logaction_index2").on(sql.raw("rtrim(\"user\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"timeStamp\""), sql.raw("rtrim(\"action\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("logaction_param_length", sql.raw("octet_length(\"param\") <= 65535")),
]);
