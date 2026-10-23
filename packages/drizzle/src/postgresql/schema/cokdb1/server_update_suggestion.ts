// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const server_update_suggestion = cokdb1.table("server_update_suggestion", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "updateId": legacyText("updateId", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "idx": integer("idx").notNull(),
  "suggestion": legacyBytes("suggestion"),
  "real_uid": legacyText("real_uid", {"sqlType":"character varying(255)","collation":"C"}),
  "server": integer("server"),
  "real_name": legacyText("real_name", {"sqlType":"character varying(255)","collation":"C"}),
  "reward_status": integer("reward_status").default(sql.raw("0")),
  "createTime": bigint("createTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "server_update_suggestion_PRIMARY", columns: [table["uid"], table["updateId"], table["idx"]] }),
  uniqueIndex("server_update_suggestion_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\""), sql.raw("rtrim(\"updateId\", ' ') COLLATE \"C\""), sql.raw("\"idx\"")),
  check("server_update_suggestion_suggestion_length", sql.raw("octet_length(\"suggestion\") <= 65535")),
]);
