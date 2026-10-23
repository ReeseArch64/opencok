import { sql } from "drizzle-orm";
import { bigint, check, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const alliance_member_dragon_right = cokdb1.table("alliance_member_dragon_right", {
  "uid": varchar("uid", { length: 50 }).notNull(),
  "allianceId": varchar("allianceId", { length: 50 }).notNull(),
  "canFight": smallint("canFight"),
  "leaveTime": bigint("leaveTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "alliance_member_dragon_right_PRIMARY", columns: [table["uid"], table["allianceId"]] }),
  check("alliance_member_dragon_right_canFight_range", sql.raw("\"canFight\" BETWEEN -128 AND 127")),
]);
