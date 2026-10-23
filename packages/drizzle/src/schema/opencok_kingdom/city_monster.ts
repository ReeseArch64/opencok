import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const city_monster = opencok_kingdom.table("city_monster", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "nextUpdateTime": bigint("nextUpdateTime", { mode: "bigint" }),
  "bigMonster": integer("bigMonster"),
  "smallMonster": integer("smallMonster"),
  "lastUpdateTime": bigint("lastUpdateTime", { mode: "bigint" }),
  "bigMonsterInOneDay": integer("bigMonsterInOneDay"),
}, (table) => [
  primaryKey({ name: "city_monster_PRIMARY", columns: [table["uid"]] }),
]);
