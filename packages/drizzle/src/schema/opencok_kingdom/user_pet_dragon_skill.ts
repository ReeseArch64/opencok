import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_pet_dragon_skill = opencok_kingdom.table("user_pet_dragon_skill", {
  "uuid": varchar("uuid", { length: 32 }).notNull(),
  "uid": varchar("uid", { length: 32 }).notNull(),
  "skillId": varchar("skillId", { length: 20 }).notNull(),
  "level": integer("level"),
  "exp": integer("exp"),
  "totalExp": integer("totalExp"),
  "ownerId": integer("ownerId"),
  "index1": integer("index1"),
  "strengthenLevel": integer("strengthenLevel").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_pet_dragon_skill_PRIMARY", columns: [table["uuid"]] }),
  index("user_pet_dragon_skill_uid").on(sql.raw("\"uid\"")),
]);
