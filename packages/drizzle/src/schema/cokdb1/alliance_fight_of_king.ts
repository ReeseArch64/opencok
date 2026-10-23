import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const alliance_fight_of_king = cokdb1.table("alliance_fight_of_king", {
  "type": integer("type").notNull(),
  "id": varchar("id", { length: 40 }).notNull(),
  "uid": varchar("uid", { length: 40 }).notNull(),
  "serverId": integer("serverId").notNull(),
  "occupyTime": bigint("occupyTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "alliance_fight_of_king_PRIMARY", columns: [table["type"], table["id"]] }),
]);
