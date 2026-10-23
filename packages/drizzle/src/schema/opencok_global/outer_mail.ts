import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_global } from "../namespaces";

export const outer_mail = opencok_global.table(
  "outer_mail",
  {
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
    "addr": bytea("addr"),
  },
  (table) => [
    primaryKey({ name: "outer_mail_PRIMARY", columns: [table["uid"]] }),
    index("outer_mail_index_startTime").on(sql.raw('"startTime"')),
    check("outer_mail_title_length", sql.raw('octet_length("title") <= 65535')),
    check("outer_mail_contents_length", sql.raw('octet_length("contents") <= 65535')),
    check("outer_mail_reward_length", sql.raw('octet_length("reward") <= 65535')),
    check("outer_mail_addr_length", sql.raw('octet_length("addr") <= 65535')),
  ],
);
