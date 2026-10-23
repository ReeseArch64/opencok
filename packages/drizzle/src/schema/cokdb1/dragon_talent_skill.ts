import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const dragon_talent_skill = cokdb1.table("dragon_talent_skill", {
  "uid": varchar("uid", { length: 96 }).notNull().default(sql.raw("''")),
  "dragonId": integer("dragonId").notNull().default(sql.raw("0")),
  "skillId": varchar("skillId", { length: 60 }).notNull().default(sql.raw("''")),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "actTime": bigint("actTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "stat": integer("stat"),
  "level": integer("level"),
  "exp": integer("exp"),
  "totalExp": integer("totalExp"),
}, (table) => [
  primaryKey({ name: "dragon_talent_skill_PRIMARY", columns: [table["uid"], table["dragonId"], table["skillId"]] }),
]);
