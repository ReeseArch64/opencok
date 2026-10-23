import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const alliance_comment = opencok_kingdom.table("alliance_comment", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "allianceId": varchar("allianceId", { length: 40 }),
  "time": bigint("time", { mode: "bigint" }),
  "senderUid": varchar("senderUid", { length: 40 }),
  "senderAllianceId": varchar("senderAllianceId", { length: 40 }),
  "message": bytea("message"),
  "lang": varchar("lang", { length: 10 }),
  "type": integer("type"),
  "name": varchar("name", { length: 40 }),
  "abbr": varchar("abbr", { length: 10 }),
  "icon": varchar("icon", { length: 10 }),
  "username": varchar("username", { length: 40 }),
  "userpic": varchar("userpic", { length: 40 }),
}, (table) => [
  primaryKey({ name: "alliance_comment_PRIMARY", columns: [table["uid"]] }),
  index("alliance_comment_index_allianceId").on(sql.raw("\"allianceId\"")),
  check("alliance_comment_message_length", sql.raw("octet_length(\"message\") <= 65535")),
]);
