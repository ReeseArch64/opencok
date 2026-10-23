import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_skill = opencok_kingdom.table("alliance_skill", {
  "uuid": varchar("uuid", { length: 128 }).notNull(),
  "skillId": varchar("skillId", { length: 128 }),
  "curEnergy": integer("curEnergy"),
  "costEnergy": integer("costEnergy"),
  "buildingUid": varchar("buildingUid", { length: 256 }),
  "effect": integer("effect").default(sql.raw("0")),
  "effectValue": integer("effectValue").default(sql.raw("0")),
  "statusId": varchar("statusId", { length: 11 }).default(sql.raw("'0'")),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "alliance_skill_PRIMARY", columns: [table["uuid"]] }),
]);
