import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const server_info = opencok_kingdom.table(
  "server_info",
  {
    "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
    "activityTime": bigint("activityTime", { mode: "bigint" }),
    "activationTime": bigint("activationTime", { mode: "bigint" }).default(sql.raw("0")),
    "kaifu": bigint("kaifu", { mode: "bigint" }).default(sql.raw("0")),
    "yangfu": bigint("yangfu", { mode: "bigint" }).default(sql.raw("0")),
    "daoliangStart": bigint("daoliangStart", { mode: "bigint" }).default(sql.raw("0")),
    "daoliangEnd": bigint("daoliangEnd", { mode: "bigint" }).default(sql.raw("0")),
    "shuaguaiActStart": bigint("shuaguaiActStart", { mode: "bigint" }).default(sql.raw("0")),
    "lastMergeMillis": bigint("lastMergeMillis", { mode: "bigint" }).default(sql.raw("0")),
    "thronePic": varchar("thronePic", { length: 40 }),
    "payTotalTime": bigint("payTotalTime", { mode: "bigint" }).default(sql.raw("0")),
    "crossFightServerId": integer("crossFightServerId"),
    "worldCount": integer("worldCount").default(sql.raw("1")),
    "mergeTiredRushBeginTime": bigint("mergeTiredRushBeginTime", { mode: "bigint" })
      .notNull()
      .default(sql.raw("0")),
    "resGoldAddEndTime": bigint("resGoldAddEndTime", { mode: "bigint" }).default(sql.raw("0")),
    "lastClearMilitaryMailSendTime": bigint("lastClearMilitaryMailSendTime", {
      mode: "bigint",
    }).default(sql.raw("0")),
  },
  (table) => [primaryKey({ name: "server_info_PRIMARY", columns: [table["uid"]] })],
);
