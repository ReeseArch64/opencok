import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_king_skill = opencok_kingdom.table(
  "user_king_skill",
  {
    "uuid": varchar("uuid", { length: 128 }).notNull(),
    "uid": varchar("uid", { length: 128 }).notNull(),
    "skillId": varchar("skillId", { length: 20 }).notNull(),
    "startTime": bigint("startTime", { mode: "bigint" }),
    "level": integer("level"),
    "endTime": bigint("endTime", { mode: "bigint" }),
    "todayUseTimes": integer("todayUseTimes").notNull().default(sql.raw("0")),
    "checkDay": bigint("checkDay", { mode: "bigint" }).default(sql.raw("0")),
    "hasDonatedMaterial": integer("hasDonatedMaterial").notNull().default(sql.raw("0")),
    "isSuccessLast": integer("isSuccessLast").default(sql.raw("1")),
  },
  (table) => [primaryKey({ name: "user_king_skill_PRIMARY", columns: [table["uuid"]] })],
);
