import { sql } from "drizzle-orm";
import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const fresh_recharge_reward = cokdb1.table("fresh_recharge_reward", {
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "id": varchar("id", { length: 255 }).notNull(),
}, (table) => [
  primaryKey({ name: "fresh_recharge_reward_PRIMARY", columns: [table["uid"], table["id"]] }),
]);
