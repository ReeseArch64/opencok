import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_dragon_battle = cokdb1.table("user_dragon_battle", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "freeTeleport": integer("freeTeleport").default(sql.raw("0")),
  "leaveTime": bigint("leaveTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_dragon_battle_PRIMARY", columns: [table["uid"]] }),
]);
