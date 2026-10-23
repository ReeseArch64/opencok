import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const alliance_boss_rank = cokdb1.table("alliance_boss_rank", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "allianceId": varchar("allianceId", { length: 40 }),
  "bossId": varchar("bossId", { length: 40 }),
  "useTime": bigint("useTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_boss_rank_PRIMARY", columns: [table["uid"]] }),
]);
