import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const t_worldbossrank = opencok_kingdom.table(
  "t_worldbossrank",
  {
    "id": integer("id")
      .notNull()
      .generatedByDefaultAsIdentity({ "name": "t_worldbossrank_id_seq", "startWith": 1131 }),
    "bossid": integer("bossid"),
    "bosstid": integer("bosstid"),
    "uid": varchar("uid", { length: 32 }),
    "score": integer("score"),
    "reward": smallint("reward"),
    "lastscore": integer("lastscore"),
    "lasttime": bigint("lasttime", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({ name: "t_worldbossrank_PRIMARY", columns: [table["id"]] }),
    index("t_worldbossrank_Index_bossid").on(sql.raw('"bossid"')),
    check("t_worldbossrank_reward_range", sql.raw('"reward" BETWEEN -128 AND 127')),
  ],
);
