// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const server_push_config = cokdb1.table("server_push_config", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "contents": legacyBytes("contents"),
  "state": integer("state"),
}, (table) => [
  primaryKey({ name: "server_push_config_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("server_push_config_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("server_push_config_index_startTime").on(sql.raw("\"startTime\"")),
  check("server_push_config_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
]);
