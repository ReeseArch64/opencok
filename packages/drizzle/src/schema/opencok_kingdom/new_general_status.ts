import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const new_general_status = opencok_kingdom.table("new_general_status", {
  "uid": varchar("uid", { length: 96 }).notNull().default(sql.raw("''")),
  "newGeneralId": integer("newGeneralId").notNull().default(sql.raw("0")),
  "stateId": integer("stateId").notNull().default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "new_general_status_PRIMARY", columns: [table["uid"], table["newGeneralId"], table["stateId"]] }),
]);
