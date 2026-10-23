import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const server_push_20141106 = opencok_kingdom.table("server_push_20141106", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "type": integer("type").default(sql.raw("0")),
  "mailType": integer("mailType").default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "regStartTime": bigint("regStartTime", { mode: "bigint" }),
  "regEndTime": bigint("regEndTime", { mode: "bigint" }),
  "lastOnlineTime": bigint("lastOnlineTime", { mode: "bigint" }),
  "levelMin": integer("levelMin"),
  "levelMax": integer("levelMax"),
  "title": bytea("title"),
  "contents": bytea("contents"),
  "reward": bytea("reward"),
  "updateVersion": varchar("updateVersion", { length: 40 }),
  "state": integer("state"),
  "parse": integer("parse"),
  "notification": varchar("notification", { length: 128 }),
  "reply": integer("reply"),
}, (table) => [
  primaryKey({ name: "server_push_20141106_PRIMARY", columns: [table["uid"]] }),
  index("server_push_20141106_index_startTime").on(sql.raw("\"startTime\"")),
  check("server_push_20141106_title_length", sql.raw("octet_length(\"title\") <= 65535")),
  check("server_push_20141106_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
  check("server_push_20141106_reward_length", sql.raw("octet_length(\"reward\") <= 65535")),
]);
