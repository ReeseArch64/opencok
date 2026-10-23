import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const new_general_skill = cokdb1.table("new_general_skill", {
  "uid": varchar("uid", { length: 96 }).notNull().default(sql.raw("''")),
  "newGeneralId": integer("newGeneralId").notNull().default(sql.raw("0")),
  "skillId": varchar("skillId", { length: 60 }).notNull().default(sql.raw("''")),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "actTime": bigint("actTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "stat": integer("stat"),
}, (table) => [
  primaryKey({ name: "new_general_skill_PRIMARY", columns: [table["uid"], table["newGeneralId"], table["skillId"]] }),
]);
