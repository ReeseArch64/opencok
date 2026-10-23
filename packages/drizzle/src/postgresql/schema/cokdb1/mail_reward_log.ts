// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const mail_reward_log = cokdb1.table("mail_reward_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "mailId": legacyText("mailId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type"),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
  "status": smallint("status"),
}, (table) => [
  primaryKey({ name: "mail_reward_log_PRIMARY", columns: [table["uid"], table["mailId"], table["createTime"]] }),
  uniqueIndex("mail_reward_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"mailId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"createTime\"")),
  check("mail_reward_log_status_range", sql.raw("\"status\" BETWEEN -128 AND 127")),
]);
