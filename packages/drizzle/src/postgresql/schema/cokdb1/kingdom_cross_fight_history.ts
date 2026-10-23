// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const kingdom_cross_fight_history = cokdb1.table("kingdom_cross_fight_history", {
  "serverId": legacyText("serverId", {"sqlType":"character varying(10)","collation":"C"}).notNull(),
  "startTime": bigint("startTime", { mode: "bigint" }).notNull(),
  "round": integer("round").notNull(),
  "score": bigint("score", { mode: "bigint" }).default(sql.raw("0")),
  "rank": integer("rank").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "kingdom_cross_fight_history_PRIMARY", columns: [table["serverId"], table["startTime"], table["round"]] }),
  uniqueIndex("kingdom_cross_fight_history_PRIMARY_pad").on(sql.raw("rtrim(\"serverId\", ' ') COLLATE \"C\""), sql.raw("\"startTime\""), sql.raw("\"round\"")),
  index("kingdom_cross_fight_history_kingdom_startTime").on(sql.raw("rtrim(\"serverId\", ' ') COLLATE \"C\""), sql.raw("\"startTime\"")),
  index("kingdom_cross_fight_history_startTime").on(sql.raw("\"startTime\"")),
]);
