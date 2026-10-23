// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyBytes } from "../../types";
import { cokdb_global } from "../namespaces";
export const server_info = cokdb_global.table("server_info", {
  "id": integer("id").notNull(),
  "type": integer("type").notNull().default(sql.raw("0")),
  "cross_fight_server_id": integer("cross_fight_server_id"),
  "fightRoomSize": integer("fightRoomSize"),
  "beginTime": bigint("beginTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "open_time_info": legacyBytes("open_time_info"),
}, (table) => [
  primaryKey({ name: "server_info_PRIMARY", columns: [table["id"]] }),
]);
