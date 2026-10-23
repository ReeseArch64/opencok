import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_cemetery_history = cokdb1.table("user_cemetery_history", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "name": varchar("name", { length: 255 }).notNull(),
  "deadSum": bigint("deadSum", { mode: "bigint" }).notNull(),
  "reviveSum": bigint("reviveSum", { mode: "bigint" }).notNull(),
  "useItemSum": integer("useItemSum").notNull(),
  "mainBuildingLevel": integer("mainBuildingLevel").notNull(),
  "rechargeSum": integer("rechargeSum").notNull(),
}, (table) => [
  primaryKey({ name: "user_cemetery_history_PRIMARY", columns: [table["uid"]] }),
]);
