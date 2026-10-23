// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_cross_fight_history = cokdb1.table("user_cross_fight_history", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "startTime": bigint("startTime", { mode: "bigint" }).notNull(),
  "round": integer("round").notNull(),
  "score": bigint("score", { mode: "bigint" }).default(sql.raw("0")),
  "rank": integer("rank").default(sql.raw("0")),
  "serverId": integer("serverId").notNull(),
  "worldId": integer("worldId").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_cross_fight_history_PRIMARY", columns: [table["uid"], table["startTime"], table["round"], table["worldId"]] }),
  uniqueIndex("user_cross_fight_history_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\""), sql.raw("\"startTime\""), sql.raw("\"round\""), sql.raw("\"worldId\"")),
  index("user_cross_fight_history_user_startTime").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\""), sql.raw("\"startTime\"")),
  index("user_cross_fight_history_startTime").on(sql.raw("\"startTime\"")),
]);
