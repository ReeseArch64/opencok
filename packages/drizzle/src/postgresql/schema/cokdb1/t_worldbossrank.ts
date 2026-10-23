// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, smallint } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const t_worldbossrank = cokdb1.table("t_worldbossrank", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({ name: "t_worldbossrank_id_seq", startWith: 1131 }),
  "bossid": integer("bossid"),
  "bosstid": integer("bosstid"),
  "uid": legacyText("uid", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}),
  "score": integer("score"),
  "reward": smallint("reward"),
  "lastscore": integer("lastscore"),
  "lasttime": bigint("lasttime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "t_worldbossrank_PRIMARY", columns: [table["id"]] }),
  index("t_worldbossrank_Index_bossid").on(sql.raw("\"bossid\"")),
  check("t_worldbossrank_reward_range", sql.raw("\"reward\" BETWEEN -128 AND 127")),
]);
