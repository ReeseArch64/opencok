// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const push_record = cokdb1.table("push_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "type": legacyText("type", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).default(sql.raw("'0'")),
  "msg": legacyBytes("msg"),
  "status": integer("status").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "push_record_PRIMARY", columns: [table["uid"], table["time"]] }),
  uniqueIndex("push_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"time\"")),
  index("push_record_index_type").on(sql.raw("rtrim(\"type\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("push_record_msg_length", sql.raw("octet_length(\"msg\") <= 65535")),
]);
