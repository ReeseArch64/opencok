import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const flower_info = cokdb1.table("flower_info", {
  "uid": varchar("uid", { length: 38 }).notNull(),
  "lastflowerRanking": integer("lastflowerRanking"),
  "lastOperatorFlower": bigint("lastOperatorFlower", { mode: "bigint" }),
  "flowerUse": varchar("flowerUse", { length: 255 }),
  "lastCanvassTime": bigint("lastCanvassTime", { mode: "bigint" }).default(sql.raw("0")),
  "lastBeCanvassTime": bigint("lastBeCanvassTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "flower_info_PRIMARY", columns: [table["uid"]] }),
]);
