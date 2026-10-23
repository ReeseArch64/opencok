import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_monster_siege = cokdb1.table("user_monster_siege", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "failTimes": integer("failTimes").default(sql.raw("0")),
  "killMonsterCount": bigint("killMonsterCount", { mode: "bigint" }).default(sql.raw("0")),
  "state": integer("state").notNull(),
  "goalRank": integer("goalRank").default(sql.raw("0")),
  "failRounds": varchar("failRounds", { length: 100 }),
  "isfinish": integer("isfinish").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_monster_siege_PRIMARY", columns: [table["uid"]] }),
  index("user_monster_siege_state_index").on(sql.raw("\"state\"")),
]);
