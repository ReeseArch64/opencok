import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const king_skill_status = cokdb1.table("king_skill_status", {
  "id": integer("id").notNull().default(sql.raw("0")),
  "kingMsg": varchar("kingMsg", { length: 2048 }).notNull(),
  "curChooseSkill": varchar("curChooseSkill", { length: 128 }),
  "skillMaterial": bigint("skillMaterial", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "king_skill_status_PRIMARY", columns: [table["id"]] }),
]);
