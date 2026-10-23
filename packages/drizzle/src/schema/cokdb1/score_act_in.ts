import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const score_act_in = cokdb1.table("score_act_in", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "allianceId": varchar("allianceId", { length: 255 }).notNull(),
  "actId": varchar("actId", { length: 255 }).notNull(),
  "score": integer("score").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "score_act_in_PRIMARY", columns: [table["uid"], table["allianceId"], table["actId"]] }),
  index("score_act_in_actId").on(sql.raw("\"actId\"")),
  index("score_act_in_al_idx").on(sql.raw("\"allianceId\"")),
]);
