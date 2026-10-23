// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const outer_mail = cokdb_global.table("outer_mail", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").default(sql.raw("0")),
  "mailType": integer("mailType").default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "regStartTime": bigint("regStartTime", { mode: "bigint" }),
  "regEndTime": bigint("regEndTime", { mode: "bigint" }),
  "lastOnlineTime": bigint("lastOnlineTime", { mode: "bigint" }),
  "levelMin": integer("levelMin"),
  "levelMax": integer("levelMax"),
  "title": legacyBytes("title"),
  "contents": legacyBytes("contents"),
  "reward": legacyBytes("reward"),
  "updateVersion": legacyText("updateVersion", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "state": integer("state"),
  "parse": integer("parse"),
  "notification": legacyText("notification", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}),
  "addr": legacyBytes("addr"),
}, (table) => [
  primaryKey({ name: "outer_mail_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("outer_mail_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("outer_mail_index_startTime").on(sql.raw("\"startTime\"")),
  check("outer_mail_title_length", sql.raw("octet_length(\"title\") <= 65535")),
  check("outer_mail_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
  check("outer_mail_reward_length", sql.raw("octet_length(\"reward\") <= 65535")),
  check("outer_mail_addr_length", sql.raw("octet_length(\"addr\") <= 65535")),
]);
