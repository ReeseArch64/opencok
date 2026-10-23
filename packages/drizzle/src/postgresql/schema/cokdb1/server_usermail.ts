// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const server_usermail = cokdb1.table("server_usermail", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "toUser": legacyText("toUser", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "sendBy": legacyText("sendBy", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "sendTime": bigint("sendTime", { mode: "bigint" }).notNull(),
  "title": legacyText("title", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "contents": legacyBytes("contents"),
  "reward": legacyBytes("reward"),
  "rewardStatus": integer("rewardStatus"),
}, (table) => [
  primaryKey({ name: "server_usermail_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("server_usermail_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("server_usermail_index_sendTime").on(sql.raw("\"sendTime\"")),
  check("server_usermail_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
  check("server_usermail_reward_length", sql.raw("octet_length(\"reward\") <= 65535")),
]);
